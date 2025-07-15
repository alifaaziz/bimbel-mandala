<script setup>
import { ref, onMounted } from 'vue'
import { NButton, NIcon } from 'naive-ui'

const programs = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  const res = await fetch('/packages/my', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  programs.value = data || []
})

function formatTime(timeStr) {
  if (!timeStr) return '-'
  const date = new Date(timeStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatGroupType(groupTypeArr) {
  if (!Array.isArray(groupTypeArr) || groupTypeArr.length === 0) return '-'
  if (groupTypeArr.some(gt => gt.type === 'kelas')) return 'Kelas'
  return 'Privat/Kelompok'
}
</script>

<template>
  <div class="program-card">
    <div class="card-header headerb3">Program Terbuka</div>
    <div class="card-body">
      <table class="program-table">
        <tbody>
          <tr v-for="(program, index) in programs" :key="index">
            <td data-label="Program">
              <span class="bodysb3">{{ program.name }} {{ program.level }}</span><br />
            </td>
            <td class="bodyr3" data-label="Jenis">{{ formatGroupType(program.groupType) }}</td>
            <td class="bodyr3" data-label="Hari">{{ program.days.join(', ') }}</td>
            <td class="bodyr3" data-label="Jam">{{ formatTime(program.time) }}</td>
            <td class="bodyr3" data-label="Durasi">{{ program.duration }} Menit</td>
            <td data-label="Aksi">
              <n-button
                ghost
                color="#154484"
                class="but-table"
                @click="$router.push(`/detailprogram/${program.slug}`)"
              >
                <n-icon>
                  <img src="@/assets/icons/more-horizontal.svg" alt="">
                </n-icon>
              </n-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<style scoped>
.program-card {
  border: 1px solid #f39c12;
  border-radius: 12px;
  overflow: hidden;
  max-width: 100%;
  background-color: white;
  color: #061222;
}

.card-header {
  background-color: #154288;
  color: white;
  padding: 12px 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-body {
  padding: 16px;
  overflow-x: auto;
}

.program-table {
  width: 100%;
  border-collapse: collapse;
}

.program-table td {
  padding: 8px;
  vertical-align: middle;
  font-size: 14px;
  white-space: nowrap;
}

.program-table td:first-child {
  font-weight: 600;
  color: #2c3e50;
}

.program-table tr + tr td {
  border-top: 1px solid #eee;
}

.but-table {
  font-size: 24px;
  border-radius: 2rem;
}

/* 📱 RESPONSIVE TABLE */
@media (max-width: 768px) {
  .program-table,
  .program-table tbody,
  .program-table tr,
  .program-table td {
    display: block;
    width: 100%;
  }

  .program-table tr {
    margin-bottom: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 0.5rem;
    background-color: #fafafa;
  }

  .program-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    border: none !important;
    font-size: 13px;
  }

  .program-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #154288;
    margin-right: 1rem;
  }

  .but-table {
    align-self: flex-start;
  }
}
</style>

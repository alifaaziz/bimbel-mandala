<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { NTag, NTable } from 'naive-ui'

function statusLabel(status) {
  switch (status) {
    case "masuk": return "Masuk"
    case "jadwal_ulang": return "Jadwal Ulang"
    case "izin": return "Izin"
    case "terlambat": return "Terlambat"
    default: return status
  }
}

const tagTypeMap = {
  "Jadwal Ulang": "warning",
  "Masuk": "info",
  "Terlambat": "error",
  "Izin": "error",
}

const attendanceData = ref([])

const route = useRoute()
const slug = route.params.slug

onMounted(async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`/attendance/${slug}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const result = await res.json()
      attendanceData.value = result.data.map(item => ({
        name: item.name,
        time: item.jamAbsen,
        status: item.status,
        note: item.reason
      }))
    }
  } catch (err) {
    attendanceData.value = []
  }
})
</script>

<template>
  <n-table class="table" :bordered="true" :single-line="false">
    <thead>
      <tr class="bodyb2">
        <th class="th">Nama</th>
        <th class="th">Jam</th>
        <th class="th">Status</th>
        <th class="th">Keterangan</th>
      </tr>
    </thead>
    <tbody class="bodyr2">
      <tr v-for="(item, index) in attendanceData" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.time }}</td>
        <td>
          <n-tag
            :type="tagTypeMap[statusLabel(item.status)]"
            round
            size="small"
            class="bodym3"
          >
            {{ statusLabel(item.status) }}
          </n-tag>
        </td>
        <td>{{ item.note }}</td>
      </tr>
    </tbody>
  </n-table>
</template>

<style scoped>
.table {
  border-radius: 12px;
  border-color: #FCA654;
}
.th {
  background-color: #154484;
  color: #DEE4EE;
  padding: 0.75rem;
}
td {
  padding: 0.75rem;
}
</style>

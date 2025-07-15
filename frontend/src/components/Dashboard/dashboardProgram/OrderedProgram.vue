<template>
  <div class="ordered-program-container">
    <div class="header-row">
      <h2 class="main-title">Program Terpesan</h2>
      <div class="pagination-wrapper">
        <button
          class="pagination-btn"
          :disabled="page === 1"
          @click="prevPage"
        >&lt;</button>
        <button
          class="pagination-btn"
          :disabled="page >= Math.ceil(total / pageSize)"
          @click="nextPage"
        >&gt;</button>
      </div>
    </div>
    <n-card class="program-card">
      <div v-if="loading" style="text-align:center;padding:24px;">Loading...</div>
      <div v-else>
        <div v-for="order in orders" :key="order.id" class="card-content">
          <n-thing>
            <template #header>
              <span class="course-title">{{ order.packageName }} {{ order.level }}</span>
            </template>
            <template #description>
              <span class="instructor-name">{{ order.tutorName }}</span>
            </template>
          </n-thing>
          <n-button ghost type="primary" @click="goToVerifProgram(order.id)">
            Aksi
          </n-button>
        </div>
        <div v-if="orders.length === 0" style="text-align:center;color:#888;">Tidak ada data</div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NButton, NH2, NThing } from 'naive-ui'

const router = useRouter()
const orders = ref([])
const page = ref(1)
const pageSize = 2
const total = ref(0)
const loading = ref(false)

async function fetchOrders() {
  loading.value = true
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`/orders?page=${page.value}&limit=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    orders.value = json.data.data || []
    total.value = json.data.total || 0
  } catch (err) {
    orders.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function goToVerifProgram(id) {
  router.push(`/dashboardadmin/programadmin/verif/${id}`)
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    fetchOrders()
  }
}

function nextPage() {
  if (page.value * pageSize < total.value) {
    page.value++
    fetchOrders()
  }
}

onMounted(fetchOrders)
</script>

<style scoped>
.ordered-program-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 400px;
}
.main-title {
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 16px;
}
.program-card {
  border-radius: 12px !important;
  background-color: #eef2f7 !important;
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
}
.course-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e1e1e;
}
.instructor-name {
  font-size: 0.95rem;
  color: #6b7280;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.pagination-wrapper {
  display: flex;
  gap: 8px;
}
.pagination-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #154484;
  background: #fff;
  color: #154484;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
}
</style>
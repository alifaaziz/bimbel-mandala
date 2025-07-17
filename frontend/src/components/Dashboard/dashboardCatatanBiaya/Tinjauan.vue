<script setup>
import { formatTanggal } from '@/utils/formatTanggal'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const dataTable = ref([])
const loading = ref(false)

async function fetchTinjauan() {
  loading.value = true
  const classId = route.params.classId
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`http://localhost:3000/attendance/alert/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const json = await res.json()
    dataTable.value = (json.data || []).map(item => ({
      jenis: item.jenis,
      tanggal: item.tanggal
        ? `${formatTanggal(item.tanggal)}, ${formatWaktu(item.tanggal)}` : '-',
      pertemuan: item.meet,
      jam: item.waktuAbsen,
      keterangan: item.keterangan
    }))
  } catch (e) {
    dataTable.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchTinjauan)
</script>

<template>
  <n-table class="table">
    <thead>
      <tr class="bodyb2">
        <th class="th">Jenis</th>
        <th class="th">Tanggal</th>
        <th class="th">Pertemuan</th>
        <th class="th">Waktu Absen</th>
        <th class="th">Keterangan</th>
      </tr>
    </thead>
    <tbody class="body">
      <tr
        v-for="(item, index) in dataTable"
        :key="index"
        class="bodyr2"
      >
        <td
        :class="{
          'row-keterlambatan': item.jenis === 'Keterlambatan',
          'row-pembatalan': item.jenis === 'Pembatalan'
        }"
        >{{ item.jenis }}</td>
        <td
        :class="{
          'row-keterlambatan': item.jenis === 'Keterlambatan',
          'row-pembatalan': item.jenis === 'Pembatalan'
        }"
        >{{ item.tanggal }}</td>
        <td
        :class="{
          'row-keterlambatan': item.jenis === 'Keterlambatan',
          'row-pembatalan': item.jenis === 'Pembatalan'
        }"
        >{{ item.pertemuan }}</td>
        <td
        :class="{
          'row-keterlambatan': item.jenis === 'Keterlambatan',
          'row-pembatalan': item.jenis === 'Pembatalan'
        }"
        >{{ item.jam }}</td>
        <td
        :class="{
          'row-keterlambatan': item.jenis === 'Keterlambatan',
          'row-pembatalan': item.jenis === 'Pembatalan'
        }"
        >{{ item.keterangan }}</td>
      </tr>
    </tbody>
  </n-table>
</template>

<style scoped>
.table {
  border-radius: 12px;
  border-color: #DEE4EE;
}
.th {
  background-color: #154484;
  color: #DEE4EE;
}

:deep(tr .row-keterlambatan) {
  background-color: #FFF5CC; /* kuning lembut */
}

:deep(tr .row-pembatalan) {
  background-color: #FFD8D6; /* merah lembut */
}
</style>

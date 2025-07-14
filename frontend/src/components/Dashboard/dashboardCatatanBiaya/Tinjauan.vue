<script setup>
import { ref } from 'vue'

const dataTable = ref([
  {
    jenis: 'Keterlambatan',
    tanggal: '2025-07-10',
    pertemuan: '12',
    jam: '15:00',
    keterangan: "Melakukan absensi pukul 15:50"
  },
  {
    jenis: 'Pembatalan',
    tanggal: '2025-07-12',
    pertemuan: '13',
    jam: '15:00 ',
    keterangan: 'Tidak ada absensi siswa'
  }
])
</script>

<template>
  <n-table class="table">
    <thead>
      <tr class="bodyb2">
        <th class="th">Jenis</th>
        <th class="th">Tanggal</th>
        <th class="th">Pertemuan</th>
        <th class="th">Jam</th>
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

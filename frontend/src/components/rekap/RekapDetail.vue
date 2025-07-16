<template>
  <h1 class="headersb2 judul-rekap">Rekap Program Siswa</h1>
  <n-collapse accordion>
    <n-collapse-item 
      class="tabel-rekap"
      v-for="program in rekap"
      :key="program.kode"
    >
      <template #header>
        <div class="judul-container">
          <div class="headersb2">
            {{ program.judul }} {{program.jenjang}} - {{ program.tutor.nama }}
          </div>
          <span class="bodyr2">Kode Program: #{{ program.kode }}</span>
        </div>
      </template>

      <div class="data-tabelrekap">
        <div class="perdata-rekap">
          <h2 class="headersb3">Rekap Tutor</h2>
          <p><span>Nama</span> : {{ program.tutor.nama }}</p>
          <p><span>Hadir</span> : {{ program.tutor.hadir }}</p>
          <p><span>Izin</span> : {{ program.tutor.izin }}</p>
          <p><span>Absen</span> : {{ program.tutor.absen }}</p>
        </div>

        <div class="perdata-rekap">
          <h2 class="headersb3">Rekap Siswa</h2>
          <p><span>Pertemuan</span> : {{ program.siswa.pertemuan }}</p>
          <p><span>Hadir</span> : {{ program.siswa.hadir }}</p>
          <p><span>Izin</span> : {{ program.siswa.izin }}</p>
          <p><span>Absen</span> : {{ program.siswa.absen }}</p>
        </div>

        <div class="perdata-rekap">
          <h2 class="headersb3">Program</h2>
          <p><span>Pertemuan</span> : {{ program.program.pertemuan }}</p>
          <p><span>Kosong</span> : {{ program.program.kosong }}</p>
          <p><span>Progress</span> : {{ program.program.progress }}</p>
          <p><span>Absensi</span> : {{ program.program.absensi }}</p>
        </div>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const rekap = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  const res = await fetch('http://localhost:3000/attendance/my', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  rekap.value = (data || []).map(item => ({
    judul: item.bimbelPackage?.name || '-',
    jenjang: item.bimbelPackage?.level || '-',
    kode: item.classCode || '-',
    tutor: {
      nama: item.tutorStats?.name || '-',
      hadir: item.tutorStats?.masuk ?? '-',
      izin: item.tutorStats?.izin ?? '-',
      absen: item.tutorStats?.alpha ?? '-',
    },
    siswa: {
      pertemuan: item.studentStats?.totalSchedules ?? '-',
      hadir: item.studentStats?.masuk ?? '-',
      izin: item.studentStats?.izin ?? '-',
      absen: item.studentStats?.alpha ?? '-',
    },
    program: {
      pertemuan: `${item.studentStats?.totalSchedules ?? '-'} Pertemuan`,
      kosong: `${(item.studentStats?.kosong ?? 0)} Pertemuan`,
      progress: `${item.studentStats?.scheduleProgress ?? 0}%`,
      absensi: `${item.studentStats?.totalAttendance ?? 0}%`
    }
  }))
})
</script>

<style scoped>
.judul-rekap{
  color: #154484;
  margin-bottom: 1rem;
}
.judul-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  color: #DEE4EE;
}

.tabel-rekap {
  background-color: #154484;
  border-radius: 1rem;
  padding: 12px 12px;
}
.data-tabelrekap {
  display: flex; 
  justify-content: space-between;
  background-color: white;
  padding: 2rem 4rem;
  border-radius: 1rem;
  gap: 1rem;
}
.data-tabelrekap .headersb3{
  color: #154484;
}
.perdata-rekap{
  width: 210px;
}
::v-deep(.n-collapse-item__header) {
  padding: 0  !important;
}
::v-deep(.n-collapse-item__header .n-base-icon) {
  color: #DEE4EE;
}
@media (max-width: 768px) {
  .data-tabelrekap {
    flex-direction: column;
    padding: 1.5rem 1rem;
  }

  .perdata-rekap {
    width: 100%;
  }

  .judul-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }
  .judul-container .headersb2 {
    font-size: 14px;
  }
}
</style>
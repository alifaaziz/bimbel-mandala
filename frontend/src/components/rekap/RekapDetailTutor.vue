<template>
  <h1 class="headersb2 judul-rekap">Rekap Program Tutor</h1>
  <n-collapse accordion>
    <n-collapse-item 
      class="tabel-rekap"
      v-for="program in rekap"
      :key="program.kode"
    >
      <template #header>
        <div class="div-judulrekap">
          <div class="judul-container">
            <div class="headersb2">
              {{ program.judul }} {{program.jenjang}} - {{ program.tutor.nama }}
            </div>
            <span class="bodyr2">Kode Program: #{{ program.kode }}</span>
          </div>
          <ButDownloadSecondSmall @click.stop="downloadRekap(program)"/>
        </div>
      </template>

      <div class="container-tabelrekap">
        <div class="data-tabelrekap">
          <div class="perdata-rekap">
            <h2 class="headersb3">Rekap Tutor</h2>
            <p><span>Nama</span> : {{ program.tutor.nama }}</p>
            <p><span>Hadir</span> : {{ program.tutor.hadir }}</p>
            <p><span>Absen</span> : {{ program.tutor.absen }}</p>
            <p><span>Kosong</span> : {{ program.tutor.alpha }}</p>
          </div>
  
          <div class="perdata-rekap">
            <h2 class="headersb3">Program</h2>
            <p><span>Pertemuan</span> : {{ program.program.pertemuan }}</p>
            <p><span>Kosong</span> : {{ program.program.kosong }}</p>
            <p><span>Progress</span> : {{ program.program.progress }}</p>
            <p><span>Absensi</span> : {{ program.program.absensi }}</p>
          </div>
        </div>
        <n-divider />
        <div class="perdata-rekap">
            <p><span>Kesesuaian</span> : {{ program.kesesuaian }}</p>
            <p><span>Honor</span> : {{ formatRupiah(program.honor) }}</p>
            <p><span>Diterima</span> : {{ formatRupiah(program.diterima) }}</p>
            <p><span>Status</span> : {{ program.status }}</p>
        </div>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ButDownloadSecondSmall from '../dirButton/butDownloadSecondSmall.vue'

const rekap = ref([])

function formatRupiah(value) {
  return 'Rp ' + Number(value).toLocaleString('id-ID');
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  const res = await fetch('localhost:3000/attendance/my', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  rekap.value = (data || []).map(item => ({
    classId: item.classId || '-',
    judul: item.bimbelPackage?.name || '-',
    jenjang: item.bimbelPackage?.level || '-',
    kode: item.classCode || '-',
    tutor: {
      nama: item.tutorStats?.name || '-',
      hadir: item.tutorStats?.masuk ?? '-',
      absen: item.tutorStats?.alpha ?? '-',
      alpha: item.tutorStats?.alpha ?? '-'
    },
    program: {
      pertemuan: `${item.tutorStats?.totalSchedules ?? '-'} Pertemuan`,
      kosong: `${item.kosong ?? 0} Pertemuan`,
      progress: `${item.tutorStats?.scheduleProgress ?? 0}%`,
      absensi: `${item.tutorStats?.totalAttendance ?? 0}%`
    },
    kesesuaian: `${item.kesesuaian || '-'}%`, 
    honor: item.tutorStats?.salary ?? 0,
    diterima: item.tutorStats?.payroll ?? 0,
    status: item.tutorStats?.status === 'pending' ? 'Belum Terbayar' : 'Terbayar'
  }))
})

function downloadRekap(program) {
  const token = localStorage.getItem('token')
  if (!token) return
  fetch(`/attendance/download/${program.classId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async res => {
      if (!res.ok) throw new Error('Gagal download rekap')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rekap_${program.kode}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    })
    .catch(err => {
      alert('Gagal download rekap')
      console.error(err)
    })
}
</script>

<style scoped>

.div-judulrekap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.judul-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  color: #DEE4EE;
  flex-wrap: wrap;
}

.judul-rekap{
  color: #154484;
  margin-bottom: 1rem;
}
.tabel-rekap {
  background-color: #154484;
  border-radius: 1rem;
  padding: 12px 12px;
}
.container-tabelrekap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  padding: 2rem 4rem;
  border-radius: 1rem;
  border: 2px solid #FDC998;
}
.data-tabelrekap {
  display: flex; 
  justify-content: left;
  gap: 2rem;
}
.headersb3{
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
.btn-download {
  margin: 1.5rem 0 0 0;
  background: #154484;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 28px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
}
.btn-download:hover {
  background: #0f3b71;
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

@media (max-width: 700px) {
  .div-judulrekap {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
  .judul-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    width: 100%;
  }
  .judul-container .headersb2 {
    font-size: 1rem;
    word-break: break-word;
  }
  .judul-container .bodyr2 {
    font-size: 0.95rem;
    word-break: break-word;
  }
}
::v-deep(.n-divider) {
  margin: 1.5rem 0;
  border-top: 2px solid #FDC998;
  opacity: 0.5;
}
</style>
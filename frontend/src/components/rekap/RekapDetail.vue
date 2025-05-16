<template>
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
          <p><span>Kosong</span> : {{ program.tutor.kosong }}</p>
        </div>

        <div class="perdata-rekap">
          <h2 class="headersb3">Rekap Siswa</h2>
          <p><span>Pertemuan</span> : {{ program.siswa.pertemuan }}</p>
          <p><span>Hadir</span> : {{ program.siswa.hadir }}</p>
          <p><span>Izin</span> : {{ program.siswa.izin }}</p>
          <p><span>Absen</span> : {{ program.siswa.absen }}</p>
          <p><span>Kosong</span> : {{ program.siswa.kosong }}</p>
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
const rekap = [
  {
    judul: 'Fokus UTBK',
    jenjang: 'SMA',
    kode: '11204',
    tutor: {
      nama: 'Pak Wendy S.Pd, M.Pd',
      hadir: 140,
      izin: 1,
      absen: 0,
      kosong: 3
    },
    siswa: {
      pertemuan: 144,
      hadir: 140,
      izin: 2,
      absen: 1,
      kosong: 1
    },
    program: {
      pertemuan: '6 Bulan (3x perminggu)',
      kosong: '4 Pertemuan',
      progress: '100%',
      absensi: '97,22%'
    }
  },
  {
    judul: 'Matematika',
    jenjang: 'SMA',
    kode: '11202',
    tutor: {
      nama: 'Pak Wendy S.Pd, M.Pd',
      hadir: 138,
      izin: 2,
      absen: 0,
      kosong: 4
    },
    siswa: {
      pertemuan: 144,
      hadir: 138,
      izin: 3,
      absen: 2,
      kosong: 1
    },
    program: {
      pertemuan: '6 Bulan (3x perminggu)',
      kosong: '5 Pertemuan',
      progress: '98%',
      absensi: '96%'
    }
  },
  {
    judul: 'Kimia',
    jenjang: 'SMA',
    kode: '11201',
    tutor: {
      nama: 'Pak Wendy S.Pd, M.Pd',
      hadir: 136,
      izin: 4,
      absen: 1,
      kosong: 3
    },
    siswa: {
      pertemuan: 144,
      hadir: 136,
      izin: 5,
      absen: 2,
      kosong: 1
    },
    program: {
      pertemuan: '6 Bulan (3x perminggu)',
      kosong: '6 Pertemuan',
      progress: '95%',
      absensi: '94%'
    }
  }
]
</script>

<style scoped>
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
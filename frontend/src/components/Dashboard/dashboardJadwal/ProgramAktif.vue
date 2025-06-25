<template>
  <n-card :bordered="false" content-style="padding: 16px;">
    <n-h2 style="margin-top: 0; margin-bottom: 24px;">
      <n-text>
        Program Aktif
      </n-text>
    </n-h2>

    <n-space vertical :size="16">
      <n-card
        v-for="program in activePrograms"
        :key="program.kode"
        :bordered="false"
        class="program-item"
        hoverable
        @click="handleProgramClick(program)"
      >
        <n-space justify="space-between" align="center">
          <div>
            <n-text strong style="font-size: 16px;">{{ program.nama }}</n-text>
            <br />
            <n-text :depth="3" style="font-size: 14px;">{{ program.pengajar }}</n-text>
          </div>

          <n-text :depth="2">{{ program.kode }}</n-text>
        </n-space>
      </n-card>
    </n-space>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import { NCard, NSpace, NH2, NText } from 'naive-ui';

// Data statis untuk program aktif
// Dalam aplikasi nyata, data ini kemungkinan besar berasal dari API
const activePrograms = ref([
  {
    nama: 'Matematika SMA',
    pengajar: 'Pak Dendy Wan S.Pd',
    kode: '#11234',
  },
  {
    nama: 'Matematika SD',
    pengajar: 'Bu Luna S.Pd',
    kode: '#11355',
  },
  {
    nama: 'Fisika SMA',
    pengajar: 'Bu Wendy S.Pd',
    kode: '#11237',
  },
  {
    nama: 'Seni SMA',
    pengajar: 'Pak Wahyu Hendi S.Pd',
    kode: '#11244',
  },
]);

// Fungsi contoh ketika sebuah item program di-klik
const handleProgramClick = (program) => {
  console.log('Program diklik:', program.nama);
  // Anda bisa menambahkan logika navigasi atau menampilkan modal di sini
  alert(`Anda memilih program: ${program.nama}`);
};
</script>

<style scoped>
.program-item {
  /* Warna latar belakang abu-abu kebiruan seperti pada gambar */
  background-color: #eef2f7; 
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mengubah warna latar saat di-hover untuk memberikan feedback visual */
.program-item:hover {
  background-color: #e3e9f0;
}

/* Mengatur ukuran font default dalam komponen */
.n-card {
  font-family: 'Inter', sans-serif; /* Ganti dengan font yang sesuai */
}

.n-h2 {
    font-weight: 600;
}
</style>
<script setup>
import { tutors } from '@/assets/dataSementara/tutor.js';
import { NCard } from 'naive-ui';
import butJadwal from '../dirButton/butJadwal.vue';
import Scheduled from './Scheduled.vue';
import butDetailJadwal from '../dirButton/butDetailJadwal.vue';

// Batasi hanya 4 tutor yang ditampilkan
const displayedTutors = tutors.value.slice(0, 4);
</script>

<template>
  <div class="tutor-component">
    <h1 class="headerr2 title1">Jadwal Program</h1>
    <h2 class="headerb1 title2">Terdekat</h2>
    <div class="card-container">
      <n-card
        v-for="(item, index) in displayedTutors"
        :key="item.id"
        :id="item.id"
         style="border: 1px solid #154484; border-radius: 20px;"
      >
        <template #cover>
            <img src="/tutor/3.png">
        </template>
        <template #header>
          <div class="headerr3 jadwal_title">
            Matematika, SMA
            <Scheduled />
          </div>
        </template>
        <div class="bodyr3 content">
            <div class="info-row"><strong>Hari</strong><span>: Rabu, 12 Maret 2025</span></div>
            <div class="info-row"><strong>Pukul</strong><span>: 15:00 WIB</span></div>
        </div>
        <butDetailJadwal />
      </n-card>
    </div>
    <butJadwal />
  </div>
</template>

<style scoped>

.tutor-component {
  place-items: center;
}
.card-container {
  display: flex;
  gap: 24px; /* Jarak antar kartu */
  flex-wrap: wrap; /* Membuat kartu turun ke baris berikutnya jika tidak muat */
  margin-bottom: 1rem;
}

.n-card {
  flex: 1; /* Membuat lebar kartu fleksibel */
  max-width: 500px; /* Batas maksimum lebar kartu */
  border-radius: 20px;
}

.n-card img {
  width: 100%; /* Membuat gambar menyesuaikan lebar kartu */
  aspect-ratio: 4 / 3; /* Menetapkan rasio 4:3 */
  object-fit: cover; /* Memastikan gambar tidak terdistorsi */
  border-radius: 20px 20px 0px 0px; /* Opsional: Menambahkan sudut melengkung */
}

.n-card .content {
  color: #061222;
  margin-bottom: 1rem;
}

.jadwal_title {
  display: flex;
  gap: 1rem;
  align-items: baseline;
}
.caption {
  color: #9BAFCB;
  text-align: left;
}
.content {
  color: #9BAFCB;
}

.title1 {
    color: #FDC998 !important;
    text-align: center;
}
.title2 {
    color: #154484;
    text-align: center;
    margin-bottom: 12px;
}

/* Media query untuk layar di bawah 961px */
@media (max-width: 960px) {
  .card-container {
    display: grid; /* Ubah menjadi grid layout */
    grid-template-columns: repeat(2, 1fr); /* Dua kolom dengan lebar yang sama */
    gap: 16px; /* Kurangi jarak antar kartu */
  }
  
  .n-card {
    max-width: 100%; /* Kartu menyesuaikan lebar kolom */
  }
}
</style>
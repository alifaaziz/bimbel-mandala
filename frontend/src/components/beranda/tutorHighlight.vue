<script setup>
import { tutors } from '@/assets/dataSementara/tutor.js';
import { NCard } from 'naive-ui';
import butProfile from '../dirButton/butProfile.vue';

// Batasi hanya 4 tutor yang ditampilkan
const displayedTutors = tutors.value.slice(0, 4);
</script>

<template>
  <div class="padding-components tutor-component">
    <h1 class="headerr2 title1">Berbagai</h1>
    <h2 class="headerb1 title2">Tutor Profesional</h2>
    <div class="card-container">
      <n-card
        v-for="(item, index) in displayedTutors"
        :key="item.id"
        :id="item.id"
      >
        <template #header>
          <div class="headersb3 name">
            {{ item.title }}
            <div class="bodyr4 caption">{{ item.caption }}</div>
          </div>
        </template>
        <template #cover>
          <img :src="item.image" alt="Card Image">
        </template>
        <div class="bodyr3 content">
          {{ item.content }}
        </div>
      </n-card>
    </div>
    <butProfile />
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
  border-radius: 20px; /* Opsional: Menambahkan sudut melengkung */
}

.name {
  color: #154484;
  text-align: left;
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
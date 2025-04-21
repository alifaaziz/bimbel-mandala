<script setup>
import { tutors } from '@/assets/dataSementara/tutor.js';
import { NCard } from 'naive-ui';
</script>

<template>
  <div class="card-container">
    <n-card
      v-for="(item, index) in tutors"
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
</template>

<style scoped>
.card-container {
  display: grid; /* Ubah menjadi grid layout */
  grid-template-columns: repeat(4, 1fr); /* Maksimal 4 kolom */
  gap: 24px; /* Jarak antar kartu */
  padding: 0 8rem;
}

.n-card {
  max-width: 100%; /* Kartu menyesuaikan lebar kolom */
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

/* Media query untuk layar di bawah 961px */
@media (max-width: 960px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr); /* Dua kolom dengan lebar yang sama */
    padding: 0 2rem
  }
}
</style>
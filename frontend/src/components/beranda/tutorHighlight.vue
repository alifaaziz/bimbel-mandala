<script setup>
import { ref, onMounted } from 'vue';
import { NCard } from 'naive-ui';
import butProfile from '../dirButton/butProfile.vue';

const displayedTutors = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('/users/tutors/');
    const json = await res.json();
    displayedTutors.value = json.data.slice(0, 4);
  } catch (e) {
    displayedTutors.value = [];
  }
});
</script>

<template>
  <div class="padding-components tutor-component">
    <h1 class="headerr2 title1">Berbagai</h1>
    <h2 class="headerb1 title2">Tutor Profesional</h2>
    <div class="card-container">
      <n-card
        v-for="(item) in displayedTutors"
        :key="item.id"
        :id="item.id"
      >
        <template #header>
          <div class="headersb3 name">
            {{ item.name }}
            <div class="bodyr4 caption">{{ item.subject }} {{ item.teachLevel }}</div>
          </div>
        </template>
        <template #cover>
          <img
            :src="item.photo ? `${item.photo}` : 'https://via.placeholder.com/400x300?text=No+Photo'"
            alt="Card Image"
          >
        </template>
        <div class="bodyr3 content">
          {{ item.description }}
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
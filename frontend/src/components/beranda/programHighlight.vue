<script setup>
import { NCard } from 'naive-ui';
import { paketBimbel } from '@/assets/dataSementara/paketBimbel.js';
import ButtonProgram from '../dirButton/butprogram.vue';
import { defineEmits } from 'vue';

const limitedPrograms = paketBimbel.slice(0, 2);

// Mendefinisikan event yang akan dipancarkan
const emit = defineEmits(['refreshPage']);

// Fungsi untuk memformat waktu
function formatTime(dateTime) {
  const time = dateTime.split('T')[1]; // Ambil bagian waktu setelah 'T'
  const [hour, minute] = time.split(':');
  return `${hour}:${minute} WIB`;
}

function handleClick() {
  // Memancarkan event 'refreshPage'
  emit('refreshPage');
}
</script>

<template>
  <div class="padding-components">
    <h1 class="headerr2 title1">Program</h1>
    <h2 class="headerb1 title2">Unggulan</h2>
    
    <div class="card-container">
      <n-card 
        v-for="program in limitedPrograms" 
        :key="program.id"
        class="n-card"
        style="width: 584px; height: 304px; margin: 0 auto; background-color: #003366;"
      >
        <div class="card-content">
          <!-- Bagian gambar -->
          <div class="card-image">
            <img 
              :src="program.photo || '/public/tutor/3.png'" 
              :alt="`Image of ${program.name}`" 
            />
            <p class="privat">{{ program.groupType[0].type }}</p>
          </div>
          <!-- Bagian teks -->
          <div class="card-text">
            <div class="header">
              <div class="title-group">
                <h3>{{ program.name }}</h3>
                <p class="name">{{ program.tutorName }}</p>
              </div>
              <div class="badge">{{ program.level }}</div>
            </div>
            <p><strong>Area:</strong> {{ program.area }}</p>
            <p><strong>Hari:</strong> {{ program.days.join(', ') }}</p>
            <p><strong>Pukul:</strong> {{ formatTime(program.time) }}</p>
            <p><strong>Durasi:</strong> {{ program.duration }} menit</p>
            <div class="footer">
              <button class="btn-daftar" @click="$router.push(`/detailProgram/${program.id}`)">Daftar Program</button>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <ButtonProgram class="button"/>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.n-card {
  width: 520px; 
  height: 280px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #003366;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.card-image {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image img {
  width: 200px;
  height: 228px;
  object-fit: cover;
  border-radius: 8px;
}

.card-image .privat {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: white;
  font-weight: bold;
  text-align: center;
}

.card-text {
  flex: 1;
  color: white;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.card-text h3 {
  font-size: 1.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #DEE4EE;
}

.card-text .badge {
  padding: 10px 20px;
  background-color: #dee4ee;
  font-size: 1.5rem;
  color: #617592;
  border: none;
  border-radius: 90px; 
  font-weight: bold;
}

.card-text .name {
  margin-top: -0.5rem;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #DEE4EE;
}

.card-text p {
  margin-top: 0.65rem;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: white;
}

.footer {
  margin-top: 1rem;
}

.btn-daftar {
  padding: 10px 20px;
  background-color: #9bafcb;
  color: #154484;
  border: none;
  border-radius: 90px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.btn-daftar:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.button {
  margin-top: 2rem;
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
</style>
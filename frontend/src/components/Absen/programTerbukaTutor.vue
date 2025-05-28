<script setup>
import { ref, onMounted } from 'vue';
import { NCard } from 'naive-ui';
import ButtonProgram from '../dirButton/butprogram.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['refreshPage']); // Tetap dipertahankan

const limitedPrograms = ref([]); // Data program yang akan ditampilkan
const error = ref(null); // Status error

onMounted(async () => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  if (!token) {
    error.value = 'Token tidak ditemukan. Silakan login ulang.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/packages/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil data program.');
    }

    const data = await response.json();
    limitedPrograms.value = data.slice(0, 2); // Ambil maksimal 2 program
  } catch (err) {
    error.value = err.message;
  }
});

function formatTime(dateTime) {
  const time = dateTime.split('T')[1];
  const [hour, minute] = time.split(':');
  return `${hour}:${minute} WIB`;
}

function truncateName(name) {
  return name.length > 16 ? name.slice(0, 16) + '...' : name;
}
</script>

<template>
  <div>
    <h1 class="headerr2 title1">Program</h1>
    <h2 class="headerb1 title2">Terbuka</h2>
    
    <div class="card-container">
      <n-card 
        v-for="program in limitedPrograms" 
        :key="program.id"
        class="n-card"
      >
        <div class="card-content">
          <div class="card-image">
            <img 
              :src="`http://localhost:3000${program.photo}` || '/public/tutor/3.png'" 
              :alt="`Image of ${program.name}`" 
            />
            <p class="headersb3 privat">{{ program.groupType[0].type }}</p>
          </div>
          <div class="card-text">
            <div class="header">
              <div class="title-group">
                <h3 class="headerb2">{{ truncateName(program.name) }}</h3>
                <p class="name bodyr3">{{ program.tutorName }}</p>
              </div>
              <div class="badge">{{ program.level }}</div>
            </div>
            <p><span class="card-tag">Area</span>: {{ program.area }}</p>
            <p><span class="card-tag">Hari</span>: {{ program.days.join(', ') }}</p>
            <p><span class="card-tag">Pukul</span>: {{ formatTime(program.time) }}</p>
            <p><span class="card-tag">Durasi</span>: {{ program.duration }} menit</p>
            <div class="Action">
              <button class="btn-daftar" @click="$router.push(`/detailProgram/${program.id}`)">Daftar Program</button>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <ButtonProgram class="button" @click="handleClick"/>
  </div>
</template>

<style scoped>
.title1 {
    color: #FDC998 !important;
    text-align: center;
}
.title2 {
    color: #154484;
    text-align: center;
    margin-bottom: 12px;
}
.card-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.n-card {
  width: 100%;
  background-color: #003366;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.card-tag{
  width: 200px;
}
.card-content {
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  margin-bottom: 1rem;
}

.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
}

.privat {
  color: white;
  text-align: center;
}

.card-text {
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.title-group h3 {
  color: #DEE4EE;
}

.name {
  color: #DEE4EE;
}

.badge {
  padding: 6px 12px;
  background-color: #dee4ee;
  color: #617592;
  border-radius: 90px;
  font-weight: bold;
}

.card-text p {
  color: white;
}

.btn-daftar {
  width: 100%;
  padding: 10px;
  margin-top: 1rem;
  background-color: #9bafcb;
  color: #154484;
  border: none;
  border-radius: 90px;
  font-weight: bold;
  cursor: pointer;
}

.button {
  margin-top: 2rem;
  width: 100%;
}

/* Tablet (768px and up) */
@media (min-width: 920px) {
  header {
    padding: 0 2rem;
  }
  .card-container {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .n-card {
    width: calc(50% - 0.75rem);
  }

  .card-content {
    flex-direction: row;
    height: 100%;
  }

  .card-image {
    width: 40%;
    margin-bottom: 0;
    margin-right: 1.5rem;
  }

  .card-image img {
    height: 200px;
  }

  .card-text {
    width: 60%;
  }

  .btn-daftar {
    width: auto;
    padding: 10px 20px;
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1200px) {

  .n-card {
    width: calc(50% - 0.75rem);
    max-width: 576px;
  }

  .card-image img {
    height: 228px;
  }

  .btn-daftar {
    padding: 12px 24px;
    font-size: 1rem;
  }
}

/* Large Desktop (1440px and up) */
@media (min-width: 1440px) {

  .card-container {
    justify-content: center;
  }
}

/* Small Mobile Adjustments (below 400px) */
@media (max-width: 400px) {
  .card-image img {
    height: 150px;
  }

  .card-text p {
    font-size: 0.8rem;
  }

  .btn-daftar {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>
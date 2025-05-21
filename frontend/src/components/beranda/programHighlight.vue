<script setup>
import { ref, onMounted } from 'vue'
import { NCard } from 'naive-ui'
import ButtonProgram from '../dirButton/butprogram.vue'
import { defineEmits } from 'vue'

const limitedPrograms = ref([])

const emit = defineEmits(['refreshPage'])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/packages/populer')
    const data = await res.json()
    limitedPrograms.value = data.slice(0, 2) // hanya 2 data teratas
  } catch (err) {
    console.error('Gagal fetch data:', err)
  }
})

function formatTime(dateTime) {
  const time = dateTime.split('T')[1]
  const [hour, minute] = time.split(':')
  return `${hour}:${minute} WIB`
}

function truncateName(name) {
  return name.length > 16 ? name.slice(0, 16) + '...' : name
}

function groupTypeLabel(groupTypeArr) {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some(gt => gt.type && gt.type.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
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
      >
        <div class="card-content">
          <div class="card-image">
            <img 
              :src="program.photo || '/public/tutor/3.png'" 
              :alt="`Image of ${program.name}`" 
            />
            <!-- Ganti baris ini -->
            <p class="headersb3 privat">{{ groupTypeLabel(program.groupType) }}</p>
          </div>
          <div class="card-text">
            <div class="header">
              <div class="title-group">
                <h3 class="headerb2">{{ truncateName(program.name) }}</h3>
                <p class="name bodyr3">{{ program.tutorName }}</p>
              </div>
              <div class="badge">{{ program.level }}</div>
            </div>
            <div class="info-row">
                <span class="label"><strong>Area</strong></span>
                <span class="value">: {{ program.area }}</span>
            </div>
            <div class="info-row">
                <span class="label"><strong>Hari</strong></span>
                <span class="value">: {{ program.days.join(', ') }}</span>
            </div>
            <div class="info-row">
                <span class="label"><strong>Pukul</strong></span>
                <span class="value">: {{ formatTime(program.time) }}</span>
            </div>
            <div class="info-row">
                <span class="label"><strong>Durasi</strong></span>
                <span class="value">: {{ program.duration }} menit</span>
            </div>
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

.info-row {
    display: flex;
}
.label {
    text-align: left;
    width: 60px;
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
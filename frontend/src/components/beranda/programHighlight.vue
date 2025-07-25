<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard } from 'naive-ui';
import ButtonProgram from '../dirButton/butprogram.vue';
import butSecondSmall from '../dirButton/butSecondSmall.vue';

const limitedPrograms = ref([]);
const isTutor = ref(false);
const title = ref('Unggulan'); // Default title
const router = useRouter();

onMounted(async () => {
  // Ambil role user dari API
  const token = localStorage.getItem('token');
  if (token) {
    const res = await fetch('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      isTutor.value = data.data?.role === 'tutor';
      if (isTutor.value) {
        title.value = 'Terbuka';
        try {
          const myProgramsRes = await fetch('/packages/my', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (myProgramsRes.ok) {
            const myProgramsData = await myProgramsRes.json();
            limitedPrograms.value = myProgramsData.slice(0, 2);
          } else {
            console.error('Gagal fetch data dari /packages/my');
          }
        } catch (err) {
          console.error('Gagal fetch data:', err);
        }
      }
    }
  }

  // Fetch program populer jika bukan tutor
  if (!isTutor.value) {
    try {
      const res = await fetch('/packages/populer');
      const data = await res.json();
      limitedPrograms.value = data.slice(0, 2);
    } catch (err) {
      console.error('Gagal fetch data:', err);
    }
  }
});

function formatTime(dateTime) {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}

function truncateName(name) {
  return name.length > 16 ? name.slice(0, 16) + '...' : name;
}

function groupTypeLabel(groupTypeArr) {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some((gt) => gt.type && gt.type.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
}

// Handler tombol
function handleButton(slug) {
  if (isTutor.value) {
    router.push(`/detailprogram/${slug}`);
  } else {
    router.push(`/detailProgram/${slug}`);
  }
}
</script>

<template>
  <div>
    <h1 class="headerr2 title1">Program</h1>
    <h2 class="headerb1 title2">{{ title }}</h2>
    <div class="card-container">
      <n-card 
        v-for="program in limitedPrograms" 
        :key="program.id"
        class="n-card"
      >
        <div class="card-content">
          <div class="card-image">
            <img 
              :src="program.photo ? `${program.photo}` : '/public/tutor/3.png'" 
              :alt="`Image of ${program.name}`" 
            />
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
              <butSecondSmall
                class="butPesan"
                :label="isTutor ? 'Detail Program' : 'Daftar Program'"
                @click="handleButton(program.slug)"
              />
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
  margin-bottom: 1rem;
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
  margin-bottom: 2rem;
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

.butPesan {
  margin-top: 2rem;
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

</style>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { NCard } from 'naive-ui';
import butSecondSmall from '../dirButton/butSecondSmall.vue';
import { formatWaktu } from '@/utils/formatTanggal';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
});

const allPrograms = ref([]);
const filteredPrograms = ref([]);
const isTutor = ref(false);
const title = ref('Hasil Pencarian');
const router = useRouter();

onMounted(async () => {
  await fetchUserRole();
  await fetchData();
});

watch(() => props.filters, async () => {
  if (!isTutor.value) {
    await fetchData();
  }
}, { deep: true });

async function fetchUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const userData = await res.json();
      isTutor.value = userData.data?.role === 'tutor';
      title.value = isTutor.value ? 'Program Saya' : 'Hasil Pencarian';
    } else {
      console.error('Gagal fetch user role:', res.statusText);
    }
  } catch (err) {
    console.error('Gagal fetch user role:', err);
  }
}

async function fetchData() {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (isTutor.value) {
    // Jika pengguna adalah tutor, gunakan endpoint /packages/my
    try {
      const res = await fetch('/packages/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const programData = await res.json();
        allPrograms.value = programData.data;
        filteredPrograms.value = programData.data;
      } else {
        console.error('Gagal fetch data:', res.statusText);
      }
    } catch (err) {
      console.error('Gagal fetch:', err);
    }
  } else {
    // Jika bukan tutor, gunakan endpoint /packages/filtered
    const { searchText, level, hari, durasi } = props.filters;

    const queryParams = new URLSearchParams({
      ...(searchText && { searchText }),
      ...(level && { level }),
      ...(hari?.length && { hari: hari.join(',') }),
      ...(durasi && { durasi: durasi.toString() })
    }).toString();

    const url = `/packages/filtered?${queryParams}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const programData = await res.json();
        allPrograms.value = programData.data;
        filteredPrograms.value = programData.data;
      } else {
        console.error('Gagal fetch data:', res.statusText);
      }
    } catch (err) {
      console.error('Gagal fetch:', err);
    }
  }
}

function truncateName(name) {
  return name.length > 16 ? name.slice(0, 16) + '...' : name;
}

function groupTypeLabel(groupTypeArr) {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some(gt => gt.type?.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
}

function handleButton(slug) {
  router.push(isTutor.value ? `/detailprogram/${slug}` : `/detailProgram/${slug}`);
}
</script>

<template>
  <div>
    <h2 v-if="filteredPrograms.length > 0" class="headerb1 title2">{{ title }}</h2>
    <div v-else class="no-results">
        <n-result
          status="404"
          description="Kami belum menemukan program yang sesuai dengan kriteria pencarian kamu."
          size="huge"
        >
        </n-result>
    </div>
    <div class="card-container">
      <n-card v-for="program in filteredPrograms" :key="program.slug" class="n-card">
        <div class="card-content">
          <div class="card-image">
            <img :src="program.photo ? `${program.photo}` : '/Tutor_Default.png'" />
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
            <div class="info-row" v-if="groupTypeLabel(program.groupType) == 'Kelas'">
              <span class="label"><strong>Kapasitas</strong></span>
              <span class="value">:Tersisa  <strong>{{ program.sisaKursi }}</strong> siswa</span>
            </div>
            <div class="info-row"><span class="label"><strong>Area</strong></span><span class="value">: {{ program.area }}</span></div>
            <div class="info-row"><span class="label"><strong>Hari</strong></span><span class="value">: {{ program.days.join(', ') }}</span></div>
            <div class="info-row"><span class="label"><strong>Pukul</strong></span><span class="value">: {{ formatWaktu(program.time) }}</span></div>
            <div class="info-row"><span class="label"><strong>Durasi</strong></span><span class="value">: {{ program.duration }} menit</span></div>
            <div class="Action">
              <butSecondSmall :label="isTutor ? 'Detail Program' : 'Daftar Program'" @click="handleButton(program.slug)" />
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.no-results {
  text-align: center;
  color: #888;
  margin-top: 48px;
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
    min-width: 80px;
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

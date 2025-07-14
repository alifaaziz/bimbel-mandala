<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import JadwalDetailProgram from './JadwalDetailProgram.vue';

const route = useRoute();

const programData = ref({
  id: '',
  packageName: '',
  tutorName: '',
  level: '',
  area: '',
  totalMeetings: null,
  time: '',
  duration: null,
  type: '',
  paid: '',
  studentName: '',
  address: '',
  startDate: '',
  days: [],
  photo: '',
  slug: ''
});

const loading = ref(true);
const jadwalLoading = ref(true); // state untuk loading jadwal

onMounted(async () => {
  const token = localStorage.getItem('token');
  const id = route.params.orderId;
  if (!id || !token) return;
  try {
    const res = await fetch(`http://localhost:3000/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.data) {
      Object.assign(programData.value, json.data);
    }
    // Jadwal loading animasi selama 1.5 detik setelah program detail didapat
    setTimeout(() => {
      jadwalLoading.value = false;
    }, 1500);
  } catch (err) {
    console.error('Gagal fetch order:', err);
    jadwalLoading.value = false;
  } finally {
    loading.value = false;
  }
});

const badgeClass = (level: string) => {
  switch (level.toLowerCase()) {
    case 'sd':
      return 'grade-sd';
    case 'smp':
      return 'grade-smp';
    case 'sma':
      return 'grade-sma';
    default:
      return '';
  }
};

const typeLabel = (type: string) => {
  switch (type) {
    case 'privat':
      return 'Privat';
    case 'grup2':
      return 'Kelompok 2 Peserta';
    case 'grup3':
      return 'Kelompok 3 Peserta';
    case 'grup4':
      return 'Kelompok 4 Peserta';
    case 'grup5':
      return 'Kelompok 5 Peserta';
    case 'kelas':
      return 'Kelas';
    default:
      return type;
  }
};

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
</script>

<template>
  <div class="detail-flow">
    <div class="detail-ccontainer">
      <div v-if="loading" class="loading-wrapper">
        <div class="spinner"></div>
      </div>
      <div v-else>
        <h4 class="headerb1">Detail Program</h4>
        <n-divider class="divider" />
        <div class="header-program">
          <img
            class="tutor-photo"
            :src="programData.photo ? `http://localhost:3000/public${programData.photo}` : '/tutor/Tutor_Default.png'"
            alt="Tutor Photo"
          />
          <div class="card-content">
            <div class="header-section">
              <div>
                <div class="subject headersb1">{{ programData.packageName }}</div>
                <div class="tutor-name bodym2">{{ programData.tutorName }}</div>
              </div>
              <div>
                <div
                  class="headerb1"
                  :class="badgeClass(programData.level)"
                >
                {{ programData.level }}
                </div>
              </div>
            </div>
            <n-space class="bodyr2">
              <n-tag
                v-for="(day, index) in allDays"
                :key="index"
                class="tag"
                :class="{ 'tag-unselected': !programData.days.includes(day) }"
              >
                {{ day }}
              </n-tag>
            </n-space>
            <div class="info-section bodyr2">
              <div class="info-row">
                <span class="label-data"><strong>Area</strong></span>
                <span class="value">: {{ programData.area }}</span>
              </div>
              <div class="info-row">
                <span class="label-data"><strong>Pertemuan</strong></span>
                <span class="value">: {{ programData.totalMeetings }} pertemuan</span>
              </div>
              <div class="info-row">
                <span class="label-data"><strong>Pukul</strong></span>
                <span class="value">
                  : {{ new Date(programData.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }} WIB
                </span>
              </div>
              <div class="info-row">
                <span class="label-data"><strong>Durasi</strong></span>
                <span class="value">: {{ programData.duration }} menit</span>
              </div>
            </div>
            <div class="meeting-link bodysb1">{{ typeLabel(programData.type) }}</div>
            <n-space>
              <span class="value">{{ programData.studentName }}</span>
            </n-space>
          </div>
        </div>
        <n-divider class="divider" />
        <div v-if="jadwalLoading" class="loading-wrapper">
          <div class="spinner"></div>
        </div>
        <div v-else>
          <JadwalDetailProgram :slug="programData.slug" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-flow{
  background-color: #0B2343;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
}
.detail-ccontainer{
  width: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  height: fit-content;
}
.headerb1{
  color: #154484;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.header-program {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.tutor-photo {
  width: 100%;
  max-width: 480px;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
}
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #061222;
}
.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
.headersb1 {
  color: #154484;
}
.info-section {
  display: flex;
  flex-direction: column;
  color: #333;
}
.label-data{
  display: inline-block; 
  width: 100px;
}
.tag {
  background-color: #154484;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  transition: background 0.2s, color 0.2s;
}
.tag-unselected {
  background-color: #e0e0e0;
  color: #888;
}
.meeting-link {
  color: #FB8312;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.bodysb2, .headerb3 {
  color: #154484;
}
.tabel {
  margin-top: 1rem;
}
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #154484;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>
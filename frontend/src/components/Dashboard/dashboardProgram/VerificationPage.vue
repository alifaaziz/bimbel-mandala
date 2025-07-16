<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";

const route = useRoute();
const router = useRouter();

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
  paid: null,
  studentName: '',
  address: '',
  startDate: '',
  days: [],
  photo: '',
});

const loading = ref(false);

onMounted(async () => {
  const token = localStorage.getItem('token');
  const id = route.params.id;
  if (!id || !token) return;
  try {
    const res = await fetch(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.data) {
      Object.assign(programData.value, json.data);
    }
  } catch (err) {
    console.error('Gagal fetch order:', err);
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

async function handleValidateClick() {
  const token = localStorage.getItem('token');
  const orderId = route.params.id;
  if (!orderId || !token) return;

  loading.value = true;
  try {
    await fetch('http://localhost:3000/orders/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        orderId,
        status: 'paid'
      })
    });
    // Setelah fetch selesai, loading tetap aktif selama 2 detik
    setTimeout(() => {
      router.push(`/dashboardadmin/programadmin/detail/${orderId}`);
      loading.value = false;
    }, 2000);
  } catch (err) {
    alert('Gagal verifikasi order');
    console.error(err);
    loading.value = false;
  }
}

function handleBackClick() {
  router.back();
}

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const typeLabel = (type) => {
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
</script>

<template>
  <div class="detail-flow">
    <div class="detail-ccontainer">
      
      <div class="header-program">
        <img
          class="tutor-photo"
            :src="programData.photo ? `${programData.photo}` : '/Tutor_Default.png'"
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
            <div class="meeting-link bodysb1">
            {{ programData.type === 'kelas' ? 'Kelas' : 'Privat/Kelompok' }}
            </div>
          <p class="headerb3">
            {{ Number(programData.paid).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) }}
          </p>
        </div>
      </div>
      <n-divider class="divider" />
      <h4 class="headerb2">Data Pendaftaran Program</h4>

      <div>
          <h4 class="bodysb2">Siswa</h4>
          <p class="bodyr2">{{ programData.studentName }}</p>
      </div>

      <div>
          <h4 class="bodysb2">Lokasi Les Privat</h4>
          <p class="bodyr2">{{ programData.address }}</p>
      </div>

      <div>
          <h4 class="bodysb2">Peserta</h4>
          <p class="bodyr2">{{ typeLabel(programData.type) }}</p>
      </div>

      <div>
          <h4 class="bodysb2">Tanggal Mulai</h4>
            <p class="bodyr2">
            {{
              programData.startDate
              ? new Date(programData.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : ''
            }}
            </p>
      </div>

      <n-divider class="divider" />
      <div class="button" style="position: relative;">
        <butPrimerNormal
          @click="handleValidateClick"
          :loading="loading"
          label="Verifikasi Pembuatan Jadwal"
        />
        <butSecondNormal
          @click="handleBackClick"
          label="Batal"
        />
        <div v-if="loading" class="btn-spinner-overlay">
          <div class="btn-spinner"></div>
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
.headerb2{
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
.button{
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
.bodysb2 {
  margin-top: 1rem;
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
.btn-spinner-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 160px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.btn-spinner {
  width: 28px;
  height: 28px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #154484;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  background: transparent;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>
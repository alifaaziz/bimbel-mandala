<template>
  <div class="page-container">
    <n-space vertical :size="32">
      <div class="header-program">
        <img
          class="tutor-photo"
          :src="programData.tutorPhoto ? `http://localhost:3000/public/${programData.tutorPhoto}` : '/tutor/Tutor_Default.png'"
          alt="Foto Tutor"
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
              v-for="day in allDays"
              :key="day"
              class="tag"
              :class="{ 'tag-unselected': !programData.days?.includes(day) }"
              :bordered="false"
            >
              {{ day }}
            </n-tag>
          </n-space>
          <div class="info-section bodyr2">
            <div class="info-row">
              <span class="label"><strong>Area</strong></span>
              <span class="value">: {{ programData.area }}</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Pertemuan</strong></span>
              <span class="value">: {{ programData.meetings }}</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Pukul</strong></span>
              <span class="value">: {{ new Date(programData.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }} WIB</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Durasi</strong></span>
              <span class="value">: {{ programData.duration }}</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Lokasi</strong></span>
              <span class="value">: {{ programData.address }}</span>
            </div>
          </div>
          <div>
            <p class="program-type">{{ programData.type }}</p>
            <p class="price">{{ formatRupiah(programData.price) }}</p>
          </div>
        </div>
      </div>
      <div class="registration-details">
        <n-divider class="divider" />
        <h3 class="section-title">Data Pendaftaran Program</h3>
        <n-descriptions label-placement="top" :column="1" size="large" :separator="false" content-style="margin-bottom: 24px;">
          <n-descriptions-item>
            <template #label>
              <n-space align="center" :size="8">
                <n-icon :component="PersonOutline" />
                <span>Siswa</span>
              </n-space>
            </template>
            {{ registrationData.students }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-space align="center" :size="8">
                <n-icon :component="HomeOutline" />
                <span>Lokasi les Privat</span>
              </n-space>
            </template>
            <n-input :value="registrationData.location" disabled />
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-space align="center" :size="8">
                <n-icon :component="PeopleOutline" />
                <span>Peserta</span>
              </n-space>
            </template>
            {{ registrationData.participantInfo }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-space align="center" :size="8">
                <n-icon :component="CalendarOutline" />
                <span>Tanggal Mulai</span>
              </n-space>
            </template>
            {{ registrationData.startDate }}
          </n-descriptions-item>
        </n-descriptions>
      </div>
      <n-divider class="divider" />
      <div class="button">
        <butPrimerNormal
          @click="handleValidateClick"
          label="Verifikasi Pembuatan Jadwal"
        />
        <butSecondNormal
          @click="handleBackClick"
          label="Batal"
        />
      </div>
    </n-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage, NSpace, NTag, NDescriptions, NDescriptionsItem, NButton, NIcon, NInput } from 'naive-ui';
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";
import { PersonOutline, HomeOutline, PeopleOutline, CalendarOutline } from '@vicons/ionicons5';

const message = useMessage();
const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];

const programData = ref({
  tutorPhoto: 'path/to/your/image.jpg',
  packageName: 'Matematika',
  tutorName: 'Pak Dendy Wan S.Pd',
  level: 'SMA',
  days: ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
  area: 'Semarang',
  meetings: '6 Bulan (3x perminggu)',
  time: '2025-07-13T15:00:00',
  duration: '120 Menit',
  address: 'Jln. Sekaran No.05 RT003/001',
  type: 'Privat/Kelompok',
  price: 1540000
});

const registrationData = ref({
  students: 'Areli Saverro Biyantora, Alif Abdul Aziz, Raihan Muhammad R. R.',
  location: 'Jln. Sekaran No.05 RT003/001',
  participantInfo: 'Kelompok 3 Peserta',
  startDate: '24 Maret 2025'
});

const badgeClass = (level) => {
  if (level === 'SMA') return 'badge-sma';
  if (level === 'SMP') return 'badge-smp';
  return 'badge-default';
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

const handleVerify = () => {
  message.success('Jadwal telah diverifikasi!');
};
const handleCancel = () => {
  message.warning('Aksi dibatalkan.');
};
</script>

<style scoped>
.page-container {
  width: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  height: fit-content;
}
.program-type {
  font-weight: 600;
  color: #f97316;
  margin: 16px 0 4px 0;
}
.price {
  font-weight: 700;
  color: #1e3a8a;
  font-size: 1.25rem;
  margin: 0;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  border-bottom: 2px solid #eef2ff;
  padding-bottom: 12px;
  margin-bottom: 24px;
}
.n-descriptions :deep(.n-descriptions-item-label) {
  color: #4b5563;
  font-weight: 600;
}
.button{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.header-program {
  display: flex;
  gap: 24px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 12px;
}
.tutor-photo {
  width: 100%;
  max-width: 480px;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
}
.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.subject {
  font-size: 1.5rem;
  font-weight: 600;
}
.tutor-name {
  color: #6b7280;
  margin-top: 4px;
}
.headerb1 {
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  color: white;
}
.badge-sma { background-color: #1e3a8a; }
.badge-smp { background-color: #1d4ed8; }
.badge-default { background-color: #6b7280; }
.tag {
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
}
.tag-unselected {
  background-color: #f3f4f6;
  color: #9ca3af;
  border: 1px solid #e5e7eb;
}
.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
}
.info-row {
  display: flex;
}
.info-row .label {
  width: 100px;
  flex-shrink: 0;
}
.info-row .value {
  color: #374151;
}
</style>
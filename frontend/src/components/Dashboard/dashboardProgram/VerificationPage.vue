<template>
  <div class="page-container">
    <n-space vertical :size="32">
      <n-card :bordered="false" content-style="padding: 0;">
        <n-grid :x-gap="24" :y-gap="24" cols="1 s:1 m:3" responsive="screen">
          <n-gi span="1">
            <n-image
              width="100%"
              height="100%"
              object-fit="cover"
              :src="data.program.tutorImage"
              alt="Foto Tutor"
              style="border-radius: 12px;"
            />
          </n-gi>
          <n-gi span="2">
            <n-space vertical size="medium">
              <n-space align="center" justify="space-between">
                <div class="title-group">
                    <h3 class="program-name">{{ data.program.subject }}</h3>
                    <p class="tutor-name">{{ data.program.tutorName }}</p>
                </div>
                <n-tag :bordered="false" type="info" class="level-tag">{{ data.program.level }}</n-tag>
              </n-space>

              <n-space>
                <n-tag
                  v-for="day in allDays"
                  :key="day"
                  :type="data.program.activeDays.includes(day) ? 'primary' : 'default'"
                  :bordered="false"
                >
                  {{ day }}
                </n-tag>
              </n-space>

              <n-descriptions label-placement="left" :column="1" :label-style="{width: '120px'}">
                <n-descriptions-item label="Area">{{ data.program.area }}</n-descriptions-item>
                <n-descriptions-item label="Pertemuan">{{ data.program.meetings }}</n-descriptions-item>
                <n-descriptions-item label="Pukul">{{ data.program.time }}</n-descriptions-item>
                <n-descriptions-item label="Durasi">{{ data.program.duration }}</n-descriptions-item>
              </n-descriptions>

              <div>
                <p class="program-type">{{ data.program.type }}</p>
                <p class="price">{{ formatRupiah(data.program.price) }}</p>
              </div>
            </n-space>
          </n-gi>
        </n-grid>
      </n-card>

      <div class="registration-details">
        <h3 class="section-title">Data Pendaftaran Program</h3>
        <n-descriptions label-placement="top" :column="1" size="large" :separator="false" content-style="margin-bottom: 24px;">
            <n-descriptions-item>
                <template #label>
                    <n-space align="center" :size="8">
                        <n-icon :component="PersonOutline" />
                        <span>Siswa</span>
                    </n-space>
                </template>
                {{ data.registration.students }}
            </n-descriptions-item>

            <n-descriptions-item>
                <template #label>
                    <n-space align="center" :size="8">
                        <n-icon :component="HomeOutline" />
                        <span>Lokasi les Privat</span>
                    </n-space>
                </template>
                <n-input :value="data.registration.location" disabled />
            </n-descriptions-item>

            <n-descriptions-item>
                <template #label>
                    <n-space align="center" :size="8">
                        <n-icon :component="PeopleOutline" />
                        <span>Peserta</span>
                    </n-space>
                </template>
                {{ data.registration.participantInfo }}
            </n-descriptions-item>

            <n-descriptions-item>
                <template #label>
                    <n-space align="center" :size="8">
                        <n-icon :component="CalendarOutline" />
                        <span>Tanggal Mulai</span>
                    </n-space>
                </template>
                {{ data.registration.startDate }}
            </n-descriptions-item>
        </n-descriptions>
      </div>


      <n-space justify="start" size="large">
        <n-button type="primary" size="large" @click="handleVerify">Verifikasi Pembuatan Jadwal</n-button>
        <n-button ghost size="large" @click="handleCancel">Batal</n-button>
      </n-space>

    </n-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage, NSpace, NCard, NGrid, NGi, NImage, NTag, NDescriptions, NDescriptionsItem, NButton, NIcon, NInput } from 'naive-ui';
import { PersonOutline, HomeOutline, PeopleOutline, CalendarOutline } from '@vicons/ionicons5';

const message = useMessage();
const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];

// --- Data Halaman (bisa diambil dari API) ---
const data = ref({
  program: {
    tutorImage: 'https://images.unsplash.com/photo-1542327897-4141c5336f09?q=80&w=2524&auto=format&fit=crop', // Placeholder image
    subject: 'Matematika',
    tutorName: 'Pak Dendy Wan S.Pd',
    level: 'SMA',
    activeDays: ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
    area: 'Semarang',
    meetings: '6 Bulan (3x perminggu)',
    time: '15:00 WIB',
    duration: '120 Menit',
    type: 'Privat/Kelompok',
    price: 1540000
  },
  registration: {
    students: 'Areli Saverro Biyantora, Alif Abdul Aziz, Raihan Muhammad R. R.',
    location: 'Jln. Sekaran No.05 RT003/001',
    participantInfo: 'Kelompok 3 Peserta',
    startDate: '24 Maret 2025'
  }
});


// --- Helper dan Handler ---
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
  padding: 24px;
  max-width: 900px;
  margin: auto;
}
.title-group {
    display: flex;
    flex-direction: column;
}
.program-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
}
.tutor-name {
    margin: 4px 0 0 0;
    color: #4b5563;
    font-size: 1rem;
}
.level-tag {
  background-color: #1e3a8a;
  color: white;
  font-weight: 600;
  height: fit-content;
}
.program-type {
  font-weight: 600;
  color: #f97316; /* Warna Oranye */
  margin: 8px 0 4px 0;
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
</style>
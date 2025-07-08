<template>
  <n-config-provider>
    <div class="program-container" style="max-width: 1200px; margin: auto; padding: 24px; background-color: #f5f5f5;">
      <n-h2>Detail Program</n-h2>
      <n-space vertical :size="24">
        <n-card :bordered="false" style="border-radius: 12px;">
          <n-grid x-gap="24" y-gap="24" :cols="3" responsive="screen" item-responsive>
            <n-gi span="3 m:1">
              <img
                src="./image_9ebdbd.png"
                alt="Tutor Dendy Wan"
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
              />
            </n-gi>
            <n-gi span="3 m:2">
              <n-space vertical :size="20">
                <n-space align="center" justify="space-between">
                  <n-h1 style="margin: 0; font-size: 2.2rem; font-weight: 600;">{{ program.title }}</n-h1>
                  <n-tag type="info" size="large" :bordered="false" style="border-radius: 5px; background-color: #718096; color: white;">
                    {{ program.level }}
                  </n-tag>
                </n-space>
                <n-text>{{ program.tutor }}</n-text>

                <n-space :size="8" wrap>
                  <n-tag
                    v-for="day in schedule.allDays"
                    :key="day"
                    :type="schedule.activeDays.includes(day) ? 'primary' : 'default'"
                    :bordered="false"
                    :color="schedule.activeDays.includes(day) ? undefined : { color: '#E2E8F0', textColor: '#2D3748', borderColor: '#CBD5E0' }"
                  >
                    {{ day }}
                  </n-tag>
                </n-space>

                <div class="schedule-details">
                    <n-text>Area/Lokasi</n-text><n-text>: {{ schedule.location }}</n-text>
                    <n-text>Tanggal mulai</n-text><n-text>: {{ schedule.startDate }}</n-text>
                    <n-text>Pertemuan</n-text><n-text>: {{ schedule.meetings }}</n-text>
                    <n-text>Pukul</n-text><n-text>: {{ schedule.time }}</n-text>
                    <n-text>Durasi</n-text><n-text>: {{ schedule.duration }}</n-text>
                    <n-text>Sisa Kursi</n-text><n-text>: {{ schedule.remainingSlots }}</n-text>
                </div>

                <n-space vertical :size="4">
                    <n-text strong>{{ price.type }}</n-text>
                    <n-text type="primary" strong style="font-size: 1.25rem;">{{ price.amount }}</n-text>
                </n-space>

                <n-button type="primary" size="large">Edit</n-button>
              </n-space>
            </n-gi>
          </n-grid>
        </n-card>

        <div class="notes-section">
          <n-h3>Catatan:</n-h3>
          <n-ul :align-text="true">
            <n-li v-for="(note, index) in notes" :key="index">{{ note }}</n-li>
          </n-ul>
        </div>
      </n-space>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref } from 'vue';
import {
  NCard, NGrid, NGi, NSpace, NH1, NH2, NH3, NText, NTag, NButton,
  NUl, NLi, NConfigProvider
} from 'naive-ui';

// --- DATA REAKTIF ---

const program = ref({
  title: 'Fokus UTBK',
  level: 'SMA',
  tutor: 'Pak Dendy Wan S.Pd',
});

const schedule = ref({
  allDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'],
  activeDays: ['Senin', 'Rabu'],
  location: 'Kantor Bimbel Mandala',
  startDate: '7 Juli 2025',
  meetings: '24 Pertemuan',
  time: '15:00 WIB',
  duration: '120 Menit',
  remainingSlots: '23 Siswa',
});

const price = ref({
    type: 'Kelas',
    amount: 'Rp1.500.000'
});

const notes = ref([
  'Paket Privat/kelompok: Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.',
  'Paket Kelas: Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.',
  'Honor Tutor merupakan 70% dari biaya total program.'
]);
</script>

<style scoped>
.schedule-details {
  display: grid;
  grid-template-columns: 100px auto;
  gap: 8px 16px;
  align-items: center;
}

.notes-section {
  padding: 0 16px;
}

.notes-section .n-h3 {
    margin-bottom: 8px;
    font-weight: 600;
}
</style>
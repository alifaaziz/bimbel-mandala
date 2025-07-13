<script setup lang="ts">
import { ref } from 'vue';
import butPrimerNormal from '@/components/dirButton/butPrimerNormal.vue';
import { useRouter } from 'vue-router'
import SkemaBiaya from './SkemaBiaya.vue';

const router = useRouter()

const programData = ref({
  _id: 'abc123',
  name: 'Program Matematika Intensif',
  tutorName: 'Pak Dendy Wan S.Pd',
  level: 'SMA', // bisa 'SD', 'SMP', atau 'SMA'
  days: ['Senin', 'Rabu', 'Jumat'],
  time: '2025-01-27T15:00:00.000Z',
  duration: 90,
  area: 'Jakarta Selatan',
  totalMeetings: 12,
  startDate: '2025-01-27',
  photo: null,
  groupType: [
    { type: 'Privat', price: 500000 },
    { type: 'Kelompok', price: 300000 }
  ]
})

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
}

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
</script>

<template>
  <div class="detail-flow">
    <div class="detail-ccontainer">
      <h4 class="headerb1">Detail Program</h4>
      <n-divider class="divider" />
      <div class="header-program">
        <img
          class="tutor-photo"
          :src="'/tutor/Tutor_Default.png'"
          alt="Tutor Photo"
        />
        <div class="card-content">
          <div class="header-section">
            <div>
              <div class="subject headersb1">Matematika SMA</div>
              <div class="tutor-name bodym2">Dendy Wan S.Pd</div>
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
              <span class="value">: Semarang</span>
            </div>
            <div class="info-row">
              <span class="label-data"><strong>Pertemuan</strong></span>
              <span class="value">: 6 Bulan (3x perminggu)</span>
            </div>
            <div class="info-row">
              <span class="label-data"><strong>Pukul</strong></span>
              <span class="value">: 15:00 WIB</span>
            </div>
            <div class="info-row">
              <span class="label-data"><strong>Durasi</strong></span>
              <span class="value">: 120 menit</span>
            </div>
          </div>
          <div class="meeting-link bodysb1">Siswa</div>
          <n-space>
              <span class="value">Arell Saverro Biyantoro, Alif Abdul Aziz, Raihan Muhammad R. R.</span>
          </n-space>
          <!-- Button Edit Program dihapus -->
        </div>
      </div>
      <SkemaBiaya class="tabel" />
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
  width: 60px;
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
.bodysb2, .headerb3 {
  color: #154484;
}
.tabel {
  margin-top: 1rem;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import butWaTambahPrimerNormal from '@/components/dirButton/butWaTambahPrimerNormal.vue';
import BiayaProgram from './BiayaProgram.vue';
import BiayaTutor from './BiayaTutor.vue';

const programData = ref<any>(null);

const route = useRoute();
const classId = route.params.classId || route.params.id;

const fetchDetail = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:3000/classes/${classId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const result = await res.json();
  programData.value = result.data;
};

const badgeClass = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'sd': return 'grade-sd';
    case 'smp': return 'grade-smp';
    case 'sma': return 'grade-sma';
    default: return '';
  }
};

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

onMounted(() => {
  fetchDetail();
});

function waTutor() {
  const url = `https://wa.me/62${programData.value.phoneNumber}`;
  window.open(url, '_blank');
}

</script>

<template>
  <div class="detail-ccontainer" v-if="programData">
    <h4 class="headerb1">Detail Program Selesai</h4>
    <n-divider class="divider" />
    <div class="header-program">
      <img
        class="tutor-photo"
        :src="programData.tutorPhoto ? `http://localhost:3000/public/${programData.tutorPhoto}` : '/Tutor_Default.png'"
        alt="Tutor Photo"
      />
      <div class="card-content">
        <div class="header-section">
          <div>
            <div class="subject headersb1">{{ programData.packageName }} {{ programData.level }}</div>
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
            :class="{ 'tag-unselected': !programData.days?.includes(day) }"
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
            <span class="label"><strong>Pukul</strong></span>
            <span class="value">: {{ new Date(programData.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }} WIB</span>
          </div>
          <div class="info-row">
            <span class="label"><strong>Durasi</strong></span>
            <span class="value">: {{ programData.duration }} menit</span>
          </div>
          <div class="info-row">
            <span class="label"><strong>Lokasi</strong></span>
            <span class="value">: {{ programData.address }}</span>
          </div>
        </div>
        <div class="meeting-link bodysb1">Selesai</div>
        <butWaTambahPrimerNormal @click="waTutor" />
      </div>
    </div>
    <div class="siswa">
      <h4 class="bodysb2">Siswa</h4>
      <p class="bodyr2">{{ programData.students }}</p>
    </div>
    <BiayaProgram class="biayaprogram"/>
    <BiayaTutor class="biayaprogram"/>
  </div>
</template>

<style scoped>
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
.bodysb2 {
  color: #154484;
}
.siswa, .biayaprogram {
  margin-top: 1rem;
}
.bodyr2{
  color: #061222;
}
</style>
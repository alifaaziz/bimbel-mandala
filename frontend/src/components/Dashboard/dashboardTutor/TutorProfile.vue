<script setup>
import { ref } from 'vue'
import { NSpace, NTag } from 'naive-ui';
import butEditProfile from '@/components/dirButton/butEditProfile.vue';

import JadwalTutor from './programjadwaltutor/JadwalTutor.vue';
import ProgramTerbuka from './programjadwaltutor/ProgramTerbuka.vue';

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const programData = ref({
  days: ['Senin', 'Rabu', 'Jumat'] // bisa diubah sesuai kebutuhan
})
</script>

<template>
  <div class="form-container">
    <div class="form-card">
      <div class="header-tutorprofile">
        <div class="header-part">
          <img
            class="img-tutor"
            src="/tutor/1.png"
          />
          <div class="datadiri">
            <div class="headersb2">
              Dendy Wan S.Pd
            </div>
            <p class="bodyr2">35 Tahun</p>
          </div>
        </div>
        <div class="headeer-part">
          <butEditProfile />
        </div>
      </div>
      <n-divider class="divider" />
      <div class="statistik">
        <div class="statistik-item">
          <h3 class="headersb3">Program Terbuka</h3>
          <p class="hero">04</p>
        </div>
        <div class="statistik-item">
          <h3 class="headersb3">Program Berjalan</h3>
          <p class="hero">04</p>
        </div>
        <div class="statistik-item">
          <h3 class="headersb3">Program Selesai</h3>
          <p class="hero">04</p>
        </div>
      </div>
      <n-divider class="divider" />
      <div class="space-profile">
        <n-space vertical>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/mail.svg" alt="">
              <p>Alamat E-mail</p>
            </div>  
            <p>: (email)</p>
          </div>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/whatsapp.svg" alt="">
              <p>No. WhatsApp</p>
            </div>
            <p>: (nomor telp)</p>
          </div>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/home.svg" alt="Gender">
              <p>Alamat Rumah</p>
            </div>
            <p>: (alamat rumah)</p>
          </div>
        </n-space>
        <n-space vertical>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/admin/gender.svg" alt="">
              <p>Gender</p>
            </div>
            <p>: (gender)</p>
          </div>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/building.svg" alt="">
              <p>Asal Kampus</p>
            </div>
            <p>: (Universitas xxx xxxx xxxxx xxxxxx)</p>
          </div>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/admin/status.svg" alt="">
              <p>Status</p>
            </div>
            <p>: (status)</p>
          </div>
          <div class="detail-separator">
            <div class="detail-profile">
              <img src="@/assets/icons/admin/prodi.svg" alt="">
              <p>Prodi</p>
            </div>
            <p>: (prodi)</p>
          </div>
        </n-space>
      </div>
      <n-divider class="divider" />
      <div>
        <h4 class="headersb3">Bidang Ajar</h4>
        <n-space vertical>
          <div class="detail-separator">
            <div class="detail-profile">
              <p>Jenjang</p>
            </div>  
            <p>: SMP, SMA</p>
          </div>
          <div class="detail-separator">
            <div class="detail-profile">
              <p>Mata Pelajaran</p>
            </div>
            <p>: Matematika, Fisika, Kimia</p>
          </div>
        </n-space>
      </div>
      <n-divider class="divider" />
      <div>
        <h4 class="headersb3">Hari Aktif</h4>
        <div>
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
        </div>
      </div>
      <n-divider class="divider" />
      <JadwalTutor />
      <n-divider class="divider" />
      <ProgramTerbuka />
    </div>
  </div>
</template>


<style scoped>
.form-container {
  width: 100%;
  padding: 20px;
  overflow-y: auto;
}
.form-card {
  border-radius: 12px;
  background-color: #fff;
  padding: 1rem;
  overflow-y: auto;
  height: 100vh;
}
.header-tutorprofile {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header-part {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.img-tutor {
  border-radius: 8px;
  width: 60px;
  height: 60px;
  object-fit: cover;
}
.datadiri {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.headersb2 {
  color: #154484;
}
.bodyr2 {
  color: #6B7280;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.statistik {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.statistik-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
}
.hero {
  color: #FB8312;
}
.space-profile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #061222;
  flex-wrap: wrap;
  gap: 1rem;
}
.detail-separator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  color: #061222;
}
.detail-separator p:last-child {
  margin: 0;
}
.detail-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 160px;
}
.detail-profile img {
  height: 20px;
}
.headersb3 {
  color: #154484;
  margin-bottom: 1rem;
}
.tag {
  background-color: #154484;
  color: white;
  padding: 1rem;
  border-radius: 2rem;
  transition: background 0.2s, color 0.2s;
}
.tag-unselected {
  border: 1px solid #154484;
  background-color: #fff;
  color: #154484;
}
</style>

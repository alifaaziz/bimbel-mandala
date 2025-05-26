<script setup>
import { ref, onMounted } from 'vue'
import navbarProfile from "./navbarProfile.vue"
import butEditProfile from "../dirButton/butEditProfile.vue";
import butLogout from "../dirButton/butLogout.vue";
import tabJadwalProgram from "./JadwalProgram.vue";
import tabProgram from "./ProgramTerdaftar.vue";
import bidangAjar from "./BidangAjar.vue";
import hariAktif from "./HariAktif.vue";
import Footer from "@/components/footer.vue"

const user = ref(null)
const siswa = ref(null)
const tutor = ref(null)

function formatGender(gender) {
  if (gender === 'Male') return 'Laki-laki'
  if (gender === 'Female') return 'Perempuan'
  return gender || '-'
}

function formatTutorStatus(status) {
  if (status === 'TH1') return 'Mahasiswa Aktif Semester 1-2'
  if (status === 'TH2') return 'Mahasiswa Aktif Semester 3-4'
  if (status === 'TH3') return 'Mahasiswa Aktif Semester 5-6'
  if (status === 'TH4') return 'Mahasiswa Aktif Semester 7-8'
  if (status === 'TH5') return 'Mahasiswa Aktif Semester 8<'
  if (status === 'S1') return 'Sarjana (S1)'
  if (status === 'S2') return 'Magister (S2)'
  if (status === 'S3') return 'Doktor (S3)'
  return status || '-'
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  const res = await fetch('http://localhost:3000/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const result = await res.json()
  user.value = result.data
  if (user.value.role === 'siswa') {
    siswa.value = user.value.students[0]
  } else if (user.value.role === 'tutor') {
    tutor.value = user.value.tutors[0]
  }
})
</script>

<template>
  <navbarProfile/>
  <div class="profile-container padding-components" v-if="user">
    <div class="space-profile">
      <div class="identitas">
        <h4 class="headerb2">{{ user.name }}</h4>
        <p class="bodyr2" v-if="user.role === 'siswa'">{{ siswa?.level }}</p>
        <p class="bodyr2" v-else-if="user.role === 'tutor'">{{ formatTutorStatus(tutor?.status) }}</p>
      </div>
      <div class="butAct">
        <butEditProfile />
        <butLogout />
      </div>
    </div>
    <n-divider/>
    <div class="space-profile">
      <n-space vertical>
        <div class="detail-separator">
          <div class="detail-profile">
            <img src="@/assets/icons/mail.svg" alt="">
            <p>Alamat E-mail</p>
          </div>
          <p>: {{ user.email }}</p>
        </div>
        <div class="detail-separator">
          <div class="detail-profile">
            <img src="@/assets/icons/whatsapp.svg" alt="">
            <p>No. WhatsApp</p>
          </div>
          <p>: {{ siswa?.phone || tutor?.phone }}</p>
        </div>
        <div class="detail-separator" v-if="user.role === 'siswa'">
          <div class="detail-profile">
            <img src="@/assets/icons/phone.svg" alt="">
            <p>No. Telp Wali</p>
          </div>
          <p>: {{ siswa?.parentPhone }}</p>
        </div>
        <div class="detail-separator" v-else-if="user.role === 'tutor'">
          <div class="detail-profile">
            <img src="@/assets/icons/home.svg" alt="Gender">
            <p>Gender</p>
          </div>
          <p>: {{ formatGender(tutor?.gender) }}</p>
        </div>
      </n-space>
      <n-space vertical>
        <div class="detail-separator" v-if="user.role === 'siswa'">
          <div class="detail-profile">
            <img src="@/assets/icons/building.svg" alt="">
            <p>Sekolah</p>
          </div>
          <p>: {{ siswa?.schoolName }}</p>
        </div>
        <div class="detail-separator" v-if="user.role === 'tutor'">
          <div class="detail-profile">
            <img src="@/assets/icons/building.svg" alt="">
            <p>Asal Kampus</p>
          </div>
          <p>: {{ tutor?.school }}</p>
        </div>
        <div class="detail-separator">
          <div class="detail-profile">
            <img src="@/assets/icons/home.svg" alt="">
            <p>Alamat rumah</p>
          </div>
          <p>: {{ siswa?.address || tutor?.address }}</p>
        </div>
        <div class="detail-separator" v-if="user.role === 'tutor'">
          <div class="detail-profile">
            <img src="@/assets/icons/home.svg" alt="">
            <p>Prodi</p>
          </div>
          <p>: {{ tutor?.major }}</p>
        </div>
      </n-space>
    </div>
    <n-divider/>
    <div v-if="user.role === 'tutor'">
      <bidangAjar :subjects="tutor?.subjects":jenjang="tutor?.teachLevel"/>
    </div>
    <n-divider v-if="user.role === 'tutor'"/>
    <div v-if="user.role === 'tutor'">
      <hariAktif :daysName="tutor?.daysName"/>
    </div>
    <n-divider v-if="user.role === 'tutor'" />
    <tabJadwalProgram/>
    <n-divider />
    <tabProgram/>
  </div>
  <Footer/>
</template>

<style>
.profile-container {
  margin-top: 104px !important;
  margin-bottom: 4rem;
}

.space-profile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  color: #061222;
  flex-wrap: wrap;
  gap: 1rem;
}

.identitas {
  color: #154484;
}

.butAct {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

.detail-separator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.detail-separator p:last-child {
  margin: 0;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .space-profile {
    flex-direction: column;
    align-items: flex-start;
  }

  .butAct {
    justify-content: flex-start;
  }

  .detail-profile {
    width: 100%;
  }

  .detail-separator {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-separator p:last-child {
    margin-left: 0;
  }
}
</style>
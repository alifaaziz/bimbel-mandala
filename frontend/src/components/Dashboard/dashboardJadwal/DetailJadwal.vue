<script setup>
import { ref } from 'vue'
import butPrimerNormal from '@/components/dirButton/butPrimerNormal.vue'

// Mapping status ke tipe tag Naive UI
const tagTypeMap = {
  active: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'info'
}

// Fungsi untuk mengubah status menjadi label teks
function statusLabel(status) {
  switch (status) {
    case 'active':
      return 'Terjadwal'
    case 'pending':
      return 'Menunggu'
    case 'cancelled':
      return 'Dibatalkan'
    case 'completed':
      return 'Selesai'
    default:
      return 'Tidak Diketahui'
  }
}

// Data dummy jadwal
const schedule = ref({
  id: 1,
  subject: 'Matematika Dasar',
  tutor: 'Bapak Andi',
  meetingNumber: 3,
  status: 'active'
})

// Fungsi membuka modal (saat ini hanya alert info)
function openRescheduleModal() {
  alert(`Test Jadwal Ulang`)
}
</script>


<template>
  <div class="page-container">
    <div class="detail-content">
      <h4 class="headerb1">Detail Jadwal Program</h4>
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
            <div style="display: flex; align-items: center; gap: 8px;">
              <n-tag
                :type="tagTypeMap[schedule.status]"
                size="small"
                class="bodyr4"
                round
              >
                {{ statusLabel(schedule.status) }}
              </n-tag>
            </div>
          </div>
          <div class="info-section bodyr2">
            <div class="info-row">
              <span class="label"><strong>Hari</strong></span>
              <span class="value">: Kamis, 10 Juli 2025</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Pukul</strong></span>
              <span class="value">: 15:00 WIB</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Durasi</strong></span>
              <span class="value">: 120 menit</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Lokasi</strong></span>
              <span class="value">: Jl. Taman Siswa No.114, Gunung Pati, Kota Semarang</span>
            </div>
          </div>
          <div class="meeting-link bodysb1">Pertemuan ke 12</div>
          <div class="button-group">
            <butPrimerNormal label="Jadwal Ulang" @click.stop="openRescheduleModal()" />
          </div>
        </div>
      </div>
      <div class="detail-program">
        <div>
          <h4 class="bodysb2">Siswa</h4>
          <p class="bodyr2">Arell Saverro Biyantoro, Alif Abdul Aziz, Rahaihan Muhammad</p>
        </div>
      </div>
      <div class="detail-program">
        <div class="info-tutor">
          <h4 class="bodysb2">Informasi Tutor</h4>
          <p class="bodyr2">Belum ada informasi dari tutor.</p>
        </div>
        <div class="detail-kontak">
          <h4 class="bodysb2">Kontak</h4>
          <div class="info-row">
            <span class="label-detail">No. WhatsApp Tutor</span>
            <span class="value">: 08xxxxxxxxx</span>
          </div>
          <div class="info-row">
            <span class="label-detail">E-mail tutor</span>
            <span class="value">: dendywan@gmail.com</span>
          </div>
          <div class="info-row">
            <span class="label-detail">No. WhatsApp Admin</span>
            <span class="value">: 08xxxxxxxxx</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.detail-content{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
}
.headerb1{
  color: #154484;
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
.header-program {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.info-section {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #333;
}
.info-section .label{
    width: 80px;
}
.info-row {
    display: flex;
    color: #061222;
}
.label {
    text-align: left;
    width: 156px;
}
.meeting-link, .bodysb2 {
  color: #154484;
}
.detail-program{
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.bodyr2{
  color: #061222;
}
.info-tutor{
  background-color: aliceblue;
  width: 480px;
  padding: 0.5rem;
  border-radius: 8px;
}
.detail-kontak{
  width: 480px;
}
.label-detail {
    text-align: left;
    width: 180px;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import Scheduled from './Scheduled.vue'
import butAbsen from '../dirButton/butAbsen.vue'
import butIzin from '../dirButton/butIzin.vue'

const isScheduled = ref(true)
const showAbsenModal = ref(false)
const izinReason = ref('')


// Absen
function openAbsenModal() {
  showAbsenModal.value = true
}

function closeAbsenModal() {
  showAbsenModal.value = false
}

function confirmAbsen() {
  // Lakukan aksi absen di sini
  alert('Absen berhasil!');
  closeAbsenModal();
}

// Izin
const showIzinModal = ref(false)

function openIzinModal() {
  showIzinModal.value = true
}

function closeIzinModal() {
  showIzinModal.value = false
}

function confirmIzin() {
  if (!izinReason.value.trim()) {
    alert('Silakan masukkan alasan izin terlebih dahulu.');
    return;
  }
  alert(`Permintaan izin berhasil dikirim:\n"${izinReason.value}"`);
  closeIzinModal();
  izinReason.value = '';
}


const schedule = {
  subject: 'Matematika SMA',
  tutor: 'Pak Dendy Wan S.Pd',
  date: 'Senin, 10 Maret 2025',
  time: '15:00 WIB',
  duration: '2 Jam',
  location: 'Jl. Taman Siswa No.114, Gunung Pati, Kota Semarang',
  meetingNumber: 12,
  info: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sapien, est felis, sagittis viverra nulla mattis scelerisque. 
  Eget cras integer....`,
}
</script>

<template>
  <div class="card-container">
    <img
      class="tutor-photo"
      src="/public/tutor/3.png"
      alt="Tutor Photo"
    />
    <div class="card-content">
      <div class="header-section">
        <div>
          <div class="subject headersb1">{{ schedule.subject }}</div>
          <div class="tutor-name bodym2">{{ schedule.tutor }}</div>
        </div>
        <div v-if="isScheduled">
          <Scheduled />
        </div>
      </div>

      <div class="info-section bodyr2">
            <div class="info-row">
                <span class="label"><strong>Hari</strong></span>
                <span class="value">: {{ schedule.date }}</span>
            </div>
            <div class="info-row">
                <span class="label"><strong>Pukul</strong></span>
                <span class="value">: {{ schedule.time }}</span>
            </div>
            <div class="info-row">
                <span class="label"><strong>Durasi</strong></span>
                <span class="value">: {{ schedule.duration }}</span>
            </div>
            <div class="info-row">
                <span class="label"><strong>Lokasi</strong></span>
                <span class="value">: {{ schedule.location }}</span>
            </div>
        </div>

      <div class="meeting-link bodysb1">Pertemuan ke {{ schedule.meetingNumber }}</div>

      <div>
        <p class="bodyb2">
          Informasi Tutor:
        </p>
        <p class="tutor-info bodyr2">{{ schedule.info }}</p>        
      </div>

      <div class="button-group">
        <butAbsen @click="openAbsenModal"/>
        <butIzin @click="openIzinModal"/>
      </div>
    </div>
  </div>

<!-- Absen -->
<div v-if="showAbsenModal" class="modal-overlay" @click.self="closeAbsenModal">
  <div class="modal-content">
    <div class="popup-content">
      <h3 class="headersb2">Absensi</h3>
      <p class="bodyr2">Silahkan melakukan absesni untuk sesi Bimbingan belajar kali ini.</p>
    </div>
    <div class="modal-actions">
      <button class="buttonm1" @click="confirmAbsen">Masuk</button>
      <button class="buttonm1" @click="closeAbsenModal">Batal</button>
    </div>
  </div>
</div>

<!-- Izin -->
<div v-if="showIzinModal" class="modal-overlay" @click.self="closeIzinModal">
  <div class="modal-content">
    <div class="popup-content">
      <h3 class="headersb2">Perizinan</h3>
      <input
        v-model="izinReason"
        type="text"
        class="izin-input bodyr2"
        placeholder="Masukkan alasan izin..."
      />
    </div>
    <div class="modal-actions">
      <button class="buttonm1" @click="confirmIzin" >Izin</button>
      <button class="buttonm1" @click="closeIzinModal">Batal</button>
    </div>
  </div>
</div>
</template>

<style scoped>
.card-container {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 16px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  flex-direction: row;
}

.tutor-photo {
  width: 100%;
  max-width: 541px;
  height: auto;
  object-fit: cover;
  border-radius: 16px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.subject, .card-content .bodyb2 {
  color: #154484;
}

.tutor-name {
  color: #444;
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
}

.label {
    text-align: left;
    width: 156px;
}

.meeting-link {
  color: #154484;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
}

.tutor-info {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-actions button {
  padding: 0.8rem 1rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #154484;
  color: white;
}

.modal-actions button:last-child {
  background-color: white;
  border: 2px solid #154484;
  color: #154484;
}

.modal-content .headersb2 {
  color: #154484;
  text-align: center;
}

.popup-content {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-bottom: 2rem;
  gap: 1rem;
}

.popup-content .bodyr2 {
  color: #597AA8;
  font-size: 0.95rem;
}

.izin-input {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid #597AA8;
  border-radius: 8px;
  font-size: 1rem;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }

  .tutor-photo {
    width: 100%;
    max-width: 100%;
  }

  .card-content {
    width: 100%;
  }

  .info-section,
  .tutor-info,
  .meeting-link,
  .popup-content .bodyr2 {
    font-size: 0.9rem;
  }

  .modal-content {
    padding: 1.5rem;
    width: 95%;
  }

  .modal-actions button {
    font-size: 0.95rem;
  }
}


</style>

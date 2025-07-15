<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import butPrimerNormal from '@/components/dirButton/butPrimerNormal.vue'
import butSecondSmall from '@/components/dirButton/butSecondSmall.vue'
import butPrimerSmall from '@/components/dirButton/butPrimerSmall.vue'

const showRescheduleModal = ref(false)
const rescheduleDate = ref('')
const rescheduleTime = ref('')
const showSuccessPopup = ref(false)

const route = useRoute()
const schedule = ref(null)
const isLoading = ref(true)

// Mapping status ke tipe tag Naive UI
const tagTypeMap = {
  terjadwal: 'success',
  jadwal_ulang: 'warning'
}

// Fungsi untuk mengubah status menjadi label teks
function statusLabel(status) {
  switch (status) {
    case 'terjadwal':
      return 'Terjadwal'
    case 'jadwal_ulang':
      return 'Terjadwal Ulang'
    default:
      return 'Tidak Diketahui'
  }
}

async function fetchScheduleDetail() {
  const slug = route.params.slug
  const token = localStorage.getItem('token')
  if (!slug || !token) {
    isLoading.value = false
    return
  }
  try {
    const res = await fetch(`/schedules/${slug}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.ok) {
      const result = await res.json()
      schedule.value = result.data
    } else {
      schedule.value = null
    }
  } catch (e) {
    schedule.value = null
  }
  isLoading.value = false
}

onMounted(fetchScheduleDetail)

function handleReschedule() {
  if (!rescheduleDate.value || !rescheduleTime.value) {
    alert("Tanggal dan jam baru wajib diisi.");
    return;
  }
  const token = localStorage.getItem('token');
  if (!token || !schedule.value?.id) {
    alert("Data tidak valid.");
    return;
  }
  const id = schedule.value.id;

  const newDate = new Date(`${rescheduleDate.value}T${rescheduleTime.value}:00`);

  fetch(`/schedules/reschedule/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ newDate })
  })
    .then(async res => {
      if (res.ok) {
        showRescheduleModal.value = false;
        showSuccessPopup.value = true;
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Gagal menjadwalkan ulang.");
      }
    })
    .catch(() => {
      alert("Terjadi kesalahan jaringan.");
    });
}

function openRescheduleModal() {
  showRescheduleModal.value = true
}
function closeRescheduleModal() {
  showRescheduleModal.value = false
}
</script>

<template>
  <div class="page-container">
    <div class="detail-content" v-if="!isLoading && schedule">
      <h4 class="headerb1">Detail Jadwal Program</h4>
      <n-divider class="divider" />
      <div class="header-program">
        <img
          class="tutor-photo"
            :src="schedule.photo ? `${schedule.photo}` : '/Tutor_Default.png'"
          alt="Tutor Photo"
        />
        <div class="card-content">
          <div class="header-section">
            <div>
              <div class="subject headersb1">{{ schedule.packageName }} {{ schedule.level }}</div>
              <div class="tutor-name bodym2">{{ schedule.tutorName }}</div>
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
              <span class="value">: {{ new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Pukul</strong></span>
              <span class="value">: {{ new Date(schedule.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }} WIB</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Durasi</strong></span>
              <span class="value">: {{ schedule.duration }} menit</span>
            </div>
            <div class="info-row">
              <span class="label"><strong>Lokasi</strong></span>
              <span class="value">: {{ schedule.address }}</span>
            </div>
          </div>
          <div class="meeting-link bodysb1">Pertemuan ke {{ schedule.meet }}</div>
          <div class="button-group">
            <butPrimerNormal label="Jadwal Ulang" @click.stop="openRescheduleModal()" />
          </div>
        </div>
      </div>
      <div class="detail-program">
        <div>
          <h4 class="bodysb2">Siswa</h4>
          <p class="bodyr2">
            {{ schedule.studentName ? schedule.studentName.join(', ') : '-' }}
          </p>
        </div>
      </div>
      <div class="detail-program">
        <div class="info-tutor">
          <h4 class="bodysb2">Informasi Tutor</h4>
          <p class="bodyr2">{{ schedule.info || 'Belum ada informasi dari tutor.' }}</p>
        </div>
        <div class="detail-kontak">
          <h4 class="bodysb2">Kontak</h4>
          <div class="info-row">
            <span class="label-detail">No. WhatsApp Tutor</span>
            <span class="value">: {{ schedule.tutorPhone || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label-detail">E-mail tutor</span>
            <span class="value">: {{ schedule.tutorEmail || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label-detail">No. WhatsApp Admin</span>
            <span class="value">: 08xxxxxxxxx</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isLoading" class="detail-content">
      <p>Loading...</p>
    </div>
    <div v-else class="detail-content">
      <p>Jadwal tidak ditemukan.</p>
    </div>
  </div>
  <!-- Popup Jadwal Ulang -->
  <div v-if="showRescheduleModal" class="modal-overlay" @click.self="closeRescheduleModal">
    <div class="modal-content">
      <div class="popup-content">
        <h3 class="headersb2">Jadwal Ulang</h3>
        <p class="bodyr3" style="margin-bottom: 16px;">
          Pilih tanggal dan jam baru untuk:<br>
          <strong>
            {{ schedule ? new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '' }}
          </strong>
          bersama {{ schedule ? schedule.tutorName : '' }}<br>
          <span>Pertemuan ke {{ schedule ? schedule.meet : '' }}</span>
        </p>
        <div style="margin-bottom: 12px;">
          <label class="bodym3" for="reschedule-date" style="display:block; margin-bottom:4px;">Tanggal Baru</label>
          <input
            id="reschedule-date"
            type="date"
            v-model="rescheduleDate"
            class="inputm1"
            style="width: 100%; margin-bottom: 8px;"
          />
          <label class="bodym3" for="reschedule-time" style="display:block; margin-bottom:4px;">Jam Baru</label>
          <input
            id="reschedule-time"
            type="time"
            v-model="rescheduleTime"
            class="inputm1"
            style="width: 100%;"
          />
        </div>
      </div>
      <div class="modal-actions-popup">
        <butPrimerSmall label="Jadwal Ulang" @click="handleReschedule" />
        <butSecondSmall label="Batal" @click="closeRescheduleModal" />
      </div>
    </div>
  </div>
  <!-- Popup Sukses Jadwal Ulang -->
  <div v-if="showSuccessPopup" class="modal-overlay" @click.self="showSuccessPopup = false">
    <div class="modal-content-success">
      <h3 class="headersb2">Berhasil Jadwal Ulang</h3>
      <div class="success">
        <img src="@/assets/success/success.png" alt="Ilustrasi Sukses">
      </div>
      <p class="bodyr3 text-success">Penjadwalan ulang berhasil dilakukan. Silahkan untuk memberi kabar ke siswa dan tutor.
      </p>
      <div class="modal-actions-popup-success">
        <butPrimerSmall label="Kembali" @click="showSuccessPopup = false" />
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
.headersb1 {
  color: #154484;
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
  color: #061222;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.modal-content-success {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.headersb2 {
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

.success {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column; 
}

.popup-content .bodyr2 {
  color: #597AA8;
  font-size: 0.95rem;
}

.detail-jadwal {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

.detail-jadwal .bodyb2 {
    color: #154484;
}

.info-tutor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 50%;
}

.inputm1 {
  padding: 8px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  box-sizing: border-box;
  width: 100%;
}
textarea.inputm1 {
  font-family: inherit;
  min-height: 80px;
  max-height: 300px;
  resize: vertical;
}
.detail-jadwal .bodyr2, .kontak-tutor .bodyr2 {
    color: #626264;
}
.modal-actions-popup {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.modal-actions-popup-success {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.text-success{
  text-align: left;
  color: #597AA8;
}
</style>
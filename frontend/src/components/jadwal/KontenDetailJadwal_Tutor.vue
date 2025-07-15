<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import butAbsen from '../dirButton/butAbsen.vue'
import butSumJadwalUlang from '../dirButton/butPrimerSmall.vue'
import butEditInfo from '../dirButton/butEditInfo.vue'
import butSecondNormal from '../dirButton/butSecondNormal.vue'

import butSecondSmall from '../dirButton/butSecondSmall.vue'
import butPrimerSmall from '../dirButton/butPrimerSmall.vue'

const showAbsenModal = ref(false)
const schedule = ref<any>(null)
const showRescheduleModal = ref(false)
const rescheduleDate = ref('')
const rescheduleTime = ref('')
const selectedSchedule = ref<any>(null)
const showEditInfoModal = ref(false)
const editInfoText = ref('')

const route = useRoute()

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const slug = route.params.slug
  const res = await fetch(`http://localhost:3000/schedules/${slug}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (res.ok) {
    const data = await res.json()
    schedule.value = data.data
  }
})

// Absen
function openAbsenModal() {
  showAbsenModal.value = true
}

function closeAbsenModal() {
  showAbsenModal.value = false
}

function confirmAbsen() {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Token tidak ditemukan, silakan login ulang.')
    return
  }
  if (!schedule.value?.id) {
    alert('Jadwal tidak ditemukan.')
    return
  }

  fetch('http://localhost:3000/attendance/masuk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ scheduleId: schedule.value.id })
  })
    .then(async res => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.message ||
          (data.error && data.error.message) ||
          data.error ||
          'Gagal absen.'
        )
      }
      alert('Absen berhasil!')
      closeAbsenModal()
    })
    .catch(err => {
      alert(err.message)
    })
}

function formatTanggal(dateStr: string) {
  const date = new Date(dateStr);
  const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
  const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  return `${hari}, ${tanggal}`;
}

function formatJam(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
}

const tagTypeMap = {
  "terjadwal": "success",
  "jadwal_ulang": "warning",
};

function statusLabel(status: string) {
  switch (status) {
    case "terjadwal": return "Terjadwal";
    case "jadwal_ulang": return "Jadwal Ulang";
    default: return status;
  }
}

function openRescheduleModal() {
  if (!schedule.value) return
  selectedSchedule.value = {
    jadwal: schedule.value.subject,
    guru: schedule.value.tutor,
    pertemuan: schedule.value.meetingNumber
  }
  showRescheduleModal.value = true
}
function closeRescheduleModal() {
  showRescheduleModal.value = false
  rescheduleDate.value = ''
  rescheduleTime.value = ''
}

function confirmReschedule() {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Token tidak ditemukan, silakan login ulang.')
    return
  }
  if (!schedule.value?.id) {
    alert('Jadwal tidak ditemukan.')
    return
  }
  if (!rescheduleDate.value || !rescheduleTime.value) {
    alert('Silakan pilih tanggal dan jam baru terlebih dahulu.')
    return
  }

  const dateStr = `${rescheduleDate.value}T${rescheduleTime.value}:00+07:00`;
  const utcDate = new Date(dateStr);
  const newDate = utcDate.toISOString()

  fetch(`http://localhost:3000/schedules/reschedule/${schedule.value.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ newDate })
  })
    .then(async res => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data.message ||
          (data.error && data.error.message) ||
          data.error ||
          'Gagal melakukan jadwal ulang.'
        )
      }
      alert('Jadwal ulang berhasil!')
      closeRescheduleModal()
    })
    .catch(err => {
      alert(err.message)
    })
}

function openEditInfo() {
  editInfoText.value = schedule.value?.info || ''
  showEditInfoModal.value = true
}

function closeEditInfo() {
  showEditInfoModal.value = false
}

async function saveEditInfo() {
  const token = localStorage.getItem('token');
  if (!token || !schedule.value?.id) {
    alert('Gagal menyimpan. Silakan login ulang.');
    return;
  }

  const res = await fetch(`http://localhost:3000/schedules/${schedule.value.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ information: editInfoText.value }),
  });

  if (res.ok) {
    schedule.value.info = editInfoText.value;
    showEditInfoModal.value = false;
  } else {
    const errorData = await res.json().catch(() => ({}));
    alert(errorData.message || 'Gagal memperbarui informasi tutor.');
  }
}
</script>

<template>
  <div class="card-container" v-if="schedule">
    <img
      class="tutor-photo"
      :src="schedule.photo ? `http://localhost:3000/public${schedule.photo}` : '/Tutor_Default.png'"
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
          <span class="value">: {{ formatTanggal(schedule.date) }}</span>
        </div>
        <div class="info-row">
          <span class="label"><strong>Pukul</strong></span>
          <span class="value">: {{ formatJam(schedule.date) }}</span>
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
        <butAbsen @click="openAbsenModal"/>
        <butSecondNormal label="Jadwal Ulang" @click.stop="openRescheduleModal()" />
      </div>

    </div>
    <div class="detail-jadwal">
      <div class="info-tutor">
        <p class="bodyb2">Informasi Tutor:</p>
        <p class="tutor-info bodyr2">
          {{ schedule.info || 'Saat ini belum ada informasi dari tutor.' }}
        </p>
        <butEditInfo @click="openEditInfo" />
      </div>
      <div class="kontak-tutor bodyr2">
        <p class="bodyb2">Kontak:</p>
        <div class="info-row">
          <span class="label">No. WhatsApp Tutor</span>
          <span class="value">: {{ schedule.tutorPhone }}</span>
        </div>
        <div class="info-row">
          <span class="label">E-mail Tutor</span>
          <span class="value">: {{ schedule.tutorEmail }}</span>
        </div>
        <div class="info-row">
          <span class="label">No. WhatsApp Admin</span>
          <span class="value">: 08xxxxxxxxx</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Absen -->
  <div v-if="showAbsenModal" class="modal-overlay" @click.self="closeAbsenModal">
    <div class="modal-content">
      <div class="popup-content">
        <h3 class="headersb2">Absensi</h3>
        <p class="bodyr2">Silahkan melakukan absensi untuk sesi Bimbingan belajar kali ini.</p>
      </div>
      <div class="modal-actions">
        <button class="buttonm1" @click="confirmAbsen">Masuk</button>
        <button class="buttonm1" @click="closeAbsenModal">Batal</button>
      </div>
    </div>
  </div>

  <!-- Popup Jadwal Ulang -->
  <div v-if="showRescheduleModal" class="modal-overlay" @click.self="closeRescheduleModal">
    <div class="modal-content">
      <div class="popup-content">
        <h3 class="headersb2">Jadwal Ulang</h3>
        <p class="bodyr3" style="margin-bottom: 16px;">
          Pilih tanggal dan jam baru untuk:<br>
          <strong>{{ formatTanggal(schedule.date) }}</strong> bersama {{ schedule.tutorName }}<br>
          <span>Pertemuan ke-{{ schedule.meet }}</span>
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
        <butSumJadwalUlang label="Jadwal Ulang" @click.stop.prevent="confirmReschedule" />
        <butSecondSmall label="Batal" @click="closeRescheduleModal" />
      </div>
    </div>
  </div>

  <!-- Modal Edit Informasi Tutor -->
  <div v-if="showEditInfoModal" class="modal-overlay" @click.self="closeEditInfo">
    <div class="modal-content">
      <div class="popup-content">
        <h3 class="headersb2">Edit Informasi Tutor</h3>
        <n-input
          v-model:value="editInfoText"
          class="inputm1 bodyr3"
          placeholder="Tulis informasi tutor di sini..."
          type="textarea"
          size="medium"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
      </div>
      <div class="modal-actions-popup">
        <butPrimerSmall label="Simpan" @click="saveEditInfo" />
        <butSecondSmall label="Batal" @click="closeEditInfo" />
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

.edit-info-btn {
  background: #154484;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-info-btn:hover {
  background: #0B2343;
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
    width: 100%;
  }

  .modal-actions button {
    font-size: 0.95rem;
  }
  .detail-jadwal {
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .info-tutor {
    width: 100%;
  }

  .kontak-tutor {
    width: 100%;
  }
}


</style>

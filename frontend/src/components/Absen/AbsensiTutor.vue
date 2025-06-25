<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NTag } from 'naive-ui'
import butAbsen from '../dirButton/butAbsen.vue'
import butSumJadwalUlang from '../dirButton/butPrimerSmall.vue'
import butBatal from '../dirButton/butSecondSmall.vue'
import butJadwalUlang from '../dirButton/butSecondNormal.vue'
import butSucJadwalUlang from '../dirButton/butPrimerNormal.vue'

// State
const showAbsenModal = ref(false)
const showRescheduleModal = ref(false)
const showSuccessModal = ref(false)
const rescheduleDate = ref('')
const rescheduleTime = ref('')
const lastRescheduleDate = ref('')
const lastRescheduleTime = ref('')
const selectedSchedule = ref<any>(null)
const schedule = ref<any>(null)

// Ambil jadwal dari backend
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch('http://localhost:3000/schedules', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Gagal mengambil jadwal')
    const result = await res.json()

    // Ambil jadwal pertama
    const item = (result.data.data || [])[0]
    if (item) {
      schedule.value = {
        id: item.id,
        subject: item.packageName + ' ' + (item.level || ''),
        tutor: item.tutorName,
        date: new Date(item.date).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        time: item.date ? item.date.slice(11, 16).replace(':', '.') : '',
        duration: item.duration + ' menit',
        location: item.address,
        meetingNumber: item.meet,
        info: item.info || 'Saat ini belum terdapat informasi apapun. Informasi yang anda masukkan akan ditampilkan di sini.',
        photo: item.photo,
        status: item.status
      }
    }
  } catch (err) {
    console.error(err)
    schedule.value = null
  }
})

// Status
function statusLabel(status: string) {
  switch (status) {
    case "masuk": return "Masuk"
    case "terjadwal": return "Terjadwal"
    case "jadwal_ulang": return "Jadwal Ulang"
    case "izin": return "Izin"
    default: return status
  }
}

const tagTypeMap: Record<string, "default" | "error" | "success" | "warning" | "info" | "primary"> = {
  "Terjadwal": "success",
  "Jadwal Ulang": "warning",
  "Masuk": "info",
  "Izin": "error"
}

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
          'Gagal melakukan absensi.'
        )
      }
      alert('Absensi berhasil!')
      closeAbsenModal()
    })
    .catch(err => {
      alert(err.message)
    })
}

// Jadwal Ulang
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

  const newDate = new Date(`${rescheduleDate.value}T${rescheduleTime.value}:00.000Z`).toISOString()

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
      // Set data sukses
      lastRescheduleDate.value = rescheduleDate.value
      lastRescheduleTime.value = rescheduleTime.value
      showSuccessModal.value = true
      closeRescheduleModal()
    })
    .catch(err => {
      alert(err.message)
    })
}

function closeSuccessModal() {
  showSuccessModal.value = false
}
</script>

<template>
  <div v-if="schedule" class="card-container">
    <img
      class="tutor-photo"
      :src="schedule.photo ? `http://localhost:3000${schedule.photo}` : '/tutor/Tutor_Default.png'"
      alt="Tutor Photo"
    />
    <div class="card-content">
      <div class="header-section">
        <div>
          <div class="subject headersb1">{{ schedule.subject }}</div>
          <div class="tutor-name bodym2">{{ schedule.tutor }}</div>
        </div>
        <div>
          <n-tag
            :type="tagTypeMap[statusLabel(schedule.status)]"
            size="small"
            class="bodym3"
            round
          >
            {{ statusLabel(schedule.status) }}
          </n-tag>
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
        <p class="bodyb2">Informasi Tutor:</p>
        <p class="tutor-info bodyr2">{{ schedule.info }}</p>
      </div>

      <div class="button-group">
        <butAbsen @click="openAbsenModal"/>
        <!-- Tombol simulasi jadwal ulang -->
        <butJadwalUlang label="Jadwal Ulang" @click.stop="openRescheduleModal()" />
      </div>
    </div>
  </div>

  <!-- Modal Absen -->
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
          <strong>{{ selectedSchedule?.jadwal }}</strong> bersama {{ selectedSchedule?.guru }}<br>
          <span>Pertemuan ke-{{ selectedSchedule?.pertemuan }}</span>
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
      <div class="modal-actions-jadwalulang">
        <butSumJadwalUlang label="Jadwal Ulang" @click.stop.prevent="confirmReschedule" />
        <butBatal label="Batal" @click="closeRescheduleModal" />
      </div>
    </div>
  </div>

  <!-- Modal Sukses -->
  <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeSuccessModal">
    <div class="modal-content success-modal">
      <div class="popup-content" style="text-align:center;">
        <h3 class="headersb2" style="color:#154484; margin-bottom: 8px;">Jadwal Ulang Berhasil!</h3>
        <img 
          src="@/assets/success/success.png" 
          alt="Success" 
          style="width:160px; margin: 0 auto;"
        >
        <p class="bodyr2">
          Penjadwalan ulang berhasil dilakukan.<br>
          Silahkan untuk memberi kabar ke siswa dan tutor.<br>
          <span style="display:inline-block; margin-top:10px;">
            Tanggal: <strong>{{ lastRescheduleDate }}</strong><br>
            Jam: <strong>{{ lastRescheduleTime }}</strong>
          </span>
        </p>
        <butSucJadwalUlang 
          label="Kembali ke Jadwal"
          @click="closeSuccessModal"
          style="width: 100%;"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  gap: 4rem;
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
  gap: 1rem;
}

.bodyr3, .success-modal .bodyr2 {
  color: #061222;
}

.modal-actions-jadwalulang {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.popup-content .bodym3 {
  color: #154484;
}

.inputm1 {
  padding: 8px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  box-sizing: border-box;
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

.success-modal .headersb2 {
  color: #154484;
  margin-bottom: 8px;
}
.success-modal .bodyr2 {
  text-align: left;
}
</style>

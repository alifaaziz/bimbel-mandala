<template>
  <div class="page-container">
    <n-h1 class="page-title">Detail Jadwal Program</n-h1>
    <n-grid x-gap="24" y-gap="24" :cols="3">
      
      <n-grid-item :span="1">
        <n-space vertical size="large">
          <n-image
            :src="detail.imageUrl"
            object-fit="cover"
            :preview-disabled="true"
            style="border-radius: 20px; width: 100%; height: 450px;"
          />
          <div>
            <n-h4>Siswa</n-h4>
            <n-p :depth="3">{{ detail.siswa.join(', ') }}</n-p>
          </div>
          <div>
            <n-h4>Informasi Tutor</n-h4>
            <n-p :depth="3">{{ detail.informasiTutor }}</n-p>
          </div>
        </n-space>
      </n-grid-item>

      <n-grid-item :span="2">
        <n-space vertical size="large">
          <div>
            <n-space align="center" justify="space-between">
              <n-h3 style="margin: 0;">{{ detail.namaProgram }}</n-h3>
              <n-tag type="success" round>{{ detail.status }}</n-tag>
            </n-space>
            <n-text :depth="2">{{ detail.namaTutor }}</n-text>
          </div>

          <n-space vertical size="small" class="schedule-details">
            <div class="detail-item">
              <span class="detail-label">Hari</span>
              <span>: {{ detail.jadwal.hari }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Pukul</span>
              <span>: {{ detail.jadwal.pukul }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Durasi</span>
              <span>: {{ detail.jadwal.durasi }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Lokasi</span>
              <span>: {{ detail.jadwal.lokasi }}</span>
            </div>
          </n-space>

          <n-text>Pertemuan ke {{ detail.pertemuanKe }}</n-text>
          
          <n-button type="primary" size="large" @click="openRescheduleModal">
            Jadwal Ulang
          </n-button>
          
          <n-divider />

          <div>
            <n-h4>Kontak</n-h4>
            <n-space vertical size="small" class="contact-details">
               <div class="contact-item">
                <span class="contact-label">No. WhatsApp Tutor</span>
                <span>: {{ detail.kontak.waTutor }}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">E-mail tutor</span>
                <span>: {{ detail.kontak.emailTutor }}</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">No. WhatsApp Admin</span>
                <span>: {{ detail.kontak.waAdmin }}</span>
              </div>
            </n-space>
          </div>
        </n-space>
      </n-grid-item>
    </n-grid>

    <n-modal
      v-model="showRescheduleModal"
      preset="card"
      :style="{ width: '450px', textAlign: 'center', borderRadius: '16px' }"
      title="Jadwal Ulang"
      :bordered="false"
      size="huge"
    >
      <div v-if="rescheduleStep === 'form'">
        <n-space vertical size="large" :item-style="{ width: '100%' }">
          <div>
            <n-text class="modal-label">Ubah Tanggal</n-text>
            <n-date-picker
              v-model="newSelectedDate"
              type="date"
              size="large"
              format="d MMMM yyyy"
              style="width: 100%; margin-top: 8px;"
            />
          </div>
          <div>
            <n-text class="modal-label">Ubah Jam</n-text>
            <n-time-picker
              v-model="newSelectedTime"
              size="large"
              style="width: 100%; margin-top: 8px;"
            />
          </div>
          <n-space vertical size="medium" :item-style="{ width: '100%' }" style="margin-top: 24px;">
            <n-button type="primary" size="large" round block @click="handleConfirmReschedule">
              Atur Ulang
            </n-button>
            <n-button type="default" size="large" round block strong @click="showRescheduleModal = false">
              Batal
            </n-button>
          </n-space>
        </n-space>
      </div>

      <div v-if="rescheduleStep === 'success'">
        <n-space vertical align="center" justify="center" size="large" style="padding: 20px 0;">
          <div class="success-icon-container">
             <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M89.3308 50.0001C89.3308 43.432 87.0397 37.1009 82.899 32.1818C82.0232 31.1592 81.0963 30.1878 80.1221 29.2648C72.9333 22.4433 63.4835 18.6667 53.3308 18.6667C43.178 18.6667 33.7282 22.4433 26.5394 29.2648C17.2917 38.0125 11.9974 49.9922 13.0645 61.812C14.1316 73.6318 21.3204 84.148 32.1221 89.2648C42.9238 94.3816 55.7435 93.4102 65.9912 86.8421C76.2389 80.274 83.4277 69.1764 85.1221 57.3213C85.3411 55.8457 85.4506 54.3482 85.4506 52.8334C86.7172 52.8334 87.9839 52.8334 89.2505 52.8334C89.3206 51.889 89.3308 50.9445 89.3308 50.0001Z" stroke="#0d47a1" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M35 50L47.5 62.5L67.5 40" stroke="#f39c12" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <p class="success-message">
            Penjadwalan ulang berhasil dilakukan. Silahkan untuk memberi kabar ke siswa dan tutor.
          </p>

          <n-button type="primary" size="large" round block @click="showRescheduleModal = false">
            Kembali
          </n-button>
        </n-space>
      </div>
    </n-modal>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  NGrid, NGridItem, NSpace, NH1, NH3, NH4, NText, NP, NImage,
  NTag, NButton, NDivider, NModal, NDatePicker, NTimePicker
} from 'naive-ui';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// --- STATE UNTUK HALAMAN DETAIL ---
const detail = ref({
  namaProgram: 'Matematika SMA',
  namaTutor: 'Pak Dendy Wan S.Pd',
  status: 'Terjadwal',
  imageUrl: 'https://images.unsplash.com/photo-1599927692883-93318f27899a?q=80&w=1887&auto=format&fit=crop',
  timestamp: new Date('2025-03-10T15:00:00').getTime(),
  jadwal: {
    hari: 'Senin, 10 Maret 2025',
    pukul: '15:00 WIB',
    durasi: '2 Jam',
    lokasi: 'Jl. Taman Siswa No.114, Gunung Pati, Kota Semarang',
  },
  pertemuanKe: 12,
  siswa: ['Areil Saverro Biyantoro', 'Alif Abdul Aziz', 'Raihan Muhammad R. R.'],
  informasiTutor: 'Belum ada informasi dari tutor.',
  kontak: {
    waTutor: '08xxxxxxxxx',
    emailTutor: 'dendywan@gmail.com',
    waAdmin: '08xxxxxxxxx',
  },
});


// --- LOGIKA & STATE UNTUK MODAL JADWAL ULANG ---

const showRescheduleModal = ref(false);
const rescheduleStep = ref('form'); // State baru: 'form' atau 'success'
const newSelectedDate = ref(null);
const newSelectedTime = ref(null);

const openRescheduleModal = () => {
  rescheduleStep.value = 'form'; // Selalu reset ke tampilan form saat modal dibuka
  newSelectedDate.value = detail.value.timestamp;
  newSelectedTime.value = detail.value.timestamp;
  showRescheduleModal.value = true;
};

const handleConfirmReschedule = () => {
  const datePart = new Date(newSelectedDate.value);
  const timePart = new Date(newSelectedTime.value);

  const finalDateTime = new Date(
    datePart.getFullYear(),
    datePart.getMonth(),
    datePart.getDate(),
    timePart.getHours(),
    timePart.getMinutes()
  );

  detail.value.timestamp = finalDateTime.getTime();
  detail.value.jadwal.hari = format(finalDateTime, 'eeee, d MMMM yyyy', { locale: id });
  detail.value.jadwal.pukul = format(finalDateTime, 'HH:mm') + ' WIB';
  
  console.log('Jadwal baru berhasil disimpan:', finalDateTime);

  // **PERUBAHAN UTAMA**: Alih-alih menutup modal, kita ubah tampilannya ke 'success'
  rescheduleStep.value = 'success';
};

</script>

<style scoped>
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: auto;
  font-family: 'Inter', sans-serif;
}
.page-title {
  margin-bottom: 24px;
  font-weight: 600;
}
.n-h3, .n-h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-weight: 600;
}
.schedule-details .detail-item,
.contact-details .contact-item {
  display: flex;
}
.schedule-details .detail-label {
  width: 80px;
  flex-shrink: 0;
  color: #5e5e5e;
}
.contact-details .contact-label {
  width: 180px;
  flex-shrink: 0;
  color: #5e5e5e;
}
.n-button {
  width: fit-content;
  border-radius: 8px;
}

/* --- STYLE KHUSUS UNTUK MODAL --- */
:global(.n-card-header__main) {
  font-size: 28px !important;
  font-weight: 600 !important;
  color: #0d47a1;
}
.modal-label {
  float: left;
  margin-left: 4px;
}

/* Style untuk tampilan sukses */
.success-icon-container {
    margin-bottom: 16px;
}
.success-message {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    margin: 0;
    padding: 0 16px;
}
</style>
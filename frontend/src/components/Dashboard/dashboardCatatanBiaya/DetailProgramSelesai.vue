<template>
  <div class="page-container">
    <n-space vertical :size="24">
      <n-h1>Detail Program Selesai</n-h1>

      <n-card :bordered="false" style="border-radius: 12px;">
        <n-grid :x-gap="24" :y-gap="16" cols="1 m:3">
          <n-gi>
            <n-image
              width="100%"
              height="100%"
              object-fit="cover"
              src="https://0.soompi.io/wp-content/uploads/2021/04/23095646/hwang-in-yeop-1.jpeg"
              style="border-radius: 8px;"
            />
          </n-gi>
          <n-gi span="1 m:2">
            <n-space vertical :size="16">
              <n-space justify="space-between" align="start">
                <div>
                  <n-h3 style="margin: 0;">Matematika</n-h3>
                  <n-text>Pak Dendy Wan S.Pd</n-text>
                </div>
                <n-tag round size="large">SMA</n-tag>
              </n-space>
              
              <n-space :size="8">
                 <n-tag v-for="day in schedule.days" :key="day" :type="day === schedule.activeDay ? 'primary' : 'default'">
                   {{ day }}
                 </n-tag>
              </n-space>

              <n-descriptions label-placement="left" :column="1" size="small">
                <n-descriptions-item label="Hari">Senin, 10 Maret 2025</n-descriptions-item>
                <n-descriptions-item label="Pukul">: 15:00 WIB</n-descriptions-item>
                <n-descriptions-item label="Durasi">: 2 Jam</n-descriptions-item>
                <n-descriptions-item label="Lokasi">: Jl. Taman Siswa No.114, Gunung Pati, Kota Semarang</n-descriptions-item>
              </n-descriptions>

              <n-space justify="space-between" align="center">
                <n-tag type="success" :bordered="false">Selesai</n-tag>
                <n-button type="primary" @click="hubungiTutor">
                  <template #icon>
                    <n-icon :component="LogoWhatsapp" />
                  </template>
                  Hubungi Tutor
                </n-button>
              </n-space>
            </n-space>
          </n-gi>
        </n-grid>
      </n-card>
      
      <div>
        <n-text strong>Siswa</n-text>
        <n-p :depth="3" style="margin-top: 4px;">Areli Saverro Biyantoro, Alif Abdul Aziz, Raihan Muhammad R. R.</n-p>
      </div>

      <n-collapse :default-expanded-names="['biaya']" arrow-placement="right">
        <n-collapse-item name="biaya">
          <template #header>
            <n-text strong class="collapse-header">Biaya Program</n-text>
          </template>
          <n-grid cols="2 s:3 m:5" :x-gap="12" :y-gap="16">
            <n-gi><n-statistic label="Jenis" value="Kelompok 3 Siswa" /></n-gi>
            <n-gi><n-statistic label="Biaya Program" value="Rp1.000.000" /></n-gi>
            <n-gi><n-statistic label="Biaya/anak" value="Rp240.000" /></n-gi>
            <n-gi><n-statistic label="Jumlah Siswa" value="3" /></n-gi>
            <n-gi><n-statistic label="Honor Program" value="Rp1.078.000" /></n-gi>
          </n-grid>
        </n-collapse-item>
      </n-collapse>

      <n-collapse default-expanded-names="rekap" arrow-placement="right">
        <n-collapse-item name="rekap">
            <template #header>
               <n-text strong class="collapse-header">Rekap tutor</n-text>
            </template>
            <template #header-extra>
              <n-space>
                <n-button @click="unduhRekap">
                   <template #icon><n-icon :component="DownloadOutline" /></template>
                   Unduh rekap program
                </n-button>
                <n-dropdown trigger="click" :options="dropdownOptions" @select="handleDropdownSelect">
                   <n-button type="warning">
                      Belum terbayar
                      <template #icon><n-icon :component="ChevronDown" /></template>
                   </n-button>
                </n-dropdown>
              </n-space>
            </template>

            <n-grid x-gap="24" y-gap="20" cols="1 s:1 m:3">
                <n-gi>
                    <n-descriptions title="Rekap Tutor" label-placement="left" :column="1">
                        <n-descriptions-item label="Nama">: Pak Dendy Wan S.Pd</n-descriptions-item>
                        <n-descriptions-item label="Hadir">: 140</n-descriptions-item>
                        <n-descriptions-item label="Izin">: 3</n-descriptions-item>
                        <n-descriptions-item label="Absen">: 0</n-descriptions-item>
                        <n-descriptions-item label="Kosong">: 3</n-descriptions-item>
                    </n-descriptions>
                </n-gi>
                <n-gi>
                    <n-descriptions title="Rekap Siswa" label-placement="left" :column="1">
                        <n-descriptions-item label="Pertemuan">: 144</n-descriptions-item>
                        <n-descriptions-item label="Hadir">: 140</n-descriptions-item>
                        <n-descriptions-item label="Izin">: 2</n-descriptions-item>
                        <n-descriptions-item label="Absen">: 1</n-descriptions-item>
                        <n-descriptions-item label="Kosong">: 1</n-descriptions-item>
                    </n-descriptions>
                </n-gi>
                 <n-gi>
                    <n-h4 style="margin-top: 0; font-weight: bold;">Program</n-h4>
                    <p>Pertemuan : 6 Bulan (3x perminggu)</p>
                    <p>Kosong : 4 Pertemuan</p>
                    <p>Progress : 100%</p>
                    <n-progress type="line" :percentage="100" status="success" />
                    <p style="margin-top: 12px;">Absensi : 97.22%</p>
                    <n-progress type="line" :percentage="97.22" status="success" />
                 </n-gi>
            </n-grid>
            
            <n-divider />

            <n-descriptions label-placement="left" :column="1" size="large">
                <n-descriptions-item label="Kesesuaian">99.31%</n-descriptions-item>
                <n-descriptions-item label="Honor Program">Rp1.078.000</n-descriptions-item>
                <n-descriptions-item label="Diterima">
                  <n-text strong type="success">Rp1.070.514</n-text>
                </n-descriptions-item>
            </n-descriptions>

        </n-collapse-item>
      </n-collapse>

      <n-alert title="Catatan:" type="info">
        <ul>
          <li>Izin dan absen pada tutor akan mempengaruhi skor kesesuaian</li>
          <li>Skor kesesuaian tutor akan dikalikan dengan Honor program untuk menghasilkan Honor yang diterima.</li>
        </ul>
      </n-alert>

    </n-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LogoWhatsapp, DownloadOutline, ChevronDown } from '@vicons/ionicons5';

// Data dummy untuk jadwal
const schedule = ref({
  days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'],
  activeDay: 'Selasa'
});

// Opsi untuk dropdown status pembayaran
const dropdownOptions = ref([
  {
    label: 'Tandai sebagai Terbayar',
    key: 'paid'
  },
  {
    label: 'Kirim Pengingat',
    key: 'remind'
  }
]);

// Fungsi handler untuk aksi
const hubungiTutor = () => {
  alert('Membuka aplikasi WhatsApp untuk menghubungi tutor...');
};

const unduhRekap = () => {
  alert('Memulai unduhan rekap program...');
};

const handleDropdownSelect = (key) => {
  alert(`Aksi yang dipilih: ${key}`);
};

</script>

<style scoped>
.page-container {
  padding: 24px;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.n-h1 {
  font-weight: 600;
}

.n-h3 {
  font-weight: 600;
  font-size: 24px;
}

.collapse-header {
  font-size: 18px;
}

.n-collapse {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #eef0f2;
}
:deep(.n-collapse-item__header) {
    padding: 16px !important;
}
:deep(.n-collapse-item__content-inner) {
    padding: 16px !important;
}
:deep(.n-statistic .n-statistic-label) {
  font-size: 13px;
  color: #6b7280;
}
:deep(.n-statistic .n-statistic-value) {
  font-size: 14px;
  font-weight: 600;
}
:deep(.n-descriptions .n-descriptions-table-row) {
    margin-bottom: 4px;
}
.n-alert ul {
  margin: 0;
  padding-left: 20px;
}
.n-alert li {
  margin-bottom: 4px;
}
.n-alert li:last-child {
  margin-bottom: 0;
}

/* Mengatur header-extra agar tetap terlihat di layar kecil */
@media (max-width: 768px) {
  :deep(.n-collapse-item__header-main) {
    flex-wrap: wrap;
    gap: 12px;
  }
}

</style>
<template>
  <div class="page-background">
    <div class="profile-container">
      <n-space vertical :size="12">
        <n-space justify="space-between">
          <n-space vertical :size="0">
            <h1 class="headerb1 profile-name">{{ profileData.name }}</h1>
            <n-text :depth="3">{{ profileData.jenjang }}</n-text>
          </n-space>
          <n-space>
            <n-button @click="handleEdit">
              <template #icon><n-icon :component="PencilOutline" /></template>
              Edit Profil
            </n-button>
            <n-button type="error" ghost @click="handleDelete">
              <template #icon><n-icon :component="TrashOutline" /></template>
              Hapus Akun
            </n-button>
          </n-space>
        </n-space>

        <n-divider />

        <n-grid :x-gap="24" :y-gap="16" :cols="2">
          <n-gi>
            <n-space vertical>
              <n-space align="center">
                <n-icon :component="MailOutline" size="20" :depth="3" />
                <div class="info-item">
                  <div class="info-label">Alamat E-mail</div>
                  <div class="info-value">{{ profileData.email }}</div>
                </div>
              </n-space>
              <n-space align="center">
                <n-icon :component="LogoWhatsapp" size="20" :depth="3" />
                <div class="info-item">
                  <div class="info-label">No. WhatsApp</div>
                  <div class="info-value">{{ profileData.whatsapp }}</div>
                </div>
              </n-space>
              <n-space align="center">
                <n-icon :component="CallOutline" size="20" :depth="3" />
                <div class="info-item">
                  <div class="info-label">No. Telp Wali</div>
                  <div class="info-value">{{ profileData.telpWali }}</div>
                </div>
              </n-space>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space vertical>
              <n-space align="center">
                <n-icon :component="SchoolOutline" size="20" :depth="3" />
                <div class="info-item">
                  <div class="info-label">Sekolah</div>
                  <div class="info-value">{{ profileData.sekolah }}</div>
                </div>
              </n-space>
              <n-space align="center">
                <n-icon :component="HomeOutline" size="20" :depth="3" />
                <div class="info-item">
                  <div class="info-label">Alamat rumah</div>
                  <div class="info-value">{{ profileData.alamat }}</div>
                </div>
              </n-space>
            </n-space>
          </n-gi>
        </n-grid>

        <n-divider />

        <div class="section-container">
          <n-h2 class="section-title">Program Terdaftar</n-h2>
          <n-card :bordered="false" class="content-card">
            <n-data-table
              :columns="registeredProgramColumns"
              :data="registeredProgramsData"
              :bordered="false"
              :single-line="false"
            />
          </n-card>
        </div>

        <n-divider />

        <div class="section-container">
          <n-h2 class="section-title">Jadwal Program</n-h2>
          <n-card :bordered="false" class="content-card">
            <n-data-table
              :columns="programScheduleColumns"
              :data="programScheduleData"
              :bordered="false"
              :single-line="false"
            />
          </n-card>
        </div>

      </n-space>
    </div>
    <!-- Modal Konfirmasi Hapus Akun -->
    <n-modal v-model:show="showDeleteConfirm" preset="dialog" title="Konfirmasi Hapus Akun"
      positive-text="Hapus" negative-text="Batal"
      type="error"
      @positive-click="confirmDelete"
      @negative-click="cancelDelete"
    >
      <template #default>
        <div>
          Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NSpace, NButton, NH1, NH2, NText, NIcon, NGrid, NGi, NDivider, NCard, NDataTable, NDropdown, NTag, NModal, useMessage
} from 'naive-ui';
import {
  PencilOutline, TrashOutline, MailOutline, LogoWhatsapp, CallOutline, SchoolOutline, HomeOutline, EllipsisHorizontal
} from '@vicons/ionicons5';

const message = useMessage();
const router = useRouter();

const profileData = ref({
  name: 'John Due',
  jenjang: 'SMA Kelas 12',
  email: 'namaemail@gmail.com',
  whatsapp: '085786234264',
  telpWali: '085786234264',
  sekolah: 'SMA Negeri 10 Semarang',
  alamat: 'Jl Sekaran No.05 RT05/04, Gunung Pati, Kota Semarang'
});

// State untuk modal konfirmasi hapus akun
const showDeleteConfirm = ref(false);

const handleEdit = () => {
  router.push('/dashboardadmin/siswa/editprofilesiswa');
};
const handleDelete = () => {
  showDeleteConfirm.value = true;
};
const confirmDelete = () => {
  showDeleteConfirm.value = false;
  message.success('Akun berhasil dihapus!');
  // Tambahkan logika penghapusan akun di sini
};
const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const handleDropdownSelect = (key) => message.info(`Memilih aksi: ${key}`);

// --- Data & Kolom untuk Tabel "Program Terdaftar" ---
const dropdownOptions = [
  { label: 'Lihat Detail', key: 'detail' },
  { label: 'Ubah Jadwal', key: 'ubah' },
  { label: 'Batalkan', key: 'batal' }
];

const registeredProgramsData = ref([
  { key: 1, program: 'Matematika SMA', tutor: 'Pak Dendy Wan S.Pd', status: 'Berjalan', type: 'Privat', schedule: 'Senin, Rabu, Sabtu', time: '15:00', duration: '90 Menit' },
  { key: 2, program: 'Fisika SMA', tutor: 'Pak Venita S.Pd', status: 'Berjalan', type: 'Kelompok 5 Peserta', schedule: 'Selasa, Kamis', time: '15:00', duration: '120 Menit' },
  { key: 3, program: 'Fokus UTBK', tutor: 'Pak Wendy S.Pd, M.Pd', status: 'Berjalan', type: 'Kelas', schedule: 'Senin', time: '15:00', duration: '120 Menit' },
]);

const registeredProgramColumns = [
  {
    title: 'Program',
    key: 'program',
    render(row) {
      return h(NSpace, { vertical: true, size: 0 }, {
        default: () => [
          h('div', { style: 'font-weight: 500;' }, row.program),
          h(NText, { depth: 3 }, { default: () => row.tutor })
        ]
      });
    }
  },
  { title: 'Status', key: 'status' },
  { title: 'Jenis', key: 'type' },
  { title: 'Jadwal', key: 'schedule' },
  { title: 'Jam', key: 'time' },
  { title: 'Durasi', key: 'duration' },
  {
    title: '',
    key: 'actions',
    render() {
      return h(NDropdown, {
        options: dropdownOptions,
        onSelect: handleDropdownSelect,
        trigger: 'click'
      }, {
        default: () => h(NButton, { tertiary: true, circle: true }, {
          icon: () => h(NIcon, { component: EllipsisHorizontal })
        })
      });
    }
  }
];

// --- Data & Kolom untuk Tabel "Jadwal Program" ---
const programScheduleData = ref([
  { key: 1, program: 'Matematika SMA', tutor: 'Pak Dendy Wan S.Pd', type: 'Privat', session: 12, date: 'Rabu, 12 Maret 2025', time: '15:00', duration: '90 Menit', status: 'Masuk' },
  { key: 2, program: 'Fisika SMA', tutor: 'Pak Venita S.Pd', type: 'Kelompok 5 Peserta', session: 7, date: 'Kamis, 13 Maret 2025', time: '15:00', duration: '120 Menit', status: 'Terjadwal' },
  { key: 3, program: 'Matematika SMA', tutor: 'Pak Dendy Wan S.Pd', type: 'Privat', session: 13, date: 'Sabtu, 15 Maret 2025', time: '15:00', duration: '90 Menit', status: 'Terjadwal' },
  { key: 4, program: 'Fokus UTBK', tutor: 'Pak Wendy S.Pd, M.Pd', type: 'Kelas', session: 3, date: 'Senin, 17 Maret 2025', time: '15:00', duration: '120 Menit', status: 'Jadwal Ulang' },
]);

const programScheduleColumns = [
  {
    title: 'Jadwal',
    key: 'program',
     render(row) {
      return h(NSpace, { vertical: true, size: 0 }, {
        default: () => [
          h('div', { style: 'font-weight: 500;' }, row.program),
          h(NText, { depth: 3 }, { default: () => row.tutor })
        ]
      });
    }
  },
  { title: 'Jenis', key: 'type' },
  { title: 'Pertemuan', key: 'session' },
  { title: 'Tanggal', key: 'date' },
  { title: 'Jam', key: 'time' },
  { title: 'Durasi', key: 'duration' },
  {
    title: 'Status',
    key: 'status',
    render(row) {
      let type = 'default';
      if (row.status === 'Masuk') type = 'primary';
      if (row.status === 'Terjadwal') type = 'success';
      if (row.status === 'Jadwal Ulang') type = 'warning';
      
      return h(NTag, {
        type: type,
        bordered: false,
        style: 'width: 100px; justify-content: center;'
      }, { default: () => row.status });
    }
  }
];

</script>

<style scoped>
.page-background {
  background-color: #0B2343; /* Biru tua */
  padding: 24px;
  width: 100%;
  overflow-y: auto;
}

.profile-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
}

.profile-name {
  color: #154484;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #64748b;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
}

.section-container {
  background-color: #0F2C5A; /* Biru tua */
  border-radius: 12px;
  padding: 24px;
}

.section-title {
  color: white;
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 600;
}

.content-card {
  border-radius: 8px;
}

/* Kustomisasi Data Table agar lebih bersih */
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8fafc;
}

:deep(.n-data-table .n-data-table-td) {
  background-color: #ffffff;
}
</style>
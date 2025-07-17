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
            <n-button round @click="handleEdit">
              <template #icon><n-icon :component="PencilOutline" /></template>
              Edit Profil
            </n-button>
            <n-button type="error" ghost round @click="handleDelete">
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
    <n-modal v-model="showDeleteConfirm" preset="dialog" title="Konfirmasi Hapus Akun"
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
import { h, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  NSpace, NButton, NH1, NH2, NText, NIcon, NGrid, NGi, NDivider, NCard, NDataTable, NDropdown, NTag, NModal, useMessage
} from 'naive-ui';
import {
  PencilOutline, TrashOutline, MailOutline, LogoWhatsapp, CallOutline, SchoolOutline, HomeOutline, EllipsisHorizontal
} from '@vicons/ionicons5';
import { formatTanggal, formatWaktu } from '@/utils/formatTanggal';

const message = useMessage();
const router = useRouter();
const route = useRoute();

const profileData = ref({
  name: '',
  jenjang: '',
  email: '',
  whatsapp: '',
  telpWali: '',
  sekolah: '',
  alamat: ''
});
function mapGroupType(type) {
  switch (type) {
    case 'privat': return 'Privat';
    case 'grup2': return 'Kelompok 2 Peserta';
    case 'grup3': return 'Kelompok 3 Peserta';
    case 'grup4': return 'Kelompok 4 Peserta';
    case 'grup5': return 'Kelompok 5 Peserta';
    case 'kelas': return 'Kelas';
    default: return type;
  }
}
const registeredProgramsData = ref([]);
const programScheduleData = ref([]);

async function fetchSiswaDetail() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/users/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    const data = json.data;
    const student = data.students?.[0] || {};
    profileData.value = {
      name: data.name,
      jenjang: student.level ? `${student.level}` : '',
      email: data.email,
      whatsapp: student.phone || '',
      telpWali: student.parentPhone || '',
      sekolah: student.schoolName || '',
      alamat: student.address || ''
    };
  } catch (err) {
    message.error('Gagal mengambil detail siswa');
  }
}

async function fetchRegisteredPrograms() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/classes/student/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    registeredProgramsData.value = (json.data || []).map((item, idx) => ({
      key: idx + 1,
      program: `${item.programName} ${item.level}`,
      tutor: item.tutorName,
      status: item.status === 'berjalan' ? 'Berjalan' : item.status,
      type: mapGroupType(item.groupType),
      schedule: item.days,
      time: item.time ? formatWaktu(item.time) : '',
      duration: item.duration ? `${item.duration} Menit` : '',
      code: item.code
    }));
  } catch (err) {
    registeredProgramsData.value = [];
  }
}

async function fetchProgramSchedule() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/schedules/user/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    programScheduleData.value = (json.data?.data || []).map((item, idx) => ({
      key: idx + 1,
      program: `${item.packageName} ${item.level}`,
      tutor: item.tutorName,
      type: mapGroupType(item.groupType),
      session: item.meet,
      date: item.date ? formatTanggal(item.date) : '',
      time: item.date ? formatWaktu(item.date) : '',
      duration: item.duration ? `${item.duration} Menit` : '',
      status: item.status,
      code: item.classCode,
      photo: item.photo,
      address: item.address,
      slug: item.slug
    }));
  } catch (err) {
    programScheduleData.value = [];
  }
}

onMounted(() => {
  fetchSiswaDetail();
  fetchRegisteredPrograms();
  fetchProgramSchedule();
});

const showDeleteConfirm = ref(false);

const handleEdit = () => {
  router.push(`/dashboardadmin/siswa/edit/${route.params.id}`);
};
const handleDelete = () => {
  showDeleteConfirm.value = true;
};
const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/users/${route.params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Gagal menghapus user');
    showDeleteConfirm.value = false;
    message.success('Akun berhasil dihapus!');
    router.push('/dashboardadmin/siswa');
  } catch (err) {
    message.error('Gagal menghapus akun!');
  }
};
const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const handleDropdownSelect = (key) => message.info(`Memilih aksi: ${key}`);

const dropdownOptions = [
  { label: 'Lihat Detail', key: 'detail' },
  { label: 'Ubah Jadwal', key: 'ubah' },
  { label: 'Batalkan', key: 'batal' }
];

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
      let label = row.status;
      switch (row.status) {
      case 'masuk':
        type = 'primary';
        label = 'Masuk';
        break;
      case 'terjadwal':
        type = 'success';
        label = 'Terjadwal';
        break;
      case 'jadwal_ulang':
        type = 'warning';
        label = 'Jadwal Ulang';
        break;
      case 'izin':
        type = 'error';
        label = 'Izin';
        break;
      case 'alpha':
        type = 'error';
        label = 'Alpha';
        break;
      default:
        type = 'default';
        label = row.status;
      }
      return h(NTag, {
      type: type,
      bordered: false,
      round: true,
      style: 'width: 100px; justify-content: center;'
      }, { default: () => label });
    }
  },
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
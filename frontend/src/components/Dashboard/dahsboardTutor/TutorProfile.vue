<script setup lang="ts">
import { h } from 'vue';
import { NCard, NSpace, NGrid, NGi, NStatistic, NAvatar, NButton, NIcon, NText, NH1, NH3, NDescriptions, NDescriptionsItem, NTag, NButtonGroup } from 'naive-ui';
import {
  CreateOutline as EditIcon,
  TrashOutline as DeleteIcon,
  MailOutline as EmailIcon,
  CallOutline as PhoneIcon,
  HomeOutline as HomeIcon,
  PersonOutline as GenderIcon,
  SchoolOutline as UniversityIcon,
  RibbonOutline as StatusIcon,
  BookOutline as MajorIcon,
  EllipsisHorizontal as MoreIcon
} from '@vicons/ionicons5';

// --- Data Mockup Berdasarkan Gambar ---

const tutorInfo = {
  name: 'Pak Dendy Wan S.Pd',
  age: 32,
  email: 'namaemail@gmail.com',
  phone: '085786234264',
  address: 'Jl Sekaran No.05 RT05/04, Gunung Pati, Kota Semarang',
  gender: 'Laki-laki',
  university: 'Universitas Negeri Semarang',
  status: 'Sarjana S1',
  major: 'Pendidikan Matematika'
};

const programStats = [
  { label: 'Program Terbuka', value: '04', color: '#f2994a' },
  { label: 'Program Berjalan', value: '01', color: '#f2994a' },
  { label: 'Program Selesai', value: '03', color: '#f2994a' }
];

const teachingFields = {
  level: 'SMP, SMA',
  subjects: 'Matematika, fisika, kimia'
};

const activeDays = [
  { day: 'Senin', active: true },
  { day: 'Selasa', active: true },
  { day: 'Rabu', active: true },
  { day: 'Kamis', active: true },
  { day: 'Jum\'at', active: true },
  { day: 'Sabtu', active: false },
];

type NTagType = "info" | "success" | "default" | "error" | "primary" | "warning";

interface ProgramScheduleItem {
  subject: string;
  tutor: string;
  type: string;
  meetings: number;
  date: string;
  time: string;
  duration: string;
  status: { label: string; type: NTagType };
}

const programSchedule: ProgramScheduleItem[] = [
  {
    subject: 'Matematika SMA',
    tutor: 'Pak Dendy Wan S.Pd',
    type: 'Privat',
    meetings: 12,
    date: 'Rabu, 12 Maret 2025',
    time: '15:00',
    duration: '90 Menit',
    status: { label: 'Masuk', type: 'info' }
  },
  {
    subject: 'Fisika SMA',
    tutor: 'Pak Dendy Wan S.Pd',
    type: 'Kelompok 5 Peserta',
    meetings: 7,
    date: 'Kamis, 13 Maret 2025',
    time: '15:00',
    duration: '120 Menit',
    status: { label: 'Terjadwal', type: 'success' }
  },
  {
    subject: 'Matematika SMA',
    tutor: 'Pak Dendy Wan S.Pd',
    type: 'Privat',
    meetings: 13,
    date: 'Sabtu, 15 Maret 2025',
    time: '15:00',
    duration: '90 Menit',
    status: { label: 'Terjadwal', type: 'success' }
  },
];

const openPrograms = [
    {
        subject: 'Matematika SMA',
        tutor: 'Pak Dendy Wan S.Pd',
        status: 'Berjalan',
        type: 'Privat',
        schedule: 'Senin, Rabu, Sabtu',
        time: '15:00',
        duration: '90 Menit',
    },
    {
        subject: 'Fisika SMA',
        tutor: 'Pak Dendy Wan S.Pd',
        status: 'Berjalan',
        type: 'Kelompok 5 Peserta',
        schedule: 'Selasa, Kamis',
        time: '15:00',
        duration: '120 Menit',
    },
    {
        subject: 'Fokus UTBK',
        tutor: 'Pak Wendy S.Pd, M.Pd',
        status: 'Berjalan',
        type: 'Kelas',
        schedule: 'Senin',
        time: '15:00',
        duration: '120 Menit',
    }
];

// Helper untuk render ikon
const renderIcon = (icon: any) => () => h(NIcon, null, { default: () => h(icon) });

</script>

<template>
  <div style="padding: 24px; background-color: #f7f8fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <NSpace vertical :size="24">
      <NCard :bordered="false" style="background-color: transparent;">
        <NSpace align="center" justify="space-between">
          <NSpace align="center">
            <NAvatar round :size="48" style="background-color: #dbeafe; color: #1e40af; font-weight: bold; font-size: 1.2rem;">
              {{ tutorInfo.age }}
            </NAvatar>
            <NH1 style="margin: 0; font-size: 1.75rem; font-weight: 600;">{{ tutorInfo.name }}</NH1>
          </NSpace>
          <NSpace>
            <NButton :render-icon="renderIcon(EditIcon)" secondary>Edit Profil</NButton>
            <NButton :render-icon="renderIcon(DeleteIcon)" tertiary type="error">Hapus Akun</NButton>
          </NSpace>
        </NSpace>
      </NCard>

      <NGrid :cols="3" :x-gap="24">
        <NGi v-for="stat in programStats" :key="stat.label">
          <NCard :bordered="false" style="border-radius: 12px;">
            <NStatistic :label="stat.label">
              <span :style="{ color: stat.color, fontSize: '3rem', fontWeight: 'bold' }">{{ stat.value }}</span>
            </NStatistic>
          </NCard>
        </NGi>
      </NGrid>

      <NCard :bordered="false" style="border-radius: 12px;">
        <NGrid :cols="2" :x-gap="48" :y-gap="24" responsive="screen" item-responsive>
          <NGi>
            <NDescriptions label-placement="left" :column="1" :label-style="{ fontWeight: 500, color: '#666' }">
              <NDescriptionsItem :label-icon="renderIcon(EmailIcon)" label="Alamat E-mail">{{ tutorInfo.email }}</NDescriptionsItem>
              <NDescriptionsItem :label-icon="renderIcon(PhoneIcon)" label="No. WhatsApp">{{ tutorInfo.phone }}</NDescriptionsItem>
              <NDescriptionsItem :label-icon="renderIcon(HomeIcon)" label="Alamat rumah">{{ tutorInfo.address }}</NDescriptionsItem>
            </NDescriptions>
          </NGi>
          <NGi>
            <NDescriptions label-placement="left" :column="1" :label-style="{ fontWeight: 500, color: '#666' }">
              <NDescriptionsItem :label-icon="renderIcon(GenderIcon)" label="Gender">{{ tutorInfo.gender }}</NDescriptionsItem>
              <NDescriptionsItem :label-icon="renderIcon(UniversityIcon)" label="Asal Kampus">{{ tutorInfo.university }}</NDescriptionsItem>
              <NDescriptionsItem :label-icon="renderIcon(StatusIcon)" label="Status">{{ tutorInfo.status }}</NDescriptionsItem>
              <NDescriptionsItem :label-icon="renderIcon(MajorIcon)" label="Prodi">{{ tutorInfo.major }}</NDescriptionsItem>
            </NDescriptions>
          </NGi>
          <NGi span="2">
             <NDescriptions title="Bidang Ajar" label-placement="left" :column="1" :label-style="{ fontWeight: 500, color: '#666' }">
                <NDescriptionsItem label="Jenjang">{{ teachingFields.level }}</NDescriptionsItem>
                <NDescriptionsItem label="Mata Pelajaran">{{ teachingFields.subjects }}</NDescriptionsItem>
            </NDescriptions>
          </NGi>
        </NGrid>
      </NCard>
      
      <NCard :bordered="false" style="border-radius: 12px;">
            <NH3 style="margin-top: 0;">Hari Aktif</NH3>
            <NButtonGroup>
                <NButton 
                    v-for="item in activeDays" 
                    :key="item.day" 
                    :type="item.active ? 'primary' : 'default'"
                    ghost
                >
                    {{ item.day }}
                </NButton>
            </NButtonGroup>
        </NCard>

      <NCard :bordered="false" style="border-radius: 12px; background-color: #0d47a1; color: white;">
        <NH3 style="margin-top: 0; color: white;">Jadwal Program</NH3>
        <div class="schedule-grid header">
            <NText :depth="3" strong>Jadwal</NText>
            <NText :depth="3" strong>Jenis</NText>
            <NText :depth="3" strong>Pertemuan</NText>
            <NText :depth="3" strong>Tanggal</NText>
            <NText :depth="3" strong>Jam</NText>
            <NText :depth="3" strong>Durasi</NText>
            <NText :depth="3" strong>Status</NText>
        </div>
        <div v-for="(item, index) in programSchedule" :key="index" class="schedule-grid item-row">
            <div>
                <NText strong>{{ item.subject }}</NText><br>
                <NText :depth="3">{{ item.tutor }}</NText>
            </div>
            <NText>{{ item.type }}</NText>
            <NText>{{ item.meetings }}</NText>
            <NText>{{ item.date }}</NText>
            <NText>{{ item.time }}</NText>
            <NText>{{ item.duration }}</NText>
            <NTag :type="item.status.type" round>{{ item.status.label }}</NTag>
        </div>
      </NCard>

      <NCard :bordered="false" style="border-radius: 12px;">
            <NH3 style="margin-top: 0;">Program Terbuka</NH3>
             <div class="open-program-grid header">
                <NText strong>Matematika SMA</NText>
                <NText strong>Berjalan</NText>
                <NText strong>Privat</NText>
                <NText strong>Senin, Rabu, Sabtu</NText>
                <NText strong>Jam</NText>
                <NText strong>Durasi</NText>
                <NText strong></NText>
            </div>
            <div v-for="(item, index) in openPrograms" :key="index" class="open-program-grid item-row">
                <div>
                    <NText strong>{{ item.subject }}</NText><br>
                    <NText :depth="3">{{ item.tutor }}</NText>
                </div>
                <NText>{{ item.status }}</NText>
                <NText>{{ item.type }}</NText>
                <NText>{{ item.schedule }}</NText>
                <NText>{{ item.time }}</NText>
                <NText>{{ item.duration }}</NText>
                <NButton text :render-icon="renderIcon(MoreIcon)"></NButton>
            </div>
        </NCard>

    </NSpace>
  </div>
</template>

<style scoped>
/* Menghilangkan margin default dari H1, H3 */
:deep(h1), :deep(h3) {
  margin-block-start: 0;
  margin-block-end: 0;
}
/* Menyesuaikan style deskripsi */
:deep(.n-descriptions-item-label) {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Grid untuk Jadwal */
.schedule-grid {
    display: grid;
    grid-template-columns: 2fr 1.5fr repeat(5, 1fr);
    gap: 16px;
    align-items: center;
    padding: 12px 16px;
    color: inherit;
}

/* Grid untuk Program Terbuka */
.open-program-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1.5fr 1.5fr 1fr 1fr 0.5fr;
    gap: 16px;
    align-items: center;
    padding: 12px 16px;
}

.schedule-grid.header, .open-program-grid.header {
    color: #888;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 8px;
}

/* Ubah warna header jadwal program karena background-nya gelap */
#app > div > div > div:nth-child(5) > div > div.schedule-grid.header > span {
    color: #bdc1c6 !important;
}


.schedule-grid .n-text, .open-program-grid .n-text {
    color: inherit;
}

.item-row {
    background-color: white;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
/* Hilangkan margin-bottom pada item terakhir */
.item-row:last-child {
    margin-bottom: 0;
}
/* Sesuaikan warna text untuk baris jadwal di dalam card biru */
#app > div > div > div:nth-child(5) > div > div.schedule-grid.item-row span {
    color: #333;
}
</style>
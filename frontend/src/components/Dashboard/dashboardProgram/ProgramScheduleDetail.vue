<template>
  <div class="page-container">
    <n-space vertical :size="32">
      <header>
        <h2 class="page-title">Detail Program</h2>
        <p class="page-subtitle">{{ program.tutorName }}</p>
      </header>
      
      <n-card :bordered="false" content-style="padding: 24px;">
        <n-grid :x-gap="24" :y-gap="24" cols="1 s:1 m:3" responsive="screen">
          <n-gi span="1">
            <n-image
              width="100%"
              height="100%"
              object-fit="cover"
              :src="program.tutorImage"
              alt="Foto Tutor"
              style="border-radius: 12px;"
            />
          </n-gi>
          <n-gi span="2">
            <n-space vertical size="medium">
              <n-space align="center" justify="space-between">
                <h3 class="program-name">{{ program.subject }}</h3>
                <n-tag :bordered="false" type="info" class="level-tag">{{ program.level }}</n-tag>
              </n-space>

              <n-space>
                <n-tag
                  v-for="day in allDays"
                  :key="day"
                  :type="program.activeDays.includes(day) ? 'primary' : 'default'"
                  :bordered="false"
                >
                  {{ day }}
                </n-tag>
              </n-space>

              <n-descriptions label-placement="left" :column="1" :label-style="{width: '120px'}">
                <n-descriptions-item label="Area">{{ program.area }}</n-descriptions-item>
                <n-descriptions-item label="Pertemuan">{{ program.meetings }}</n-descriptions-item>
                <n-descriptions-item label="Pukul">{{ program.time }}</n-descriptions-item>
                <n-descriptions-item label="Durasi">{{ program.duration }}</n-descriptions-item>
                <n-descriptions-item>
                    <template #label><span class="label-highlight">Siswa</span></template>
                    {{ program.students }}
                </n-descriptions-item>
              </n-descriptions>
            </n-space>
          </n-gi>
        </n-grid>
      </n-card>

      <div class="table-section-container">
        <div class="table-header">
          Jadwal Program
        </div>
        <n-data-table
          :columns="scheduleColumns"
          :data="scheduleData"
          :bordered="false"
          :single-line="false"
        />
      </div>
    </n-space>
  </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { useMessage, NSpace, NCard, NGrid, NGi, NImage, NTag, NDescriptions, NDescriptionsItem, NButton, NIcon, NDataTable } from 'naive-ui';
import { EllipsisHorizontal } from '@vicons/ionicons5';

const message = useMessage();
const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];

// --- Data Halaman (bisa diambil dari API) ---
const program = ref({
  tutorImage: 'https://images.unsplash.com/photo-1542327897-4141c5336f09?q=80&w=2524&auto=format&fit=crop', // Placeholder
  tutorName: 'Pak Dendy Wan S.Pd',
  subject: 'Matematika',
  level: 'SMA',
  activeDays: ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
  area: 'Semarang',
  meetings: '6 Bulan (3x perminggu)',
  time: '15:00 WIB',
  duration: '120 Menit',
  students: 'Areli Saverro Biyantora, Alif Abdul Aziz, Raihan Muhammad R. R.'
});

// --- Definisi Kolom dan Data untuk Tabel Jadwal ---
const handleActionClick = (row) => {
    message.info(`Aksi untuk pertemuan ke-${row.pertemuan}`);
}

const scheduleColumns = ref([
    {
        title: 'Program',
        key: 'program',
        render(row) {
            // Render 2 baris teks untuk nama program dan tutor
            return h('div', null, [
                h('div', { style: 'font-weight: 500;' }, row.programName),
                h('div', { style: 'font-size: 12px; color: grey;' }, row.tutorName)
            ])
        }
    },
    { title: 'Pertemuan', key: 'pertemuan', align: 'center' },
    { title: 'Tanggal', key: 'tanggal' },
    { title: 'Jam', key: 'jam' },
    {
        title: 'Status',
        key: 'status',
        align: 'center',
        render(row) {
            // Render NTag dengan warna berbeda berdasarkan status
            const tagType = row.status === 'Terjadwal' ? 'success' : 'primary';
            return h(NTag, { type: tagType, bordered: false }, { default: () => row.status });
        }
    },
    {
        title: 'Aksi',
        key: 'aksi',
        align: 'center',
        render(row) {
            // Render tombol aksi dengan ikon
            return h(NButton, {
                tertiary: true,
                circle: true,
                onClick: () => handleActionClick(row)
            }, { default: () => h(NIcon, null, { default: () => h(EllipsisHorizontal)})});
        }
    }
]);

const scheduleData = ref([
    { programName: 'Matematika SMA', tutorName: 'Pak Dendy Wan S.Pd', pertemuan: 12, tanggal: 'Rabu, 12 Maret 2025', jam: '15:00', status: 'Masuk' },
    { programName: 'Matematika SMA', tutorName: 'Pak Dendy Wan S.Pd', pertemuan: 13, tanggal: 'Sabtu, 15 Maret 2025', jam: '15:00', status: 'Terjadwal' },
    { programName: 'Matematika SMA', tutorName: 'Pak Dendy Wan S.Pd', pertemuan: 14, tanggal: 'Senin, 17 Maret 2025', jam: '15:00', status: 'Terjadwal' },
    { programName: 'Matematika SMA', tutorName: 'Pak Dendy Wan S.Pd', pertemuan: 2, tanggal: 'Selasa, 18 Maret 2025', jam: '15:00', status: 'Terjadwal' },
    { programName: 'Matematika SMA', tutorName: 'Pak Dendy Wan S.Pd', pertemuan: 15, tanggal: 'Rabu, 19 Maret 2025', jam: '15:00', status: 'Terjadwal' },
]);
</script>

<style scoped>
.page-container {
  padding: 24px;
  background-color: #f7f9fc;
}
.page-title {
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}
.page-subtitle {
  margin: 4px 0 0 0;
  color: #4b5563;
  font-size: 1rem;
}
.program-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.level-tag {
  background-color: #1e3a8a;
  color: white;
  font-weight: 600;
}
.label-highlight {
    color: #f97316; /* Warna oranye untuk label Siswa */
    font-weight: 600;
}
.table-section-container {
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}
.table-header {
  background-color: #1e3a8a;
  color: white;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 1.1rem;
}
:deep(.n-data-table-td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}
</style>
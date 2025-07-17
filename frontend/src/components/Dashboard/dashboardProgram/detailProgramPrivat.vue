<script setup lang="ts">
import { ref, onMounted } from 'vue';
import butPrimerNormal from '@/components/dirButton/butPrimerNormal.vue';
import { useRouter, useRoute } from 'vue-router'
import SkemaBiaya from './SkemaBiaya.vue';
import {TrashOutline} from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import { formatWaktu } from '@/utils/formatTanggal';

const router = useRouter();
const route = useRoute();
const message = useMessage();

const programData = ref<any>(null);
const sortedGroupType = ref<any[]>([]);

const badgeClass = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'sd':
      return 'grade-sd';
    case 'smp':
      return 'grade-smp';
    case 'sma':
      return 'grade-sma';
    default:
      return '';
  }
};

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function editProgram() {
  if (programData.value?.slug) {
    router.push(`/dashboardadmin/programadmin/editprogram/${programData.value.slug}`);
  }
}

function handleDelete() {
  const token = localStorage.getItem('token');
  const slug = programData.value?.slug;
  if (!token || !slug) {
    message.error('Token atau slug tidak ditemukan');
    return;
  }
  if (!confirm(`Yakin hapus program "${programData.value.name}"?`)) return;
  fetch(`/packages/${slug}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async res => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal menghapus program');
      }
      message.success('Program berhasil dihapus');
      router.push('/dashboardadmin/programadmin');
    })
    .catch(e => {
      message.error(e.message || 'Gagal menghapus program');
    });
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  const slug = route.params.slug;
  try {
    const res = await fetch(`/packages/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gagal mengambil data program');
    const data = await res.json();
    programData.value = data;

    if (data.groupType && Array.isArray(data.groupType)) {
      sortedGroupType.value = [...data.groupType].sort((a, b) => {
        const priceA = Number(a.discPrice || a.price);
        const priceB = Number(b.discPrice || b.price);
        return priceA - priceB;
      });
    }
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div class="detail-flow" v-if="programData">
    <div class="detail-ccontainer">
      <h4 class="headerb1">Detail Program</h4>
      <n-divider class="divider" />
      <div class="header-program">
        <img
          class="tutor-photo"
            :src="programData.photo ? `${programData.photo}` : '/Tutor_Default.png'"
          alt="Tutor Photo"
        />
        <div class="card-content">
          <div class="header-section">
            <div>
              <div class="subject headersb1">{{ programData.name }} {{ programData.level }}</div>
              <div class="tutor-name bodym2">{{ programData.tutorName }}</div>
            </div>
            <div>
              <div
                class="headerb1"
                :class="badgeClass(programData.level)"
              >
                {{ programData.level }}
              </div>
            </div>
          </div>
          <n-space class="bodyr2">
            <n-tag
              v-for="(day, index) in allDays"
              :key="index"
              class="tag"
              :class="{ 'tag-unselected': !programData.days?.includes(day) }"
            >
              {{ day }}
            </n-tag>
          </n-space>
          <div class="info-section bodyr2">
            <div class="info-row">
              <span class="label-data"><strong>Area</strong></span>
              <span class="value">: {{ programData.area }}</span>
            </div>
            <div class="info-row">
              <span class="label-data"><strong>Pukul</strong></span>
              <span class="value">: {{ formatWaktu(programData.time) }}</span>
            </div>
            <div class="info-row">
              <span class="label-data"><strong>Durasi</strong></span>
              <span class="value">: {{ programData.duration }} menit</span>
            </div>
          </div>
          <div class="meeting-link bodysb1">{{ programData.status === 'aktif' ? 'Aktif' : 'Berjalan' }}</div>
          <n-space>
            <p class="headerb3">
              <template v-if="sortedGroupType.length">
                Rp{{ Number(sortedGroupType[0].discPrice || sortedGroupType[0].price).toLocaleString('id-ID') }}
                -
                Rp{{ Number(sortedGroupType[sortedGroupType.length-1].discPrice || sortedGroupType[sortedGroupType.length-1].price).toLocaleString('id-ID') }}
              </template>
            </p>
          </n-space>
          <div style="display: flex; gap: 1rem;">
            <butPrimerNormal label="Edit Program" @click="editProgram"/>
          <n-button type="error" ghost round @click="handleDelete">
            <template #icon><n-icon :component="TrashOutline" /></template>
            Hapus Akun
          </n-button>
          </div>
          
        </div>
      </div>
      <SkemaBiaya class="tabel" />
      <div class="tabel catatan">
        <h3 class="bodysb1">Catatan:</h3>
        <ul style="padding-left: 20px; line-height: 1.6;">
          <li>Paket Privat/Kelompok: Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</li>
          <li>Paket Kelas: Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</li>
          <li>Honor Tutor merupakan 70% dari biaya total program.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-flow{
  background-color: #0B2343;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
}
.detail-ccontainer{
  width: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  height: fit-content;
}
.headerb1{
  color: #154484;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.header-program {
  display: flex;
  flex-direction: row;
  gap: 1rem;
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
.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
.headersb1 {
  color: #154484;
}
.info-section {
  display: flex;
  flex-direction: column;
  color: #333;
}
.label-data{
  display: inline-block; 
  width: 60px;
}
.tag {
  background-color: #154484;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  transition: background 0.2s, color 0.2s;
}
.tag-unselected {
  background-color: #e0e0e0;
  color: #888;
}
.meeting-link {
  color: #FB8312;
}
.bodysb2, .headerb3 {
  color: #154484;
}
.tabel {
  margin-top: 1rem;
}
.catatan {
  color: #FB8312;
}
</style>
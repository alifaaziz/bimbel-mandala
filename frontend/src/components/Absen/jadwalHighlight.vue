<script setup>
import { ref, onMounted } from 'vue';
import { NCard, NTag } from 'naive-ui';
import butJadwal from '../dirButton/butJadwal.vue';
import butDetailJadwal from '../dirButton/butDetailJadwal.vue';
import { useRouter } from 'vue-router';

const jadwalList = ref([]);
const router = useRouter();

const tagTypeMap = {
  "Terjadwal": "success",
  "Jadwal Ulang": "warning",
  "Masuk": "info",
  "Izin": "error"
};

function statusLabel(status) {
  switch (status) {
    case "masuk": return "Masuk";
    case "terjadwal": return "Terjadwal";
    case "jadwal_ulang": return "Jadwal Ulang";
    case "izin": return "Izin";
    default: return status;
  }
}

function formatTanggal(dateStr) {
  const date = new Date(dateStr);
  const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
  const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  return `${hari}, ${tanggal}`;
}

function formatJam(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  const res = await fetch('/schedules', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) {
    const result = await res.json();
    jadwalList.value = (result.data.data || [])
      .slice(0, 4)
      .map(item => ({
        id: item.id,
        packageName: item.packageName,
        level: item.level,
        tutorName: item.tutorName,
        tanggal: formatTanggal(item.date),
        jam: formatJam(item.date),
        status: statusLabel(item.status),
        photo: item.photo,
        slug: item.slug
      }));
  }
});

function goToDetail(item) {
  router.push(`/detailjadwal/${item.slug}`);
}
</script>

<template>
  <div class="tutor-component">
    <h1 class="headerr2 title1">Jadwal Program</h1>
    <h2 class="headerb1 title2">Terdekat</h2>
    <div class="card-container">
      <n-card
        v-for="item in jadwalList"
        :key="item.id"
        :id="item.id"
        style="border: 1px solid #154484; border-radius: 20px; cursor:pointer;"
        @click="goToDetail(item)"
      >
        <template #cover>
          <img 
            :src="item.photo ? `${item.photo}` : '/Tutor_Default.png'"
          />
        </template>
        <template #header>
          <div class="headerr3 jadwal_title">
            {{ item.packageName }}, {{ item.level }}
            <n-tag
                :type="tagTypeMap[item.status]"
                size="small"
                class="bodyr4"
                round
              >
                {{ item.status }}
              </n-tag>
          </div>
        </template>
        <div class="bodyr3 content">
          <div class="info-row">
            <span class="label">Hari</span>
            <span class="value">: {{ item.tanggal }}</span>
          </div>
          <div class="info-row">
            <span class="label">Pukul</span>
            <span class="value">: {{ item.jam }}</span>
          </div>
        </div>
        <butDetailJadwal />
      </n-card>
    </div>
    <butJadwal />
  </div>
</template>

<style scoped>

.tutor-component {
  place-items: center;
}
.card-container {
  display: flex;
  gap: 24px; /* Jarak antar kartu */
  flex-wrap: wrap; /* Membuat kartu turun ke baris berikutnya jika tidak muat */
  margin-bottom: 1rem;
}

.n-card {
  flex: 1; /* Membuat lebar kartu fleksibel */
  max-width: 500px; /* Batas maksimum lebar kartu */
  border-radius: 20px;
}

.n-card img {
  width: 100%; /* Membuat gambar menyesuaikan lebar kartu */
  aspect-ratio: 4 / 3; /* Menetapkan rasio 4:3 */
  object-fit: cover; /* Memastikan gambar tidak terdistorsi */
  border-radius: 20px 20px 0px 0px; /* Opsional: Menambahkan sudut melengkung */
}

.n-card .content {
  color: #061222;
  margin-bottom: 1rem;
}

.jadwal_title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.caption {
  color: #9BAFCB;
  text-align: left;
}
.content {
  color: #9BAFCB;
}

.info-row {
    display: flex;
}

.label {
    text-align: left;
    width: 40px;
}

.title1 {
    color: #FDC998 !important;
    text-align: center;
}
.title2 {
    color: #154484;
    text-align: center;
    margin-bottom: 12px;
}

/* Media query untuk layar di bawah 961px */
@media (max-width: 960px) {
  .card-container {
    display: grid; /* Ubah menjadi grid layout */
    grid-template-columns: repeat(2, 1fr); /* Dua kolom dengan lebar yang sama */
    gap: 16px; /* Kurangi jarak antar kartu */
  }
  
  .n-card {
    max-width: 100%; /* Kartu menyesuaikan lebar kolom */
  }
  .jadwal_title {
    flex-direction: column;
    font-size: 14px;
  }
}
</style>
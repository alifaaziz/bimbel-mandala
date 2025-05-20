<template>
  <div class="program-card">
    <div class="card-header headerb3">Program Terdaftar</div>
    <div class="card-body">
      <!-- DESKTOP TABLE -->
      <div class="table-wrapper" v-if="!isMobile">
        <n-data-table
          :bordered="false"
          :columns="columns"
          :data="data"
          :row-props="rowProps"
        />
      </div>

      <!-- MOBILE CARD LIST -->
      <div class="mobile-cards" v-else>
        <div
          class="mobile-card"
          v-for="item in data"
          :key="item.key"
          @click="goToDetail"
        >
          <div class="title">{{ item.jadwal }}</div>
          <div class="subtitle">{{ item.guru }}</div>
          <div class="info"><strong>Jenis:</strong> {{ item.jenis }}</div>
          <div class="info"><strong>Pertemuan:</strong> {{ item.pertemuan }}</div>
          <div class="info"><strong>Tanggal:</strong> {{ item.tanggal }}</div>
          <div class="info"><strong>Jam:</strong> {{ item.jam }}</div>
          <div class="info"><strong>Durasi:</strong> {{ item.durasi }}</div>
          <div class="info status-tags">
            <strong>Status:</strong>
            <n-tag
              v-for="tag in item.status"
              :key="tag"
              :type="tagTypeMap[tag] || 'default'"
              size="small"
              round
              class="bodyr4"
            >
              {{ tag }}
            </n-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NTag } from "naive-ui";
import { defineComponent, h, ref, onMounted } from "vue";

export default defineComponent({
  setup() {
    const isMobile = ref(false);

    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 600;
    };

    onMounted(() => {
      updateIsMobile();
      window.addEventListener("resize", updateIsMobile);
    });

    const tagTypeMap = {
      "Terjadwal": "success",
      "Jadwal Ulang": "warning",
      "Masuk": "info",
      "Izin": "error"
    };

    const rowProps = (row) => ({
      style: { cursor: 'pointer' },
      onClick: () => window.location.href = '/DetailJadwal'
    });

    const columns = [
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Jadwal'),
        key: "jadwal",
        render(row) {
          return h("div", {}, [
            h("div", { style: "font-weight: 600;" }, row.jadwal),
            h("div", { style: "font-size: 12px; color: #666;" }, row.guru)
          ]);
        }
      },
      { title: "Jenis", key: "jenis" },
      { title: "Pertemuan", key: "pertemuan" },
      { title: "Tanggal", key: "tanggal" },
      { title: "Jam", key: "jam" },
      { title: "Durasi", key: "durasi" },
      {
        title: "Status",
        key: "status",
        render(row) {
          return row.status.map(tag => {
            return h(
              NTag,
              {
                type: tagTypeMap[tag] || "default",
                size: "small",
                round: true,
                bordered: false,
                class: "bodyr4",
                style: "margin-right: 6px"
              },
              { default: () => tag }
            );
          });
        }
      }
    ];

    const data = [
      {
        key: 1,
        jadwal: "Fokus UTBK",
        guru: "Pak Wendy S.Pd, M.Pd",
        jenis: "Kelas",
        pertemuan: 3,
        tanggal: "Senin, 17 Maret 2025",
        jam: "15:00",
        durasi: "120 Menit",
        status: ["Terjadwal"]
      },
      {
        key: 2,
        jadwal: "Fisika SMA",
        guru: "Pak Venita S.Pd",
        jenis: "Kelompok 5 Peserta",
        pertemuan: 7,
        tanggal: "Kamis, 13 Maret 2025",
        jam: "15:00",
        durasi: "120 Menit",
        status: ["Jadwal Ulang"]
      },
      {
        key: 3,
        jadwal: "Matematika SMA",
        guru: "Pak Dendy Wan S.Pd",
        jenis: "Kelompok 3 Orang",
        pertemuan: 12,
        tanggal: "Rabu, 12 Maret 2025",
        jam: "15:00",
        durasi: "90 Menit",
        status: ["Masuk"]
      },
      {
        key: 4,
        jadwal: "Matematika SMA",
        guru: "Pak Dendy Wan S.Pd",
        jenis: "Kelompok 3 Orang",
        pertemuan: 13,
        tanggal: "Sabtu, 8 Maret 2025",
        jam: "10:00",
        durasi: "90 Menit",
        status: ["Izin"]
      }
    ];

    const goToDetail = () => {
      window.location.href = '/DetailJadwal';
    };

    return {
      data,
      columns,
      tagTypeMap,
      rowProps,
      isMobile,
      goToDetail
    };
  }
});
</script>

<style scoped>
.program-card {
  border: 1px solid #f39c12;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  color: #061222;
  max-width: 100%;
}

.card-header {
  background-color: #154288;
  color: white;
  padding: 12px 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-body {
  padding: 16px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.n-data-table {
  min-width: 768px;
}

/* Mobile Card Styling */
.mobile-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px;
  background: #fdfdfd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-card:hover {
  background-color: #f1f1f1;
}

.mobile-card .title {
  font-weight: bold;
  font-size: 16px;
  color: #154484;
}

.mobile-card .subtitle {
  font-size: 13px;
  color: #777;
  margin-bottom: 8px;
}

.mobile-card .info {
  font-size: 13px;
  margin-bottom: 4px;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>

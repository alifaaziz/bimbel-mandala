<script>
import { NTag } from "naive-ui";
import { defineComponent, h, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const slug = route.params.id; // Ambil slug dari URL
    const isMobile = ref(false);
    const data = ref([]); // Data jadwal dari backend

    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 600;
    };

    onMounted(async () => {
      updateIsMobile();
      window.addEventListener("resize", updateIsMobile);

      // Fetch data jadwal dari backend
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/schedules/closest/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal mengambil data jadwal");
        const responseData = await res.json();

        // Format data untuk ditampilkan di tabel
        data.value = responseData.data.map((item) => ({
          key: item.id,
          jadwal: item.packageName,
          guru: item.tutorName,
          jenis: item.groupType,
          pertemuan: `Pertemuan ${item.meet}`,
          tanggal: new Date(item.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            }),
            jam: item.date
              ? new Date(item.date).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
              : "-",
          durasi: `${item.duration} Menit`,
          status: [formatStatus(item.status)],
        }));
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    });

    function formatStatus(status) {
      if (!status) return "-";
      const s = status.toLowerCase();
      if (s === "terjadwal") return "Terjadwal";
      if (s === "jadwal ulang") return "Jadwal Ulang";
      if (s === "masuk") return "Masuk";
      if (s === "izin") return "Izin";
      return status;
    }

    const tagTypeMap = {
      Terjadwal: "success",
      "Jadwal Ulang": "warning",
      Masuk: "info",
      Izin: "error",
    };

    const rowProps = () => ({
      style: { cursor: "pointer" },
      onClick: () => window.location.href = "/DetailJadwal",
    });

    const columns = [
      {
        title: () => h("span", { style: { color: "#154484", fontWeight: "bold" } }, "Jadwal"),
        key: "jadwal",
        render(row) {
          return h("div", {}, [
            h("div", { style: "font-weight: 600;" }, row.jadwal),
            h("div", { style: "font-size: 12px; color: #666;" }, row.guru),
          ]);
        },
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
          return row.status.map((tag) =>
            h(
              NTag,
              {
                type: tagTypeMap[tag] || "default",
                size: "small",
                round: true,
                bordered: false,
                style: "margin-right: 6px",
              },
              { default: () => tag }
            )
          );
        },
      },
    ];

    return {
      data,
      columns,
      tagTypeMap,
      rowProps,
      isMobile,
    };
  },
});
</script>

<template>
  <div class="program-card">
    <div class="card-header headerb3">Jadwal Program</div>
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
          @click="rowProps().onClick"
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
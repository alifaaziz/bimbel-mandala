<script>
import { formatTanggal, formatWaktu } from "@/utils/formatTanggal";
import { NTag } from "naive-ui";
import { defineComponent, h, ref, onMounted } from "vue";

export default defineComponent({
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isMobile = ref(false);
    const data = ref([]);

    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 600;
    };

    onMounted(async () => {
      updateIsMobile();
      window.addEventListener("resize", updateIsMobile);

      const token = localStorage.getItem('token');
      if (!props.slug || !token) return;
      const res = await fetch(`http://localhost:3000/schedules/closest/${props.slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      const sorted = (result.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      data.value = sorted.slice(0, 5).map((item, idx) => ({
        key: item.id || idx + 1,
        jadwal: item.packageName || '-',
        guru: item.tutorName || '-',
        jenis: formatGroupType(item.groupType),
        pertemuan: item.meet ? `Pertemuan ${item.meet}` : '-',
        tanggal: item.date ? formatTanggal(item.date) : '-',
        jam: item.date ? formatWaktu(item.date) : '-',
        durasi: item.duration ? `${item.duration} Menit` : '-',
        status: [formatStatus(item.status)],
      }));
    });

    function formatStatus(status) {
      if (!status) return '-'
      if (status.toLowerCase() === 'terjadwal') return 'Terjadwal'
      if (status.toLowerCase() === 'jadwal ulang') return 'Jadwal Ulang'
      if (status.toLowerCase() === 'masuk') return 'Masuk'
      if (status.toLowerCase() === 'izin') return 'Izin'
      return status
    }

    function formatGroupType(type) {
      if (type === 'privat') return 'Privat'
      if (type === 'kelas') return 'Kelas'
      if (type?.startsWith('grup')) {
        const jumlah = type.replace('grup', '')
        return `Kelompok ${jumlah} Peserta`
      }
      return type
    }

    const tagTypeMap = {
      "Terjadwal": "success",
      "Jadwal Ulang": "warning",
      "Masuk": "info",
      "Izin": "error"
    };

    const columns = [
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Program'),
        key: "program",
        render(row) {
          return h("div", {}, [
            h("div", { style: "font-weight: 600;" }, row.jadwal),
            h("div", { style: "font-size: 12px; color: #666;" }, row.guru)
          ]);
        }
      },
      { title: "Pertemuan", key: "pertemuan" },
      { title: "Tanggal", key: "tanggal" },
      { title: "Jam", key: "jam" },
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

    return {
      data,
      columns,
      tagTypeMap,
      isMobile,
    };
  }
});
</script>

<template>
  <div class="program-card">
    <div class="card-header headerb3">Jadwal Program</div>
    <div class="card-body">
      <div class="table-wrapper" v-if="!isMobile">
        <n-data-table
          :bordered="false"
          :columns="columns"
          :data="data"
        />
      </div>

      <div class="mobile-cards" v-else>
        <div
          class="mobile-card"
          v-for="item in data"
          :key="item.key"
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
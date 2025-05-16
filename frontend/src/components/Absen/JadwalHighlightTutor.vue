<template>
  <n-space vertical :size="12">
    <!-- Desktop Table -->
    <n-data-table
      v-if="!isMobile"
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />

    <!-- Mobile View as Card List -->
    <div v-else class="mobile-card-list">
      <n-card
        v-for="item in data"
        :key="item.key"
        size="small"
        class="mobile-card"
      >
        <div class="card-section">
          <div class="headersb3">{{ item.jadwal }}</div>
          <div class="subtitle">{{ item.guru }}</div>
        </div>

        <div class="card-section">
          <div class="row"><span>Jenis</span><span>{{ item.jenis }}</span></div>
          <div class="row"><span>Pertemuan</span><span>{{ item.pertemuan }}</span></div>
          <div class="row"><span>Tanggal</span><span>{{ item.tanggal }}</span></div>
          <div class="row"><span>Jam</span><span>{{ item.jam }}</span></div>
          <div class="row"><span>Durasi</span><span>{{ item.durasi }}</span></div>
        </div>

        <div class="card-section tag-group">
          <n-tag
            v-for="status in item.status"
            :key="status"
            :type="tagTypeMap[status] || 'default'"
            round
            size="small"
          >
            {{ status }}
          </n-tag>
        </div>

        <n-button
          size="small"
          type="primary"
          ghost
          class="reschedule-btn"
          @click="onReschedule(item)"
        >
          Jadwal Ulang
        </n-button>
      </n-card>
    </div>
  </n-space>
</template>

<script>
import { defineComponent, h, ref, onMounted } from "vue";
import { NTag, NButton, NCard } from "naive-ui";

export default defineComponent({
  setup() {
    const data = ref([
      {
        key: 1,
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
        key: 2,
        jadwal: "Matematika SMA",
        guru: "Pak Dendy Wan S.Pd",
        jenis: "Kelompok 3 Orang",
        pertemuan: 13,
        tanggal: "Sabtu, 15 Maret 2025",
        jam: "15:00",
        durasi: "90 Menit",
        status: ["Terjadwal"]
      },
      {
        key: 3,
        jadwal: "Matematika SMA",
        guru: "Pak Dendy Wan S.Pd",
        jenis: "Kelompok 3 Orang",
        pertemuan: 14,
        tanggal: "Senin, 17 Maret 2025",
        jam: "15:00",
        durasi: "90 Menit",
        status: ["Jadwal Ulang"]
      },
      {
        key: 4,
        jadwal: "Matematika SMA",
        guru: "Pak Dendy Wan S.Pd",
        jenis: "Privat",
        pertemuan: 2,
        tanggal: "Selasa, 18 Maret 2025",
        jam: "15:00",
        durasi: "90 Menit",
        status: ["Terjadwal"]
      },
      {
        key: 5,
        jadwal: "Matematika SMA",
        guru: "Pak Dendy Wan S.Pd",
        jenis: "Kelompok 3 Orang",
        pertemuan: 15,
        tanggal: "Rabu, 19 Maret 2025",
        jam: "15:00",
        durasi: "90 Menit",
        status: ["Terjadwal"]
      }
    ]);

    const isMobile = ref(false);

    const checkIsMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };

    onMounted(() => {
      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);
    });

    const onReschedule = (row) => {
      console.log("Jadwal ulang:", row);
    };

    const tagTypeMap = {
      Masuk: "info",
      Terjadwal: "success",
      "Jadwal Ulang": "warning"
    };

    const columns = [
      {
        title: "Jadwal",
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
          return row.status.map((status) =>
            h(
              NTag,
              {
                style: { marginRight: "6px" },
                type: tagTypeMap[status] || "default",
                round: true,
                bordered: false,
                size: "small"
              },
              { default: () => status }
            )
          );
        }
      },
      {
        title: "Aksi",
        key: "aksi",
        render(row) {
          return h(
            NButton,
            {
              size: "small",
              type: "primary",
              ghost: true,
              onClick: () => onReschedule(row)
            },
            { default: () => "Jadwal Ulang" }
          );
        }
      }
    ];

    return {
      data,
      columns,
      onReschedule,
      tagTypeMap,
      pagination: {
        pageSize: 10
      },
      isMobile
    };
  }
});
</script>

<style scoped>
.mobile-card-list {
    display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 500px;  
  margin: 0 auto;    
  width: 360px;        
  padding: 0;
}
.mobile-card {
  padding: 16px;
}
.card-section {
  margin-bottom: 12px;
}
.subtitle {
  font-size: 13px;
  color: #666;
}
.row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}
.tag-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.reschedule-btn {
  margin-top: 8px;
  width: 100%;
}
</style>

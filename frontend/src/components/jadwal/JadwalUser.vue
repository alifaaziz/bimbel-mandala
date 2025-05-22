<template>
    <div class="container-table padding-components">
        <h4 class="headersb3">
            Jadwal Program
        </h4>
        <div class="tabel-jadwal-wrapper">
          <div class="tabel-jadwal">
              <n-space vertical :size="12">
              <n-data-table
                  :bordered="false"
                  :columns="columns"
                  :data="data"
                  :pagination="pagination"
                  :row-props="rowProps"
              />
              </n-space>
          </div>
        </div>
    </div>
</template>
  
  <script>
  import { NTag, useMessage } from "naive-ui";
  import { defineComponent, h, ref, onMounted } from "vue";
  
  function createColumns({}) {
    return [
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
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Jenis'),
        key: "jenis"
      },
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Pertemuan'),
        key: "pertemuan"
      },
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Tanggal'),
        key: "tanggal"
      },
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Jam'),
        key: "jam"
      },
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Durasi'),
        key: "durasi"
      },
      {
        title: () => h('span', { style: { color: '#154484', fontWeight: 'bold' } }, 'Status'),
        key: "status",
        render(row) {
            const tagTypeMap = {
            "Terjadwal": "success",
            "Jadwal Ulang": "warning",
            "Masuk": "info",
            "Izin": "error"
            };

            return row.status.map((tagKey) => {
            const type = tagTypeMap[tagKey] || "default";
            return h(
                NTag,
                {
                style: { marginRight: "6px" },
                type: type,
                size: "small",
                bordered: false,
                round: true,
                class: "bodyr4"
                },
                { default: () => tagKey }
            );
            });
        }
      }
    ];
  }
  
  function formatTanggal(dateStr) {
    const date = new Date(dateStr);
    const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    return `${hari}, ${tanggal}`;
  }
  
  function formatJam(dateStr) {
    return dateStr.slice(11, 16).replace(':', '.');
  }
  
  function statusLabel(status) {
    switch (status) {
      case "masuk": return "Masuk";
      case "terjadwal": return "Terjadwal";
      case "jadwal_ulang": return "Jadwal Ulang";
      case "izin": return "Izin";
      default: return status;
    }
  }
  
  function groupTypeLabel(type) {
    switch (type) {
      case "privat": return "Privat";
      case "grup2": return "Kelompok 2 Peserta";
      case "grup3": return "Kelompok 3 Peserta";
      case "grup4": return "Kelompok 4 Peserta";
      case "grup5": return "Kelompok 5 Peserta";
      case "kelas": return "Kelas";
      default: return type;
    }
  }
  
  export default defineComponent({
    setup() {
      const message = useMessage();
      const data = ref([]);
  
      const rowProps = (row) => {
        return {
          style: { cursor: 'pointer' },
          onClick: () => {
            window.location.href = '/DetailJadwal';
          }
        };
      };
  
      onMounted(async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:3000/schedules', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          const result = await res.json();
          data.value = (result.data || []).map(item => ({
            key: item.id,
            jadwal: item.packageName,
            guru: item.tutorName,
            jenis: groupTypeLabel(item.groupType),
            pertemuan: item.meet,
            tanggal: formatTanggal(item.date),
            jam: formatJam(item.date),
            durasi: `${item.duration} Menit`,
            status: [statusLabel(item.status)]
          }));
        } catch (err) {
          data.value = [];
        }
      });
  
      return {
        data,
        columns: createColumns({
        }),
        pagination: {
          pageSize: 5
        },
        rowProps
      };
    }
  });
  </script>

<style scoped>
.container-table {
    margin-top: 104px;
    padding: 0;
}
.container-table .headersb3 {
    color: #154484;
}
.tabel-jadwal-wrapper {
  width: 100%;
  overflow-x: auto;
}
.tabel-jadwal {
    width: 100%;
    min-width: 700px;
    padding: 1rem 0;
    border-radius: 1rem;
}
@media (max-width: 768px) {
  .container-table {
    margin-top: 80px;
    padding: 0 0.5rem;
  }

  .container-table .headersb3 {
    font-size: 1rem;
    text-align: center;
  }

  .tabel-jadwal {
    min-width: 600px;
  }

  .n-data-table {
    font-size: 14px;
  }
}
</style>

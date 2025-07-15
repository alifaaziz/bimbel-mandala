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
                  :pagination="false"
                  :row-props="rowProps"
              />
              </n-space>
              <div class="pagination-wrapper">
                <n-pagination
                  :page="pagination.page"
                  :page-size="pagination.pageSize"
                  :page-count="pagination.pageCount"
                  @update:page="handlePageChange"
                  :page-slot="7"
                  v-model:page="page"
                />
              </div>
          </div>
        </div>
    </div>
</template>
  
<script>
import { NTag, useMessage, NPagination } from "naive-ui";
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
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
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
    const pagination = ref({
      page: 1,
      pageSize: 5,
      pageCount: 1
    });

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/schedules?page=${pagination.value.page}&limit=${pagination.value.pageSize}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const result = await res.json();
        data.value = (result.data.data || []).map(item => ({
          key: item.id,
          jadwal: item.packageName,
          guru: item.tutorName,
          jenis: groupTypeLabel(item.groupType),
          pertemuan: item.meet,
          tanggal: formatTanggal(item.date),
          jam: formatJam(item.date),
          durasi: `${item.duration} Menit`,
          status: [statusLabel(item.status)],
          slug: item.slug
        }));
        pagination.value.pageCount = result.data.totalPages || 1;
      } catch (err) {
        data.value = [];
      }
    };

    const handlePageChange = (page) => {
      pagination.value.page = page;
      fetchData();
    };

    onMounted(fetchData);

    return {
      data,
      columns: createColumns({}),
      pagination,
      rowProps: (row) => ({
        style: { cursor: 'pointer' },
        onClick: () => {
          window.location.href = `/detailjadwal/${row.slug}`;
        }
      }),
      handlePageChange
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
    min-width: 800px;
    padding: 2rem 0;
    border-radius: 1rem;
}
:deep(.n-data-table__pagination) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* ...style lain jika ada... */
}
.pagination-wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
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

  .n-data-table {
    font-size: 14px;
  }
}
</style>
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
  import { defineComponent, h } from "vue";
  
  
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
  
  function createData() {
    return [
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
  }
  
  export default defineComponent({
    setup() {
      const message = useMessage();

      const rowProps = (row) => {
            return {
                style: { cursor: 'pointer' },
                onClick: () => {
                    window.location.href = '/DetailJadwal';
                }
            };
        };

      return {
        data: createData(),
        columns: createColumns({
        }),
        pagination: {
          pageSize: 10
        },
        rowProps
      };
    }
  });
  </script>

<style>
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

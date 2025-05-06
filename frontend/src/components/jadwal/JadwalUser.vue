<template>
    <div class="container-table padding-components">
        <h4 class="headersb3">
            Jadwal Program
        </h4>
        <div class="tabel-jadwal">
            <n-space vertical :size="12">
            <n-data-table
                :bordered="false"
                :columns="columns"
                :data="data"
                :pagination="pagination"
            />
            </n-space>
        </div>
    </div>
</template>
  
  <script>
  import { NTag, useMessage } from "naive-ui";
  import { defineComponent, h } from "vue";
  
  
  function createColumns({}) {
    return [
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
      {
        title: "Jenis",
        key: "jenis"
      },
      {
        title: "Pertemuan",
        key: "pertemuan"
      },
      {
        title: "Tanggal",
        key: "tanggal"
      },
      {
        title: "Jam",
        key: "jam"
      },
      {
        title: "Durasi",
        key: "durasi"
      },
      {
        title: "Status",
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
      return {
        data: createData(),
        columns: createColumns({
        }),
        pagination: {
          pageSize: 10
        }
      };
    }
  });
  </script>

<style>
.container-table {
    margin-top: 104px;
    padding: 2rem 0;
}
.container-table .headerb2 {
    margin-bottom: 1rem;
}
.tabel-jadwal {
    width: 100%;
    padding: 2rem 0;
    border-radius: 1rem;
}
</style>

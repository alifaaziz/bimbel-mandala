<script>
import { defineComponent, h, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { NTag, NCard } from "naive-ui";
import butJadwalUlang from "../dirButton/butJadwalUlangTabel.vue";
import butBatal from "../dirButton/butSecondSmall.vue";
import butSumJadwalUlang from "../dirButton/butPrimerSmall.vue";
import butJadwalUlangSuccess from "../dirButton/butPrimerSmall.vue";

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
  components: {
    butJadwalUlang, 
    butBatal,
    butSumJadwalUlang,
    butJadwalUlangSuccess,
  },
  setup() {  
    const data = ref([]);
    const isMobile = ref(false);
    const router = useRouter();

    const checkIsMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };

    onMounted(() => {
      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);
    });

    // State untuk popup jadwal ulang
    const showRescheduleModal = ref(false);
    const selectedSchedule = ref(null);

    // State untuk tanggal dan jam baru
    const rescheduleDate = ref("");
    const rescheduleTime = ref("");

    // State untuk pop up sukses
    const showSuccessModal = ref(false);
    const lastRescheduleDate = ref("");
    const lastRescheduleTime = ref("");

    function openRescheduleModal(row) {
      selectedSchedule.value = row;
      showRescheduleModal.value = true;
      rescheduleDate.value = "";
      rescheduleTime.value = "";
    }

    function closeRescheduleModal() {
      showRescheduleModal.value = false;
      selectedSchedule.value = null;
      rescheduleDate.value = "";
      rescheduleTime.value = "";
    }

    function confirmReschedule() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang.');
        return;
      }
      if (!selectedSchedule.value?.key) {
        alert('Jadwal tidak ditemukan.');
        return;
      }
      if (!rescheduleDate.value || !rescheduleTime.value) {
        alert('Silakan pilih tanggal dan jam baru terlebih dahulu.');
        return;
      }

      const newDate = new Date(`${rescheduleDate.value}T${rescheduleTime.value}:00.000Z`).toISOString();

      fetch(`http://localhost:3000/schedules/reschedule/${selectedSchedule.value.key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newDate })
      })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(
              data.message ||
              (data.error && data.error.message) ||
              data.error ||
              'Gagal melakukan jadwal ulang.'
            );
          }
          lastRescheduleDate.value = rescheduleDate.value;
          lastRescheduleTime.value = rescheduleTime.value;
          showSuccessModal.value = true;
          closeRescheduleModal();
        })
        .catch(err => {
          alert(err.message);
        });
    }

    function closeSuccessModal() {
      showSuccessModal.value = false;
    }

    const tagTypeMap = {
      Masuk: "info",
      Terjadwal: "success",
      "Jadwal Ulang": "warning"
    };

    const rowProps = (row) => {
      return {
        style: { cursor: 'pointer' },
        onClick: (event) => {
          if (event.target.closest('.reschedule-btn')) {
            event.stopPropagation();
            return;
          }
          router.push(`/detailjadwal/${row.slug}`);
        }
      };
    };

    const columns = [
      {
        title: "Jadwal",
        key: "jadwal",
        render(row) {
          return h(
            "div",
            {
              style: "font-weight: 600; cursor:pointer; color:#154484;",
              onClick: () => goToDetailJadwal(row)
            },
            [
              h("div", {}, row.jadwal),
              h("div", { style: "font-size: 12px; color: #666;" }, row.guru)
            ]
          );
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
            butJadwalUlang,
            {
              class: "reschedule-btn",
              label: "Jadwal Ulang",
              onClick: () => openRescheduleModal(row)
            }
          );
        }
      }
    ];

    // Pagination untuk mobile
    const mobilePage = ref(1);
    const mobilePageSize = 3;
    const mobileTotalPage = computed(() =>
      Math.ceil(data.value.length / mobilePageSize)
    );
    const pagedMobileData = computed(() => {
      const start = (mobilePage.value - 1) * mobilePageSize;
      return data.value.slice(start, start + mobilePageSize);
    });

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
          status: [statusLabel(item.status)],
          slug: item.slug
        }));
      } catch (err) {
        data.value = [];
      }
    });

    return {
      data,
      columns,
      tagTypeMap,
      pagination: {
        pageSize: 5
      },
      isMobile,
      // Popup Jadwal Ulang
      showRescheduleModal,
      selectedSchedule,
      openRescheduleModal,
      closeRescheduleModal,
      confirmReschedule,
      rescheduleDate,
      rescheduleTime,
      lastRescheduleDate,
      lastRescheduleTime,
      // Pagination mobile
      mobilePage,
      mobileTotalPage,
      pagedMobileData,
      mobilePageSize,
      // Popup Sukses
      showSuccessModal,
      closeSuccessModal,
      // Tambahkan rowProps untuk klik baris tabel
      rowProps
    };
  }
});
</script>

<template>
  <n-space vertical :size="12">
    <!-- Desktop Table -->
    <n-data-table
      v-if="!isMobile"
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :row-props="rowProps"
    />

    <!-- Mobile View as Card List -->
    <div v-else class="mobile-card-list">
      <n-card
        v-for="item in pagedMobileData"
        :key="item.key"
        size="small"
        class="mobile-card clickable-card"
        @click="goToDetailJadwal(item)"
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
        <butJadwalUlang label="Jadwal Ulang" @click.stop="openRescheduleModal(item)" />
      </n-card>
      <!-- Pagination Control -->
      <div class="mobile-pagination" v-if="mobileTotalPage > 1">
        <button
          class="buttonm1"
          :disabled="mobilePage === 1"
          @click="mobilePage--"
          aria-label="Sebelumnya"
        >
          &#8592;
        </button>
        <button
          class="buttonm1"
          :disabled="mobilePage === mobileTotalPage"
          @click="mobilePage++"
          aria-label="Berikutnya"
        >
          &#8594;
        </button>
      </div>
    </div>
  </n-space>

  <!-- Popup Jadwal Ulang -->
  <div v-if="showRescheduleModal" class="modal-overlay" @click.self="closeRescheduleModal">
    <div class="modal-content">
      <div class="popup-content">
        <h3 class="headersb2">Jadwal Ulang</h3>
        <p class="bodyr3" style="margin-bottom: 16px;">
          Pilih tanggal dan jam baru untuk:<br>
          <strong>{{ selectedSchedule?.jadwal }}</strong> bersama {{ selectedSchedule?.guru }}<br>
          <span>Pertemuan ke-{{ selectedSchedule?.pertemuan }}</span>
        </p>
        <div style="margin-bottom: 12px;">
          <label class="bodym3" for="reschedule-date" style="display:block; margin-bottom:4px;">Tanggal Baru</label>
          <input
            id="reschedule-date"
            type="date"
            v-model="rescheduleDate"
            class="inputm1"
            style="width: 100%; margin-bottom: 8px;"
          />
          <label class="bodym3" for="reschedule-time" style="display:block; margin-bottom:4px;">Jam Baru</label>
          <input
            id="reschedule-time"
            type="time"
            v-model="rescheduleTime"
            class="inputm1"
            style="width: 100%;"
          />
        </div>
      </div>
      <div class="modal-actions">
        <butSumJadwalUlang label="Jadwal Ulang" @click.stop.prevent="confirmReschedule" />
        <butBatal label="Batal" @click="closeRescheduleModal" />
      </div>
    </div>
  </div>

  <!-- Popup Sukses Jadwal Ulang -->
  <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeSuccessModal">
    <div class="modal-content success-modal">
      <div class="popup-content" style="text-align:center;">
        <h3 class="headersb2" style="color:#154484;">Jadwal Ulang Berhasil!</h3>
        <img src="@/assets/success/success.png" alt="">
        <p class="bodyr2" style="margin: 12px 0 20px 0;">
          Penjadwalan ulang berhasil dilakukan. Silahkan untuk memberi kabar ke siswa dan tutor.<br>
          Tanggal: <strong>{{ lastRescheduleDate }}</strong><br>
          Jam: <strong>{{ lastRescheduleTime }}</strong>
        </p>

        <butJadwalUlangSuccess 
          label="Kembali ke Jadwal"
          @click="closeSuccessModal"
          style="width: 100%;"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.n-space {
  margin-top: 104px;
  padding: 2rem 0;
}
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
.headerr2 {
  color: #FB8312;
}
.headerb1{
  color: #154484;
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.popup-content .headersb2, label {
  color: #154484;
}

.bodyr2, .bodyr3 {
  color: #061222;
  text-align: left;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.buttonm1 {
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.buttonm1:hover {
  background: #f0f0f0;
}
.inputm1 {
  padding: 8px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  box-sizing: border-box;
}
.mobile-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0 0 0;
  gap: 8px;
}
.clickable-card {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.clickable-card:hover {
  box-shadow: 0 2px 12px rgba(21,68,132,0.12);
}
.success-modal .headersb2 {
  color: #2DC96B;
}
.success-modal svg {
  display: block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .n-space {
    margin: 40px 0;
  }
}

</style>

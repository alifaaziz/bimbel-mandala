<template>
  <div class="form-container">
    <n-spin :show="isLoading">
      <div class="form-card">
        <h1 class="headerb1">Verifikasi Pendaftaran Tutor</h1>
        <n-divider class="divider" />
        <!-- Foto Profil Bulat -->
        <div class="profile-photo-wrapper">
          <img
            :src="photoUrl"
            alt="Foto Tutor"
            class="profile-photo"
          />
        </div>
        <n-form
          ref="formRef"
          class="form"
          inline
          :model="formValue"
          :rules="rules"
          :size="size"
        >
          <h2 class="headersb3">Informasi Pribadi</h2>
          <div class="grid-form">
            <n-form-item label="Nama Lengkap" path="user.name" class="col-span-6">
              <n-input
                v-model:value="formValue.user.name"
                placeholder="Tuliskan nama tutor disini"
                disabled
              />
            </n-form-item>
          </div>
          <div class="grid-form">
            <n-form-item label="Tanggal Lahir" path="user.ttg" class="col-span-2">
              <n-date-picker v-model:value="formValue.user.ttg" type="date" disabled />
            </n-form-item>
            <n-form-item label="Jenis Kelamin" path="user.gender" class="col-span-2">
              <n-select
                v-model:value="formValue.user.gender"
                :options="optionsgender"
                placeholder="Pilih jenis kelamin"
                disabled
              />
            </n-form-item>
            <n-form-item label="Foto Diri" path="user.photo" class="col-span-2">
              <div class="form-group third-width">
                <!-- Upload dihilangkan, hanya info nama file jika ada -->
                <p class="bodyr3" v-if="formValue.user.photo">File dipilih: {{ formValue.user.photo.name }}</p>
              </div>
            </n-form-item>
          </div>
          <div class="grid-form">
            <n-form-item label="E-mail Tutor" path="user.email" class="col-span-3">
              <n-input
                v-model:value="formValue.user.email"
                placeholder="Tuliskan email tutor disini"
                disabled
              />
            </n-form-item>
            <n-form-item label="No. WhatsApp" path="user.wa" class="col-span-3">
              <n-input
                v-model:value="formValue.user.wa"
                placeholder="Tuliskan No. WhatsApp tutor disini"
                disabled
              />
            </n-form-item>
          </div>
          <div class="grid-form">
            <!-- Hapus password -->
          </div>
          <n-divider class="divider" />
          <h2 class="headersb3">Pendidikan</h2>
          <div class="grid-form">
            <n-form-item label="Asal Universitas" path="user.univ" class="col-span-6">
              <n-input
                v-model:value="formValue.user.univ"
                placeholder="Tuliskan asal universitas tutor disini"
                disabled
              />
            </n-form-item>
          </div>
          <div class="grid-form">
            <n-form-item label="Program Studi" path="user.prodi" class="col-span-4">
              <n-input
                v-model:value="formValue.user.prodi"
                placeholder="Tuliskan program studi tutor disini"
                disabled
              />
            </n-form-item>
            <n-form-item label="Status" path="user.status" class="col-span-2">
              <n-select
                v-model:value="formValue.user.status"
                :options="optionsStatus"
                placeholder="Pilih status"
                disabled
              />
            </n-form-item>
          </div>
          <n-divider class="divider" />
          <h2 class="headersb3">Mengajar</h2>
          <div class="grid-form">
            <n-form-item label="Jenjang" path="user.jenjangAjar" class="col-span-6">
              <n-input
                v-model:value="formValue.user.jenjangAjar"
                placeholder="SD, SMP, atau SMA"
                disabled
              />
            </n-form-item>
          </div>
          <div class="grid-form">
            <n-form-item label="Mata Pelajaran" path="user.pelajaran" class="col-span-6">
              <n-input
                v-model:value="formValue.user.pelajaran"
                placeholder="Matematika, Bahasa Inggris, Fisika, dll."
                disabled
              />
            </n-form-item>
            <n-form-item label="Hari Aktif Mengajar" path="user.days" class="col-span-6">
                <div class="hari-mengajar">
                  <div class="days">
                    <button
                      type="button"
                      v-for="(day, index) in days"
                      :key="index"
                      :class="['day-button', { active: selectedDays.includes(day) }]"
                      disabled
                    >
                      {{ day }}
                    </button>
                  </div>
                </div>
            </n-form-item>
          </div>
        </n-form>
        <div class="action-row">
          <butPrimerNormal
            :loading="isLoading"
            :disabled="isLoading"
            label="Simpan Akun Tutor"
            @click="handleVerify"
          />
          <ButSecondNormalDanger
            label="Tolak Lamaran"
            @click="handleReject"
            class="reject-btn"
          />
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { NSpin } from 'naive-ui';
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";
import ButSecondNormalDanger from "@/components/dirButton/butSecondNormalDanger.vue";

const TutorDefault = "/Tutor_Default.png";
const formRef = ref(null);
const message = useMessage();
const size = ref("medium");
const route = useRoute();
const router = useRouter();

const isLoading = ref(false)

const formValue = ref({
  user: {
    name: "",
    ttg: null,
    gender: "",
    photo: null,
    email: "",
    wa: "",
    pass: "",
    univ: "",
    prodi: "",
    status: "",
    jenjangAjar: "",
    pelajaran: "",
    days: [],
  }
});

const photoUrl = ref(""); 

onMounted(async () => {
  const id = route.params.id;
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:3000/apply/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { data } = await res.json();

    formValue.value.user.name = data.name || "";
    formValue.value.user.ttg = data.birthDate ? new Date(data.birthDate) : null;
    formValue.value.user.gender = data.gender === "Male" ? "laki" : "perempuan";
    formValue.value.user.email = data.email || "";
    formValue.value.user.wa = data.phone || "";
    formValue.value.user.univ = data.school || "";
    formValue.value.user.prodi = data.major || "";
    formValue.value.user.status = data.status || "";
    formValue.value.user.jenjangAjar = data.teachLevel || "";
    formValue.value.user.pelajaran = data.subjects || "";

    if (data.photo) {
      photoUrl.value = `http://localhost:3000/public${data.photo}`;
    } else {
      photoUrl.value = TutorDefault;
    }

    let daysArr = [];
    if (data.days) {
      try {
        daysArr = JSON.parse(data.days);
      } catch {
        daysArr = [];
      }
    }
    selectedDays.value = daysArr;
    formValue.value.user.days = daysArr;
  } catch (err) {
    message.error("Gagal mengambil data tutor.");
  }
});

const optionsgender = [
  { label: "Laki-laki", value: "laki" },
  { label: "Perempuan", value: "perempuan" }
];
const optionsStatus = [
  { label: "Semester 1-2", value: "tahun1" },
  { label: "Semester 3-4", value: "tahun2" },
  { label: "Semester 5-6", value: "tahun3" },
  { label: "Semester 7-8", value: "tahun4" },
  { label: "Semester 8<", value: "tahunakhir" },
  { label: "Sarjana S1", value: "S1" },
  { label: "Sarjana S2", value: "S2" },
  { label: "Sarjana S3", value: "S3" },
];

const rules = {
  user: {
    name: {
      required: true,
      message: "Wajib memasukkan nama tutor",
      trigger: "blur"
    },  
    gender: {
      required: true,
      message: "Wajib memasukkan jenis kelamin tutor",
      trigger: "blur"
    },
    email: {
      required: true,
      message: "Wajib memasukkan email tutor",
      trigger: "blur"
    },
    wa: {
      required: true,
      message: "Wajib memasukkan nomor WhatsApp tutor",
      trigger: "blur"
    },
    univ: {
      required: true,
      message: "Wajib memasukkan asal universitas tutor",
      trigger: "blur"
    },
    prodi: {
      required: true,
      message: "Wajib memasukkan asal program studi tutor",
      trigger: "blur"
    },
    status: {
      required: true,
      message: "Pilih status pendidikan tutor",
      trigger: ["blur", "change"]
    },
    pelajaran: {
      required: true,
      message: "Wajib memasukkan mata pelajaran yang akan diajar tutor",
      trigger: "blur"
    },
    jenjangAjar: {
      required: true,
      message: "Pilih jenjang ajar pendidikan tutor",
      trigger: ["blur", "change"]
    },
    days: {
      required: true,
      validator: () => selectedDays.value.length > 0,
      message: "Pilih minimal 1 hari aktif",
      trigger: "change"
    }
  }
};

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
const selectedDays = ref([])

async function handleReject() {
  const id = route.params.id;
  const token = localStorage.getItem("token");
  if (!id) return;
  try {
    const res = await fetch(`http://localhost:3000/apply/reject/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal menolak lamaran.");
    }
    message.success("Lamaran berhasil ditolak.");
    router.push("/dashboardadmin/tutor"); 
  } catch (err) {
    message.error(err.message || "Terjadi kesalahan.");
  }
}

async function handleVerify() {
  const id = route.params.id;
  const token = localStorage.getItem("token");
  if (!id) return;
  isLoading.value = true;
  try {
    const res = await fetch(`http://localhost:3000/apply/verify/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Gagal verifikasi tutor.");
    }
    message.success("Akun tutor berhasil diverifikasi.");
    router.push("/dashboardadmin/tutor/verifikasisukses"); // arahkan ke halaman /verifikasi
  } catch (err) {
    message.error(err.message || "Terjadi kesalahan.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 20px;
  overflow-y: auto;
}
.form-card {
  border-radius: 16px;
  background-color: #fff;
  padding: 1rem;
  height: fit-content;
}
.headerb1 {
  color: #154484;
}
.headersb3 {
  color: #154484;
  margin-bottom: 1rem;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.form {
  display: flex;
  flex-direction: column;
}
.grid-form {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  width: 100%;
}
.col-span-1 {
  grid-column: span 1;
}
.col-span-2 {
  grid-column: span 2;
}
.col-span-3 {
  grid-column: span 3;
}
.col-span-4 {
  grid-column: span 4;
}
.col-span-5 {
  grid-column: span 5;
}
.col-span-6 {
  grid-column: span 6;
}
.n-input, .n-date-picker {
  width: 100%;
  border-radius: 8px;
}
::v-deep(.n-base-selection) {
  border-radius: 8px !important;
}
.days {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.day-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #154484;
  border-radius: 20px;
  background-color: white;
  color: #154484;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-button.active,
.day-button:hover {
  background-color: #154484;
  color: white;
}

.bodyr3{
  color: #061222;
  margin-top: 0.5rem;
}
.profile-photo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.profile-photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #154484;
}
.action-row {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1.5rem;
}
</style>

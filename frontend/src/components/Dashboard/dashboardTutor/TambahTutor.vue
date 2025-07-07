<template>
  <div class="form-container">
    <div class="form-card">
      <h1 class="headerb1">Tambah Akun Tutor</h1>
      <n-divider class="divider" />
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
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="Tanggal Lahir" path="user.ttg" class="col-span-2">
            <n-date-picker v-model:value="formValue.user.ttg" type="date" />
          </n-form-item>
          <n-form-item label="Jenis Kelamin" path="user.gender" class="col-span-2">
            <n-select
              v-model:value="formValue.user.gender"
              :options="optionsgender"
              placeholder="Pilih jenis kelamin"
            />
          </n-form-item>
          <n-form-item label="Foto Diri" path="user.photo" class="col-span-2">
            <div class="form-group third-width">
              <n-upload
                :show-file-list="false"
                :custom-request="handleCustomUpload"
              >
                <n-button>Upload Foto</n-button>
              </n-upload>
              <p class="bodyr3" v-if="formValue.user.photo">File dipilih: {{ formValue.user.photo.name }}</p>
            </div>
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="E-mail Tutor" path="user.email" class="col-span-3">
            <n-input
              v-model:value="formValue.user.email"
              placeholder="Tuliskan email tutor disini"
            />
          </n-form-item>
          <n-form-item label="No. WhatsApp" path="user.wa" class="col-span-3">
            <n-input
              v-model:value="formValue.user.wa"
              placeholder="Tuliskan No. WhatsApp tutor disini"
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="Password Tutor" path="user.pass" class="col-span-6">
            <n-input
              v-model:value="formValue.user.pass"
              placeholder="Tuliskan password tutor disini"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item>
        </div>
        <n-divider class="divider" />
        <h2 class="headersb3">Pendidikan</h2>
        <div class="grid-form">
          <n-form-item label="Asal Universitas" path="user.univ" class="col-span-6">
            <n-input
              v-model:value="formValue.user.univ"
              placeholder="Tuliskan asal universitas tutor disini"
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="Program Studi" path="user.prodi" class="col-span-4">
            <n-input
              v-model:value="formValue.user.prodi"
              placeholder="Tuliskan program studi tutor disini"
            />
          </n-form-item>
          <n-form-item label="Status" path="user.status" class="col-span-2">
            <n-select
              v-model:value="formValue.user.status"
              :options="optionsStatus"
              placeholder="Pilih status"
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
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="Mata Pelajaran" path="user.pelajaran" class="col-span-6">
            <n-input
              v-model:value="formValue.user.pelajaran"
              placeholder="Matematika, Bahasa Inggris, Fisika, dll."
            />
          </n-form-item>
          <n-form-item label="Hari Aktif Mengajar" path="user.days" class="col-span-6">
              <div class="hari-mengajar">
                <div class="days">
                  <button
                    v-for="(day, index) in days"
                    :key="index"
                    :class="['day-button', { active: selectedDays.includes(day) }]"
                    @click="toggleDay(day)"
                  >
                    {{ day }}
                  </button>
                </div>
              </div>
          </n-form-item>
        </div>
      </n-form>

      <butPrimerNormal
        @click="handleValidateClick"
        label="Simpan Akun Tutor"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMessage, NFormItem, NInput } from "naive-ui";
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";

const formRef = ref(null);
const message = useMessage();
const size = ref("medium");

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
    days:[],
  }
});

const optionsgender = [
  { label: "Laki-laki", value: "Male" },
  { label: "Perempuan", value: "Female" }
];
const optionsStatus = [
  { label: "Semester 1-2", value: "TH1" },
  { label: "Semester 3-4", value: "TH2" },
  { label: "Semester 5-6", value: "TH3" },
  { label: "Semester 7-8", value: "TH4" },
  { label: "Semester 8", value: "TH5" },
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
    pass: {
      required: true,
      message: "Wajib memasukkan password tutor",
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

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      handleSubmit();
      message.success("Valid");
    } else {
      console.log(errors);
      message.error("Invalid");
    }
  });
}

async function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error("Form tidak valid!");
      return;
    }

    try {
      const payload = new FormData();
      const user = formValue.value.user;

      if (user.name) payload.append("name", user.name);
      if (user.ttg) payload.append("birthDate", new Date(user.ttg).toISOString());
      if (user.gender) payload.append("gender", user.gender);
      if (user.email) payload.append("email", user.email);
      if (user.wa) payload.append("phone", user.wa);
      if (user.pass) payload.append("password", user.pass);
      if (user.univ) payload.append("school", user.univ);
      if (user.prodi) payload.append("major", user.prodi);
      if (user.status) payload.append("status", user.status);
      if (user.jenjangAjar) payload.append("teachLevel", user.jenjangAjar);
      if (user.pelajaran) payload.append("subjects", user.pelajaran);
      if (user.days && user.days.length > 0) payload.append("days", JSON.stringify(user.days));
      if (user.photo) payload.append("photo", user.photo);
      payload.append("role", "tutor");

      const token = localStorage.getItem('token');

      const res = await fetch("http://localhost:3000/auth/add-user", {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        if (err && err.message === "Email already exists") {
          message.error("Email sudah terdaftar. Silakan gunakan email lain.");
          return;
        }
        throw new Error(err.message || "Gagal menambah tutor.");
      }

      message.success("Tutor berhasil ditambahkan!");
    } catch (err) {
      message.error(err.message || "Terjadi kesalahan.");
    }
  });
}

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
const selectedDays = ref([])

function handleCustomUpload({ file }) {
  formValue.value.user.photo = file.file;
}

function toggleDay(day) {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
  } else {
    selectedDays.value.push(day)
  }
  formValue.value.user.days = [...selectedDays.value];
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
</style>

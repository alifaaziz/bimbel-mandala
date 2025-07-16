<template>
  <div class="form-container">
    <div class="form-card">
      <h1 class="headerb1">Edit Akun Siswa</h1>
      <n-divider class="divider" />
      <n-form
        ref="formRef"
        class="form"
        inline
        :model="formValue"
        :rules="rules"
        :size="size"
      >
        <div class="grid-form">
          <n-form-item label="Nama Lengkap" path="user.name" class="col-span-3">
            <n-input
              type="text"
              v-model:value="formValue.user.name"
              placeholder="Tuliskan nama siswa disini"
            />
          </n-form-item>
          <n-form-item label="Jenjang" path="user.jenjang" class="col-span-1">
            <n-select
              v-model:value="formValue.user.jenjang"
              :options="optionsjenjang"
              placeholder="Pilih jenjang pendidikan"
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="No. WhatsApp Siswa" path="user.wa" class="col-span-2">
           <n-input-group-label style="border-radius: 8px 0 0 8px;">+62</n-input-group-label>
           <n-input
              v-model:value="formValue.user.wa"
              placeholder="Tuliskan no. WhatsApp siswa disini"
              type="tel"
              style="border-radius: 0 8px 8px 0;"
            />
          </n-form-item> 
          <n-form-item label="No. Telp Wali Siswa" path="user.wali" class="col-span-2">
           <n-input-group-label style="border-radius: 8px 0 0 8px;">+62</n-input-group-label>
           <n-input
              v-model:value="formValue.user.wali"
              placeholder="Tuliskan no. telp wali siswa disini"
              type="tel"
              style="border-radius: 0 8px 8px 0;"
           />
          </n-form-item> 
        </div>
        <div class="grid-form">
          <n-form-item label="Alamat Siswa" path="user.alamat" class="col-span-4">
            <n-input
              type="text"
              v-model:value="formValue.user.alamat"
              placeholder="Tuliskan alamat siswa disini"
            />
          </n-form-item>
        </div>
      </n-form>
      <div class="confirmation-buttons">
        <butPrimerNormal
          @click="handleValidateClick"
          label="Simpan Perubahan"
        />
        <butSecondNormal
          label="Batal"
          @click="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from "naive-ui";
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";

const formRef = ref(null);
const message = useMessage();
const size = ref("medium");
const router = useRouter()
const route = useRoute();
const userId = route.params.id;

function goBack() {
  router.back()
}

const formValue = ref({
  user: {
    name: "",
    jenjang: "",
    wa: "",
    wali: "",
    alamat: ""
  }
});

const optionsjenjang = [
  { label: "SD", value: "sd" },
  { label: "SMP", value: "smp" },
  { label: "SMA", value: "sma" }
];

async function submitEditProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    message.error("Token tidak ditemukan, silakan login ulang.");
    return;
  }
  if (!userId) {
    message.error("ID siswa tidak ditemukan.");
    return;
  }

  const user = formValue.value.user;
  const payload = {};
  if (user.name) payload.name = user.name;
  if (user.jenjang) payload.level = user.jenjang.toUpperCase();
  if (user.alamat) payload.address = user.alamat;
  if (user.wa) payload.phone = user.wa;
  if (user.wali) payload.parentPhone = user.wali;
  payload.role = "siswa"; 

  try {
    const res = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      message.success("Profil siswa berhasil diupdate!");
      router.push(`/dashboardadmin/siswa/${userId}`);
    } else {
      message.error(data.message || "Gagal update profil siswa.");
    }
  } catch (err) {
    message.error("Terjadi kesalahan jaringan.");
  }
}

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      submitEditProfile();
    } else {
      message.error("Data belum lengkap/valid.");
    }
  });
}
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 20px;
  overflow-y: auto;
}
.form-card {
  border-radius: 12px;
  background-color: #fff;
  padding: 1rem;
  overflow-y: auto;
  height: 100vh;
}
.headerb1 {
  color: #154484;
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
  grid-template-columns: repeat(4, 1fr);
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
.n-input {
  width: 100%;
  border-radius: 8px;
}
::v-deep(.n-base-selection) {
  border-radius: 8px !important;
}
.confirmation-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}
</style>

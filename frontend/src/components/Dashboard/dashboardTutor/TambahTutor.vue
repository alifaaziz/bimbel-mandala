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
            <n-input
              readonly
              placeholder="Masukkan foto tutor"
              v-model:value="photoName"
              @click="triggerFileInput"
              class="custom-upload-input"
            >
              <template #suffix>
                <n-icon>
                  <i class="fas fa-folder"></i> <!-- Gunakan ikon folder -->
                </n-icon>
              </template>
            </n-input>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileChange"
            />
          </n-form-item>
          <n-form-item label="Tanggal Lahir" path="user.ttg" class="col-span-2">
            <n-date-picker v-model:value="formValue.user.ttg" type="date" />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="E-mail Tutor" path="user.email" class="col-span-4">
            <n-input
              v-model:value="formValue.user.email"
              placeholder="Tuliskan email tutor disini"
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="Password Tutor" path="user.pass" class="col-span-4">
            <n-input
              v-model:value="formValue.user.pass"
              placeholder="Tuliskan password tutor disini"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="No. WhatsApp Tutor" path="user.wa" class="col-span-2">
           <n-input
              v-model:value="formValue.user.wa"
              placeholder="Tuliskan no. WhatsApp tutor disini"
              type="tel"
            />
          </n-form-item> 
          <n-form-item label="No. Telp Wali Tutor" path="user.wali" class="col-span-2">
           <n-input
              v-model:value="formValue.user.wali"
              placeholder="Tuliskan no. telp wali tutor disini"
              type="tel"
            />
          </n-form-item> 
        </div>
        <div class="grid-form">
          <n-form-item label="Alamat Tutor" path="user.alamat" class="col-span-4">
            <n-input
              v-model:value="formValue.user.alamat"
              placeholder="Tuliskan alamat tutor disini"
            />
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
import { useMessage, NFormItem, NInput, NIcon } from "naive-ui";
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    photoName.value = file.name
    photoFile.value = file
  }
}

const fileInput = ref(null)
const photoName = ref('')
const photoFile = ref(null)
const formRef = ref(null);
const message = useMessage();
const size = ref("medium");

const formValue = ref({
  user: {
    name: "",
    jenjang: "",
    email: "",
    pass: "",
    wa: "",
    wali: "",
    alamat: ""

  }
});

const optionsgender = [
  { label: "Laki-laki", value: "laki" },
  { label: "Perempuan", value: "perempuan" }
];

const rules = {
  user: {
    name: {
      required: true,
      message: "Wajib memasukkan nama tutor",
      trigger: "blur"
    },
    email: {
      required: true,
      message: "Wajib memasukkan email tutor",
      trigger: "blur"
    },
    pass: {
      required: true,
      message: "Wajib memasukkan password tutor",
      trigger: "blur"
    },
    jenjang: {
      required: true,
      message: "Pilih jenjang pendidikan tutor",
      trigger: ["blur", "change"]
    },
  }
};

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success("Valid");
      alert("Data yang dimasukkan:\n" + JSON.stringify(formValue.value, null, 2));
    } else {
      console.log(errors);
      message.error("Invalid");
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
  border-radius: 16px;
  background-color: #fff;
  padding: 1rem;
  overflow-y: auto;
  height: 100vh;
}
.headerb1 {
  color: #154484;
}
.headersb3 {
  color: #154484;
  margin-bottom: 0.5rem;
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
</style>

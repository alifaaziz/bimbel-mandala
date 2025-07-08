<script setup>
import { ref } from "vue";
import { useMessage, NFormItem, NInput } from "naive-ui";
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null);
const message = useMessage();
const size = ref("medium");

// GANTI DATA TUTOR SEBELUM EDIT
const formValue = ref({
  user: {
    name: "",
    email: "",
    wa: "",
    alamat: "",
    pass: "",
    univ: "",
    prodi: "",
    status: "",
    jenjangAjar: "",
    pelajaran: "",
    days:[],
  }
});

function handleBackClick() {
  router.back()
}

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

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      const dataToShow = {
        ...formValue.value,
        user: {
          ...formValue.value.user,
          photo: formValue.value.user.photo?.name || null
        }
      };
      alert("Data yang dimasukkan:\n" + JSON.stringify(dataToShow, null, 2));
      message.success("Valid");
    } else {
      console.log(errors);
      message.error("Invalid");
    }
  });
}

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
const selectedDays = ref([])

function toggleDay(day) {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
  } else {
    selectedDays.value.push(day)
  }
  formValue.value.user.days = [...selectedDays.value];
}

</script>


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
          <n-form-item label="Nama Lengkap" path="user.name" class="col-span-4">
            <n-input
              v-model:value="formValue.user.name"
              placeholder="Tuliskan nama tutor disini"
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
        <div class="grid-form">
          <n-form-item label="No. WhatsApp" path="user.wa" class="col-span-6">
            <n-input
              v-model:value="formValue.user.wa"
              placeholder="Tuliskan No. WhatsApp tutor disini"
            />
          </n-form-item>
        </div>
        <div class="grid-form">
          <n-form-item label="Alamat" path="user.alamat" class="col-span-6">
            <n-input
              v-model:value="formValue.user.alamat"
              placeholder="Tuliskan alamat tutor disini"
            />
          </n-form-item>
        </div>
        <n-divider class="divider" />
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
      <div class="button">
        <butPrimerNormal
          @click="handleValidateClick"
          label="Simpan Akun Tutor"
        />
        <butSecondNormal
          @click="handleBackClick"
          label="Batal Edit"
        />
      </div>
    </div>
  </div>
</template>

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

.button{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>

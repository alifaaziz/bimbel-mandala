<template>
  <div class="add-container">
    <div class="add-contents">
      <n-card :bordered="false" size="huge" style="width: 100%; border-radius: 16px; margin: auto;">
          <div class="headersb1">Tambah Program</div>
        <n-divider class="divider" />
        <n-space vertical size="large">
          
          <n-form ref="formRef" :model="formValue">
            <n-space vertical size="large">
    
              <n-h2 style="font-weight: 600;">Detail Program</n-h2>
              
              <n-form-item label="Nama Program" path="namaProgram">
                <n-input v-model:value="formValue.namaProgram" placeholder="Tuliskan nama program" />
              </n-form-item>
    
              <n-form-item label="Area/lokasi" path="area">
                <n-input v-model:value="formValue.area" placeholder="Semarang" />
              </n-form-item>
    
              <n-grid :x-gap="24" :y-gap="0" :cols="3">
                <n-gi>
                  <n-form-item label="Tutor" path="tutor">
                    <n-select v-model:value="formValue.tutor" :options="tutorOptions" placeholder="Please Select"/>
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="Jenjang" path="jenjang">
                    <n-select v-model:value="formValue.jenjang" :options="jenjangOptions" placeholder="Please Select"/>
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="Tipe" path="tipe">
                    <n-select v-model:value="formValue.tipe" :options="tipeOptions" placeholder="Please Select"/>
                  </n-form-item>
                </n-gi>
              </n-grid>
    
              <n-grid :x-gap="24" :y-gap="0" :cols="2">
                <n-gi>
                  <n-form-item label="JAM" path="jam">
                    <n-time-picker
                      v-model:value="formValue.jam"
                      style="width: 100%;"
                      format="HH:mm"
                      placeholder="Select Time"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="Durasi per sesi" path="durasi">
                    <n-select v-model:value="formValue.durasi" :options="durasiOptions" placeholder="Please Select" />
                  </n-form-item>
                </n-gi>
              </n-grid>
              
              <n-grid :x-gap="24" :y-gap="0" :cols="7" style="align-items: center;">
                <n-gi :span="2">
                  <n-form-item label="Jangka Waktu (Pertemuan)" path="jangkaWaktu">
                    <n-input-number v-model:value="formValue.jangkaWaktu" placeholder="8" style="width: 100%;" />
                  </n-form-item>
                </n-gi>
                <n-gi :span="5">
                  <div class="days">
                    <button
                      v-for="(day, index) in daysOptions"
                      :key="index"
                      :class="['day-button', { active: daysValue.includes(day) }]"
                      type="button"
                      @click="toggleDay(day)"
                    >
                      {{ day }}
                    </button>
                  </div>
                </n-gi>
              </n-grid>
    
              <div v-if="formValue.tipe === 'Privat/Kelompok'">
                <n-divider class="divider" />
                <n-space vertical size="large">
                  <n-h2 style="font-weight: 600;">Biaya</n-h2>
                  <n-grid :x-gap="24" :y-gap="20" :cols="2">
                    <n-gi>
                      <n-form-item label="Privat">
                        <n-input-number v-model:value="formValue.biaya.privat" placeholder="Please Input" style="width: 100%;">
                          <template #prefix>Rp.</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Kelompok 2 siswa">
                        <n-input-number v-model:value="formValue.biaya.kelompok2" placeholder="Please Input" style="width: 100%;">
                          <template #prefix>Rp.</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Kelompok 3 siswa">
                        <n-input-number v-model:value="formValue.biaya.kelompok3" placeholder="Please Input" style="width: 100%;">
                          <template #prefix>Rp.</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Kelompok 4 siswa">
                        <n-input-number v-model:value="formValue.biaya.kelompok4" placeholder="Please Input" style="width: 100%;">
                          <template #prefix>Rp.</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Kelompok 5 siswa">
                        <n-input-number v-model:value="formValue.biaya.kelompok5" placeholder="Please Input" style="width: 100%;">
                          <template #prefix>Rp.</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Diskon">
                        <n-input-number v-model:value="formValue.diskon" placeholder="Please Input" style="width: 100%;">
                           <template #suffix">%</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                  </n-grid>
                </n-space>
              </div>
              
              <div v-else-if="formValue.tipe === 'Kelas'">
                <n-divider class="divider" />
                <n-space vertical size="large">
                  <n-h2 style="font-weight: 600;">Detail Kelas</n-h2>
                  <n-grid :x-gap="24" :y-gap="20" :cols="2">
                    <n-gi>
                      <n-form-item label="Maksimal Siswa">
                        <n-input-number v-model:value="formValue.detailKelas.maksimalSiswa" placeholder="Please Input" style="width: 100%;" />
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Tanggal Mulai">
                        <n-date-picker v-model:value="formValue.detailKelas.tanggalMulai" type="date" style="width: 100%;" />
                      </n-form-item>
                    </n-gi>
                    <n-gi :span="2">
                      <n-form-item label="Per-anak">
                        <n-input-number v-model:value="formValue.detailKelas.perAnak" placeholder="Please Input" style="width: 100%;">
                          <template #prefix>Rp.</template>
                        </n-input-number>
                      </n-form-item>
                    </n-gi>
                  </n-grid>
                </n-space>
              </div>
    
            </n-space>
          </n-form>
          <n-divider class="divider" />
          
          <div class="catatan">
            <h3 class="bodysb1">Catatan:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              <li>Paket Privat/Kelompok: Biaya siswa mengacu pada paket privat. Biaya Kelompok otomatis dibuat menjadi 80% biaya siswa/anak paket diatasnya. Contoh biaya per anak paket kelompok 3 siswa adalah 80% biaya anak privat dan biaya siswa/anak paket kelompok 5 siswa adalah 80% biaya siswa/anak paket kelompok 3 siswa.</li>
              <li>Paket Kelas: Biaya siswa tipe program kelas disamaratakan tanpa melihat jumlah siswa.</li>
              <li>Honor Tutor merupakan 70% dari biaya total program.</li>
            </ul>
          </div>

          <n-divider class="divider" />
    
          <div class="button">
        <butPrimerNormal
          @click="handleValidateClick"
          :loading="loading"
          label="Buat Program"
        />
        <butSecondNormal
          @click="handleBackClick"
          label="Batal"
        />
      </div>
    
        </n-space>
      </n-card>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";
import { 
  NCard, NSpace, NForm, NFormItem, NInput, NSelect, NTimePicker, NInputNumber, 
  NGrid, NGi, NDivider, NH2, NDatePicker
} from 'naive-ui';

const formRef = ref(null);
const formValue = ref({
  namaProgram: null,
  area: 'Semarang',
  tutor: null,
  jenjang: null,
  tipe: null,
  jam: null,
  durasi: null,
  jangkaWaktu: null,
  biaya: { 
    privat: null,
    kelompok2: null,
    kelompok3: null,
    kelompok4: null,
    kelompok5: null,
  },
  diskon: null,
  detailKelas: { 
    maksimalSiswa: null,
    tanggalMulai: null,
    perAnak: null,
  }
});

const daysValue = ref([]);
const tutorOptions = ref([]);

async function fetchTutorOptions() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:3000/users/tutors/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    tutorOptions.value = (json.data || []).map(tutor => ({
      label: tutor.name,
      value: tutor.id
    }));
  } catch (err) {
    tutorOptions.value = [];
    console.error('Gagal fetch tutor:', err);
  }
}

onMounted(fetchTutorOptions);

const jenjangOptions = ref([
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA', value: 'SMA' },
]);

const tipeOptions = ref([
  { label: 'Privat/Kelompok', value: 'Privat/Kelompok' },
  { label: 'Kelas', value: 'Kelas' },
]);

const durasiOptions = ref([
  { label: '60 Menit', value: 60 },
  { label: '90 Menit', value: 90 },
  { label: '120 Menit', value: 120 },
]);

const daysOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

function toggleDay(day) {
  if (daysValue.value.includes(day)) {
    daysValue.value = daysValue.value.filter(d => d !== day);
  } else {
    daysValue.value.push(day);
  }
}

const router = useRouter();
const loading = ref(false);

async function handleValidateClick() {
  const token = localStorage.getItem('token');
  if (!token) return;

  loading.value = true; 

  const tipe = formValue.value.tipe;
  const payload = {
    name: formValue.value.namaProgram,
    level: formValue.value.jenjang,
    totalMeetings: formValue.value.jangkaWaktu,
    time: formValue.value.jam ? new Date(formValue.value.jam).toISOString() : null, 
    duration: formValue.value.durasi,
    area: formValue.value.area,
    tutorId: formValue.value.tutor,
    days: [...daysValue.value],
    discount: formValue.value.diskon || 0
  };

  try {
    if (tipe === 'Privat/Kelompok') {
      payload.groupType = [
        { type: 'privat', price: formValue.value.biaya.privat, maxStudent: 1 },
        { type: 'grup2', price: formValue.value.biaya.kelompok2, maxStudent: 2 },
        { type: 'grup3', price: formValue.value.biaya.kelompok3, maxStudent: 3 },
        { type: 'grup4', price: formValue.value.biaya.kelompok4, maxStudent: 4 },
        { type: 'grup5', price: formValue.value.biaya.kelompok5, maxStudent: 5 }
      ];
      await fetch('http://localhost:3000/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } else if (tipe === 'Kelas') {
      payload.price = formValue.value.detailKelas.perAnak;
      payload.maxStudent = formValue.value.detailKelas.maksimalSiswa;
      payload.startDate = formValue.value.detailKelas.tanggalMulai
        ? new Date(formValue.value.detailKelas.tanggalMulai).toISOString()
        : null;
      await fetch('http://localhost:3000/packages/class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    }
    router.push('/dashboardadmin/programadmin'); 
  } catch (err) {
    alert('Gagal membuat program');
    console.error(err);
  } finally {
    loading.value = false; 
  }
}
</script>

<style scoped>
.n-h2, .n-h3 {
  margin: 0;
}

.headersb1{
  color: #154484;
}
.add-container {
  width: 100%;
  padding: 20px;
  overflow-y: auto;
}
.add-contents{
  background-color: white;
  border-radius: 16px;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}

.button{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.catatan{
  color: #FB8312;
}

.days {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.day-button {
  border: 1.5px solid #154484;
  background: #fff;
  color: #154484;
  border-radius: 999px;
  padding: 6px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}
.day-button.active,
.day-button:hover {
  background: #eaf2fb;
  color: #154484;
  border-color: #154484;
  font-weight: 600;
}
</style>
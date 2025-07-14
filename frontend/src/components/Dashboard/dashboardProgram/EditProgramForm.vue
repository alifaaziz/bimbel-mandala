<template>
  <div class="form-container">
    <n-card class="form-card" content-style="padding: 24px;">
        <h1 class="headerb1">Edit Program</h1>
        <n-divider class="divider" />
      

      <n-form ref="formRef" :model="formModel">
        <h2 class="section-title">Detail Program</h2>
        
        <n-grid :cols="1" :y-gap="12">
          <n-form-item-gi label="Nama Program" path="programName">
            <n-input v-model:value="formModel.programName" placeholder="Tuliskan nama program" />
          </n-form-item-gi>
        </n-grid>

        <n-grid :cols="3" :x-gap="24" :y-gap="12" responsive="screen" item-responsive>
          <n-form-item-gi label="Tutor" path="tutorId">
            <n-select v-model:value="formModel.tutorId" :options="tutorOptions" />
          </n-form-item-gi>

          <n-form-item-gi label="Jenjang" path="level">
            <n-select v-model:value="formModel.level" :options="levelOptions" />
          </n-form-item-gi>

          <!-- Pilihan Tipe -->
          <n-form-item-gi label="Tipe" path="type">
            <n-select v-model:value="formModel.type" :options="typeOptions" :disabled="true" />
          </n-form-item-gi>
        </n-grid>
        
        <n-grid :cols="2" :x-gap="24" :y-gap="12" responsive="screen" item-responsive>
          <n-form-item-gi label="JAM" path="startTime">
            <n-time-picker
              v-model:value="formModel.startTime"
              style="width: 100%;"
              :use-seconds="false"
              format="HH:mm"
              placeholder="Pilih Jam"
            />
          </n-form-item-gi>
          
          <n-form-item-gi label="Durasi per sesi" path="duration">
            <n-input-number v-model:value="formModel.duration" :show-button="false" style="width: 100%;">
              <template #suffix>Menit</template>
            </n-input-number>
          </n-form-item-gi>
        </n-grid>
        <n-grid :cols="1" :y-gap="12">
          <n-form-item-gi label="Hari Aktif Mengajar" path="days" class="col-span-6">
            <div class="hari-mengajar">
              <div class="days">
                <button
                  v-for="(day, index) in daysOptions"
                  :key="index"
                  :class="['day-button', { active: formModel.days.includes(day) }]"
                  type="button"
                  @click="toggleDay(day)"
                >
                  {{ day }}
                </button>
              </div>
            </div>
          </n-form-item-gi>
        </n-grid>

        <!-- Komponen Biaya hanya untuk Privat/Kelompok -->
        <template v-if="isPrivateGroup">
          <n-divider class="divider" />
          <h2 class="section-title">Biaya</h2>
          <n-grid :x-gap="24" :y-gap="12" :cols="2" responsive="screen" item-responsive>
            <n-form-item-gi label="Privat" path="costs.private">
              <n-input-number v-model:value="formModel.costs.private" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
                <template #prefix>Rp</template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi label="Kelompok 2 siswa" path="costs.group2">
              <n-input-number v-model:value="formModel.costs.group2" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
                <template #prefix>Rp</template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi label="Kelompok 3 siswa" path="costs.group3">
              <n-input-number v-model:value="formModel.costs.group3" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
                <template #prefix>Rp</template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi label="Kelompok 4 siswa" path="costs.group4">
              <n-input-number v-model:value="formModel.costs.group4" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
                <template #prefix>Rp</template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi label="Kelompok 5 siswa" path="costs.group5">
              <n-input-number v-model:value="formModel.costs.group5" :formatter="formatCurrency" :parser="parseCurrency" style="width: 100%;">
                <template #prefix>Rp</template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi label="Diskon" path="discount">
              <n-input-number v-model:value="formModel.discount" :show-button="false" style="width: 100%;">
                <template #suffix>%</template>
              </n-input-number>
            </n-form-item-gi>
          </n-grid>
        </template>

        <!-- Komponen Detail Kelas hanya untuk Kelas -->
        <template v-if="isClass">
          <n-divider class="divider" />
          <h2 class="section-title">Detail Kelas</h2>
          <n-grid :x-gap="24" :y-gap="12" :cols="2" responsive="screen" item-responsive>
            <n-form-item-gi label="Maksimal Siswa" path="studentsLimit">
              <n-input v-model:value="formModel.studentsLimit" />
            </n-form-item-gi>
            <n-form-item-gi label="Tanggal Mulai" path="startDate">
              <n-date-picker
                v-model:value="formModel.startDate"
                type="date"
                style="width: 100%;"
                placeholder="Pilih tanggal mulai"
                format="dd/MM/yyyy"
                clearable
              />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="1" :y-gap="12">
            <n-form-item-gi label="Biaya Per-Anak" path="pricePerChild">
              <n-input v-model:value="formModel.pricePerChild" placeholder="Tuliskan Biaya Program Per-Anak" />
            </n-form-item-gi>
          </n-grid>
        </template>

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
          @click="handleApplyChanges"
          :loading="loading"
          label="Terapkan"
        />
        <butSecondNormal
          @click="handleCancelEdit"
          label="Batal Edit"
        />
      </div>

      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import butPrimerNormal from "@/components/dirButton/butPrimerNormal.vue";
import butSecondNormal from "@/components/dirButton/butSecondNormal.vue";
import { 
  NCard, NForm, NFormItemGi, NGrid, NInput, NSelect, NTimePicker, NInputNumber
} from 'naive-ui';

const message = useMessage();
const formRef = ref(null);
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const formModel = ref({
  programName: null,
  tutorId: null,
  level: null,
  type: null,
  startTime: null,
  duration: null,
  area: null,
  totalMeetings: null,
  days: [],
  costs: {
    private: null,
    group2: null,
    group3: null,
    group4: null,
    group5: null,
  },
  discount: null,
  startDate: null,
  studentsLimit: null,
  pricePerChild: null,
});

const tutorOptions = ref([]);
const levelOptions = [ { label: 'SD', value: 'SD' }, { label: 'SMP', value: 'SMP' }, { label: 'SMA', value: 'SMA' }, ];
const typeOptions = [ { label: 'Privat/Kelompok', value: 'private_group' }, { label: 'Kelas', value: 'class' }];

const daysOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];


const toggleDay = (day) => {
  const idx = formModel.value.days.indexOf(day);
  if (idx === -1) {
    formModel.value.days.push(day);
  } else {
    formModel.value.days.splice(idx, 1);
  }
};

const formatCurrency = (value) => {
  if (value === null) return '';
  return `${value.toLocaleString('id-ID')}`;
};
const parseCurrency = (input) => {
  const nums = input.replace(/[^0-9]/g, '');
  return nums ? Number(nums) : null;
};

const handleApplyChanges = async (e) => {
  e.preventDefault();
  loading.value = true;
  const slug = route.params.slug;
  const token = localStorage.getItem('token');
  if (!slug || !token) return;

  const payload = {
    name: formModel.value.programName,
    level: formModel.value.level,
    totalMeetings: formModel.value.totalMeetings,
    time: formModel.value.startTime ? new Date(formModel.value.startTime).toISOString() : null,
    duration: formModel.value.duration,
    area: formModel.value.area,
    tutorId: formModel.value.tutorId,
    days: [...formModel.value.days],
    discount: formModel.value.discount || 0
  };

  try {
    if (formModel.value.type === 'private_group') {
      payload.groupType = [
        { type: 'privat', price: formModel.value.costs.private },
        { type: 'grup2', price: formModel.value.costs.group2 },
        { type: 'grup3', price: formModel.value.costs.group3 },
        { type: 'grup4', price: formModel.value.costs.group4 },
        { type: 'grup5', price: formModel.value.costs.group5 }
      ];
      await fetch(`http://localhost:3000/packages/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } else if (formModel.value.type === 'class') {
      payload.price = formModel.value.pricePerChild;
      payload.maxStudent = formModel.value.studentsLimit;
      payload.startDate = formModel.value.startDate
        ? new Date(formModel.value.startDate).toISOString()
        : null;
      await fetch(`http://localhost:3000/packages/class/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    }
    message.success('Program berhasil diupdate');
    router.push('/dashboardadmin/programadmin');
  } catch (err) {
    alert('Gagal edit program');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCancelEdit = () => {
    message.warning('Perubahan dibatalkan');
    router.push('/dashboardadmin/programadmin');
}

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

async function fetchPackageData() {
  const slug = route.params.slug;
  const token = localStorage.getItem('token');
  if (!slug || !token) return;
  try {
    const res = await fetch(`http://localhost:3000/packages/${slug}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const pkg = data;
    formModel.value.programName = pkg.name || null;
    formModel.value.tutorId = pkg.tutorId || null;
    formModel.value.level = pkg.level || null;
    formModel.value.area = pkg.area || null;
    formModel.value.totalMeetings = pkg.totalMeetings || null;
    formModel.value.startTime = pkg.time ? new Date(pkg.time).getTime() : null;
    formModel.value.duration = pkg.duration || null;
    formModel.value.days = Array.isArray(pkg.days) ? pkg.days : [];
    formModel.value.discount = pkg.discount ? Number(pkg.discount) : null;
    formModel.value.startDate = pkg.startDate ? new Date(pkg.startDate).getTime() : null;

    if (pkg.groupType && Array.isArray(pkg.groupType)) {
      formModel.value.type = 'private_group';
      formModel.value.costs.private = Number(pkg.groupType.find(g => g.type === 'privat')?.price) || null;
      formModel.value.costs.group2 = Number(pkg.groupType.find(g => g.type === 'grup2')?.price) || null;
      formModel.value.costs.group3 = Number(pkg.groupType.find(g => g.type === 'grup3')?.price) || null;
      formModel.value.costs.group4 = Number(pkg.groupType.find(g => g.type === 'grup4')?.price) || null;
      formModel.value.costs.group5 = Number(pkg.groupType.find(g => g.type === 'grup5')?.price) || null;
    } else {
      formModel.value.type = 'class';
      formModel.value.studentsLimit = pkg.maxStudent || null;
      formModel.value.pricePerChild = pkg.price || null;
    }
  } catch (err) {
    console.error('Gagal fetch package:', err);
  }
}

onMounted(() => {
  fetchTutorOptions();
  fetchPackageData();
});

const isPrivateGroup = computed(() => formModel.value.type === 'private_group');
const isClass = computed(() => formModel.value.type === 'class');
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 24px;
  overflow-y: auto;
  background-color: #0B2343;
}
.bodysb2 {
  margin-top: 1rem;
}
.form-card {
  border-radius: 8px;
  background-color: #fff;
  height: fit-content;
  border: 1px solid #dee2e6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.headerb1 {
  color: #154484;
}
.divider {
  border-top: 1px solid #FEEBD9 !important;
}
.section-title {
  color: #154484;
  margin-bottom: 1rem;
}
.n-divider {
  margin-top: 24px;
  margin-bottom: 24px;
}

.hari-mengajar {
  display: flex;
  flex-direction: column;
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

.catatan {
  color: #FB8312;
}

.button{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.bodysb1 {
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}
</style>
<script setup lang="ts">
import { ref, computed, onMounted, watch, defineComponent, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ButPrimerNormal from '../dirButton/butPrimerNormal.vue';

const route = useRoute();
const router = useRouter();
const slug = route.params.id as string;
const programData = ref<any>(null);
const isTutor = ref(false);
const options = ref<any[]>([]); // Opsi dropdown
const selectedOption = ref<string | null>(null); // Opsi yang dipilih
const address = ref(''); // Alamat lokasi bimbing
const isSubmitting = ref(false);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/packages/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Gagal mengambil data program');
    programData.value = await res.json();

    // Cek role user
    const userRes = await fetch('http://localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (userRes.ok) {
      const data = await userRes.json();
      isTutor.value = data.data?.role === 'tutor';
    }

    const availableGroupTypes = programData.value.groupType.map((group: any) => group.type);
    options.value = [
      { label: "Privat", value: "privat", disabled: !availableGroupTypes.includes("privat") },
      { label: "Kelompok 2 Siswa", value: "grup2", disabled: !availableGroupTypes.includes("grup2") },
      { label: "Kelompok 3 Siswa", value: "grup3", disabled: !availableGroupTypes.includes("grup3") },
      { label: "Kelompok 4 Siswa", value: "grup4", disabled: !availableGroupTypes.includes("grup4") },
      { label: "Kelompok 5 Siswa", value: "grup5", disabled: !availableGroupTypes.includes("grup5") },
      { label: "Kelas", value: "kelas", disabled: !availableGroupTypes.includes("kelas") },
    ];
  } catch (err) {
    programData.value = null;
    console.error('Error:', err);
  }
});

const totalBiaya = computed(() => {
  if (!selectedOption.value || !programData.value) return 'Rp0';

  const selectedGroup = programData.value.groupType.find(
    (group: any) => group.type === selectedOption.value
  );

  if (!selectedGroup) return 'Rp0';

  const price = Number(selectedGroup.discPrice || selectedGroup.price);
  return formatCurrency(price);
});

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

function getPriceRange(groupType: any[]): string {
  if (!groupType || groupType.length === 0) return '0';

  const kelasGroup = groupType.find(group => group.type === 'kelas');
  if (kelasGroup) {
    const price = Number(kelasGroup.discPrice || kelasGroup.price);
    return formatCurrency(price);
  }

  const prices = groupType.map(group => Number(group.discPrice || group.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return minPrice === maxPrice
    ? formatCurrency(minPrice)
    : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
}

async function handleConfirm() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Anda harus login terlebih dahulu.');
    router.push('/auth');
    isSubmitting.value = false;
    return;
  }

  if (!selectedOption.value || !address.value) {
    alert('Harap lengkapi semua data sebelum melanjutkan.');
    isSubmitting.value = false;
    return;
  }

  const selectedGroup = programData.value.groupType.find(
    (group: any) => group.type === selectedOption.value
  );

  if (!selectedGroup) {
    alert('Tipe grup yang dipilih tidak valid.');
    isSubmitting.value = false;
    return;
  }

  const payload = {
    packageId: programData.value.id,
    groupTypeId: selectedGroup.id,
    address: address.value,
  };

  try {
    const res = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal membuat pesanan.');
    }

    router.push({
      path: '/registerprogramsuccess',
      query: {
        program: programData.value.name,
        level: programData.value.level,
        groupType: options.value.find(opt => opt.value === selectedGroup.type)?.label || selectedGroup.type,
      },
    });
  } catch (err) {
    console.error('Error:', err);
    alert('Terjadi kesalahan saat membuat pesanan.');
  }
  finally {
    isSubmitting.value = false;
  }
}

function formatTime(isoString: string): string {
  if (!isoString) return '';
  const time = isoString.split('T')[1];
  const [hour, minute] = time.split(':');
  return `${hour}:${minute} WIB`;
}

function groupTypeLabel(groupTypeArr: any[]): string {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some(gt => gt.type && gt.type.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
}

const badgeClass = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'sd': return 'grade-sd';
    case 'smp': return 'grade-smp';
    case 'sma': return 'grade-sma';
    default: return '';
  }
};

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
// Data peserta (contoh, bisa diganti dengan data dinamis)

const hasKelasGroupType = computed(() => {
  return programData.value?.groupType?.some((group: any) => group.type === 'kelas');
});

watch(
  () => programData.value,
  (val) => {
    if (val && hasKelasGroupType.value && val.area) {
      address.value = val.area;
    }
  },
  { immediate: true }
);

const InfoRow = defineComponent({
  name: 'InfoRow',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('div', { style: { display: 'flex', gap: '12px' } }, [
        h('span', { style: { fontWeight: 'bold', width: '100px' } }, props.label),
        h('span', null, `: ${props.value}`),
      ]);
  },
});
</script>

<template>
  <div class="padding-components">
    <div class="container-detail" v-if="programData">
      <div>
        <img
          class="program-photo"
          :src="programData.photo ? `http://localhost:3000/public${programData.photo}` : '/tutor/Tutor_Default.png'"
          alt="Program Photo"
        />
      </div>
      <div>
        <div class="head-detail">
          <div>
            <div class="headersb1 head-program">{{ programData.name }}</div>
            <div class="bodym2">{{ programData.tutorName }}</div>
          </div>
          <div>
            <div
              class="headerb1"
              :class="badgeClass(programData.level)"
            >
              {{ programData.level }}
            </div>
          </div>
        </div>
        <div class="space-detail">
          <div>
            <n-space class="bodyr2">
              <n-tag
                v-for="(day, index) in allDays"
                :key="index"
                class="tag"
                :class="{ 'tag-unselected': !programData.days.includes(day) }"
              >
                {{ day }}
              </n-tag>
            </n-space>
          </div>
          <div>
            <n-space vertical size="medium" class="space-detail bodyr2">
              <InfoRow label="Area/Lokasi" :value="programData.area" />
              <InfoRow
                label="Mulai"
                :value="programData.startDate ? new Date(programData.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'"
                v-if="programData.groupType && programData.groupType.some(gt => gt.type && gt.type.toLowerCase().includes('kelas'))"
              />
              <InfoRow label="Pertemuan" :value="`${programData.totalMeetings} Pertemuan`" />
              <InfoRow label="Pukul" :value="formatTime(programData.time)" />
              <InfoRow label="Durasi" :value="`${programData.duration} Menit`" />
            </n-space>
          </div>
          <div>
            <p class="bodyb1 type-program">
              {{ groupTypeLabel(programData.groupType) }}
            </p>
            <p v-if="!isTutor" class="bodyb1 price">
              {{ getPriceRange(programData.groupType) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="form-pemesanan">
      <h3 class="headerb2">
        Lengkapi Data
      </h3>
      <div class="input-pemesanan">
        <p class="bodym2">Lokasi Bimbingan Belajar</p>
        <n-input
          round
          v-model:value="address"
          placeholder="Alamat Lokasi Bimbing"
          class="input-custom mb-2 bodyr2"
          :disabled="hasKelasGroupType"
        />
      </div>
      <div class="input-pemesanan">
        <p class="bodym2">Peserta</p>
        <n-space vertical>
          <n-select 
            round 
            v-model:value="selectedOption" 
            :options="options"
            class="select-rounded"
          />
        </n-space>
      </div>
      <div class="input-pemesanan">
        <p class="bodym2">Total Biaya</p>
        <p>
          <span class="bodyb2 price">
            {{ totalBiaya }}
          </span>
        </p>
      </div>
      <n-divider class="divider" />
      <div class="form-pemesanan">
        <h3 class="headerb2">
          Pembayaran
        </h3>
        <div class="metode-pembayaran bodym3">
          <p>List Rakening</p>
          <p>Transfer</p>
        </div>
        <div class="bank-pembayaran">
          <img
            style="max-width: 60px;"
            src="@/assets/bank/bca.svg"
            alt="BCA Logo"
          />
          <p class=" bodyr2 no-rek">
            xxx-xxx-xxx
          </p>
        </div>
        <div class="bank-pembayaran">
          <img
             style="max-width: 60px;"
            src="@/assets/bank/bni.svg"
            alt="BNI Logo"
          />
          <p class=" bodyr2 no-rek">
            xxx-xxx-xxx
          </p>
        </div>
        <div class="bank-pembayaran">
          <img
            style="max-width: 60px;"
            src="@/assets/bank/mandiri.svg"
            alt="Mandiri Logo"
          />
          <p class=" bodyr2 no-rek">
            xxx-xxx-xxx
          </p>
        </div>
      </div>
      <ButPrimerNormal 
        label="Konfirmasi" 
        class="but-konfirmasi" 
        @click="handleConfirm"
        :disabled="isSubmitting"
      />
    </div>
  </div>
</template>

<style scoped>
.container-detail {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4rem;
  width: 100%;
  max-width: 1440px;
  margin: 2rem auto;
  height: auto;
}

.program-photo {
  width: 541px;
  height: auto;
  max-height: 496px;
  object-fit: cover;
  border-radius: 20px;
}

.head-detail {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.head-program {
  color: #154484;
  width: 100%;
  max-width: 320px;
}

.space-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tag {
  background-color: #154484;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  transition: background 0.2s, color 0.2s;
}

.tag-unselected {
  background-color: #e0e0e0;
  color: #888;
}

.type-program {
  color: #FB8312;
}

.price {
  color: #154484;
}

.submit-button {
  font-family: 'Poppins', sans-serif;
  background-color: #154484 !important;
  color: white;
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.submit-button:hover {
  background-color: #123a6d;
}

.head-detail .bodym2, .space-detail, .no-rek {
  color: #061222;
}

.form-pemesanan {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-custom {
  text-align: left;
}

.input-pemesanan {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #061222;
}

::v-deep(.select-rounded .n-base-selection) {
  border-radius: 2rem !important;
}

.divider {
  border-top: 1px solid #FEEBD9 !important;
}

.metode-pembayaran {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
}

.bank-pembayaran {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.bodym3 {
  color: #B1B5C3;
}

/* Breakpoint 1200px */
@media (max-width: 1200px) {
  .container-detail {
    padding: 0 4rem;
  }

  .program-photo {
    width: 100%;
    max-height: 400px;
  }
}

.but-konfirmasi {
  margin-top: 2rem;
}

/* Breakpoint 960px */
@media (max-width: 960px) {
  .container-detail {
    flex-direction: column;
    padding: 0 2rem;
  }

  .program-photo {
    width: 100%;
    height: auto;
    max-height: none;
  }

  .head-program {
    width: 100%;
  }
}

.headerb2 {
  color: #154484;
}

/* Breakpoint 576px */
@media (max-width: 576px) {
  .container-detail {
    padding: 0 1rem;
  }

  .submit-button {
    width: 100%;
    text-align: center;
  }
}
</style>

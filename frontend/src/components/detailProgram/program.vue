<script setup lang="ts">
import { defineComponent, h, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const programId = route.params.id as string;
const programData = ref<any>(null);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/packages/${programId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Gagal mengambil data program');
    programData.value = await res.json();
  } catch (err) {
    programData.value = null;
  }
});

function formatTime(isoString: string): string {
  if (!isoString) return '';
  const time = isoString.split('T')[1];
  const [hour, minute] = time.split(':');
  return `${hour}:${minute} WIB`;
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

interface InfoRowProps {
  label: string;
  value: string;
}

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
  setup(props: InfoRowProps) {
    return () =>
      h('div', { style: { display: 'flex', gap: '12px' } }, [
        h('span', { style: { fontWeight: 'bold', width: '100px' } }, props.label),
        h('span', null, `: ${props.value}`),
      ]);
  },
});

function submitToWhatsApp() {
  if (!programData.value) return;

  const message = `
    *Detail Program Bimbel Mandala*\n
    Berikut adalah detail program yang ingin dipesan:\n
    - *Nama Program*: ${programData.value.name}\n
    - *Tutor*: ${programData.value.tutorName}\n
    - *Jenjang*: ${programData.value.level}\n
    - *Hari*: ${programData.value.days.join(", ")}\n
    - *Pukul*: ${formatTime(programData.value.time)}\n
    - *Durasi*: ${programData.value.duration} Menit\n
    - *Area*: ${programData.value.area}\n
    - *Tipe Program*: ${programData.value.groupType.map((group: any) => group.type).join(" / ")}\n
    - *Harga*: ${formatCurrency(Number(programData.value.groupType[0].price))} - ${formatCurrency(Number(programData.value.groupType[programData.value.groupType.length - 1].price))}\n
    Mohon untuk segera memproses pesanan ini. Terima kasih.
  `;

  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = "6285855852485";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
}

function groupTypeLabel(groupTypeArr: any[]): string {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some(gt => gt.type && gt.type.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
}
</script>

<template>
  <div class="container-detail" v-if="programData">
    <div>
      <img
        class="program-photo"
        :src="programData.photo ? `http://localhost:3000${programData.photo}` : '/public/tutor/3.png'"
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
          <div class="headerb1 grade">
            {{ programData.level }}
          </div>
        </div>
      </div>
      <div class="space-detail">
        <n-space class="bodyr2">
          <n-tag class="tag" v-for="(day, index) in programData.days" :key="index">
            {{ day }}
          </n-tag>
        </n-space>
      </div>
      <div class="space-detail">
        <n-space vertical size="medium" class="space-detail bodyr2">
          <InfoRow label="Area" :value="programData.area" />
          <InfoRow label="Pertemuan" :value="`${programData.totalMeetings} Pertemuan`" />
          <InfoRow label="Pukul" :value="formatTime(programData.time)" />
          <InfoRow label="Durasi" :value="`${programData.duration} Menit`" />
        </n-space>
      </div>
      <div class="space-detail">
        <p class="bodyb1 type-program">
          {{ groupTypeLabel(programData.groupType) }}
        </p>
        <p class="bodyb1 price">
          {{ formatCurrency(Number(programData.groupType[0].price)) }} - 
          {{ formatCurrency(Number(programData.groupType[programData.groupType.length - 1].price)) }}
        </p>
      </div>
      <div class="space-detail">
        <n-button
          class="submit-button"
          type="primary"
          size="large"
          @click="submitToWhatsApp"
        >
          Pesan Program
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
  width: 100%;
  max-width: 1440px;
  padding: 0 8rem;
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
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.head-program {
  color: #154484;
  width: 100%;
  max-width: 320px;
}

.grade {
  background-color: darkgray;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  white-space: nowrap;
}

.space-detail {
  padding: 1rem 0;
}

.tag {
  background-color: #154484;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
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

.head-detail .bodym2, .space-detail {
  color: #061222;
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

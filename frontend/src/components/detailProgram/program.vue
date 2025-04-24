<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute
import { paketBimbel } from '@/assets/dataSementara/paketBimbel.js'; // Pastikan file ini sudah diubah menjadi JS

// Tangkap parameter id dari URL
const route = useRoute();
const programId = route.params.id;

// Cari data program berdasarkan id
const programData = ref(paketBimbel.find((program) => program.id === programId));

// Fungsi untuk memformat waktu
function formatTime(isoString: string): string {
  const time = isoString.split('T')[1]; // Ambil bagian waktu setelah 'T'
  const [hour, minute] = time.split(':');
  return `${hour}:${minute} WIB`;
}

// Fungsi untuk memformat angka ke dalam format Rupiah
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

  // Format pesan untuk WhatsApp
  const message = `
    *Detail Program Bimbel Mandala*\n\n
    Berikut adalah detail program yang ingin dipesan:\n
    - *Nama Program*: ${programData.value.name}\n
    - *Tutor*: ${programData.value.tutorName}\n
    - *Jenjang*: ${programData.value.level}\n
    - *Hari*: ${programData.value.days.join(", ")}\n
    - *Pukul*: ${formatTime(programData.value.time)}\n
    - *Durasi*: ${programData.value.duration} Menit\n
    - *Area*: ${programData.value.area}\n
    - *Tipe Program*: ${programData.value.groupType.map((group) => group.type).join(" / ")}\n
    - *Harga*: ${formatCurrency(Number(programData.value.groupType[0].price))} - ${formatCurrency(Number(programData.value.groupType[programData.value.groupType.length - 1].price))}\n\n
    Mohon untuk segera memproses pesanan ini. Terima kasih.
  `;

  // Encode pesan untuk URL
  const encodedMessage = encodeURIComponent(message);

  // Nomor WhatsApp tujuan (ganti dengan nomor yang sesuai)
  const whatsappNumber = "6285855852485";

  // Redirect ke WhatsApp
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
}
</script>

<template>
  <div class="container-detail" v-if="programData">
    <div>
      <img
        class="program-photo"
        :src="programData.photo || '/public/tutor/3.png'"
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
          <InfoRow
            label="Pertemuan"
            :value="`${programData.totalMeetings} Pertemuan`"
          />
          <InfoRow label="Pukul" :value="formatTime(programData.time)" />
          <InfoRow label="Durasi" :value="`${programData.duration} Menit`" />
        </n-space>
      </div>
      <div class="space-detail">
        <p class="bodyb1 type-program">
          {{ programData.groupType.map((group) => group.type).join(' / ') }}
        </p>
        <p class="bodyb1 price">
          {{ formatCurrency(Number(programData.groupType[0].price)) }} - {{ formatCurrency(Number(programData.groupType[programData.groupType.length - 1].price)) }}
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
    <!-- Tambahkan tombol submit -->
  </div>
</template>

<style setup>
.container-detail {
  display: flex;
  gap: 4rem;
  height: 496px;
  width: 1440px;
  padding: 0 8rem;
  margin: 2rem 0;
}
.program-photo {
  width: 541px;
  height: 496px;
  object-fit: cover;
  border-radius: 20px;
}

.head-detail {
  display: flex;
  gap: 11rem;
  margin-bottom: 1rem;
}
.head-program {
  color: #154484;
  width: 320px
}
.grade {
  background-color: darkgray;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
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

@media (max-width: 960px) {
  .container-detail {
    width: 100%;
  }
}
</style>
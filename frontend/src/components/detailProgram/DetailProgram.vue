<script setup lang="ts">
import { defineComponent, h, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import butPrimerNormal from '../dirButton/butPrimerNormal.vue';

const route = useRoute();
const router = useRouter();
const slug = route.params.id as string;
const programData = ref<any>(null);
const isTutor = ref(false);

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

  // Nomor WA admin
  const whatsappAdmin = "6285855852485";

  if (isTutor.value) {
    const message = `
*Detail Program*
- *Nama Program*: ${programData.value.name}
- *Tutor*: ${programData.value.tutorName}
- *Jenjang*: ${programData.value.level}
- *Hari*: ${programData.value.days.join(", ")}
- *Pukul*: ${formatTime(programData.value.time)}
- *Durasi*: ${programData.value.duration} Menit
- *Area*: ${programData.value.area}
- *Tipe Program*: ${programData.value.groupType.map((group: any) => group.type).join(" / ")}
`
    ;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappAdmin}?text=${encodedMessage}`, "_blank");
  } else {
    // Jika siswa, redirect ke halaman pemesanan
    router.push({ name: 'PemesananProgram', params: { id: programData.value._id } }); //Masih salah
  }
}

function groupTypeLabel(groupTypeArr: any[]): string {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some(gt => gt.type && gt.type.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
}

const badgeClass = (level: string) => {
  switch (level.toLowerCase()) {
    case 'sd':
      return 'grade-sd'
    case 'smp':
      return 'grade-smp'
    case 'sma':
      return 'grade-sma'
  }
}

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

</script>

<template>
  <div class="container-detail" v-if="programData">
    <div>
      <img
        class="program-photo"
        :src="programData.photo ? `http://localhost:3000/public${programData.photo}` : '/Tutor_Default.png'"
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
          <p 
            v-if="!isTutor && groupTypeLabel(programData.groupType) === 'Privat/Kelompok'" 
            class="bodyb1 price"
          >
            {{ formatCurrency(Number(programData.groupType[0].price)) }} - 
            {{ formatCurrency(Number(programData.groupType[programData.groupType.length - 1].price)) }}
          </p>
          <p 
            v-if="!isTutor && groupTypeLabel(programData.groupType) === 'Kelas'" 
            class="bodyb1 price"
          >
            {{ formatCurrency(Number(programData.groupType[0].price)) }}
          </p>
        </div>
        <div>
          <butPrimerNormal 
            :label="isTutor ? 'Hubungi Admin' : 'Pesan Program'"
            @click="submitToWhatsApp"
          />
        </div>
      </div>
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

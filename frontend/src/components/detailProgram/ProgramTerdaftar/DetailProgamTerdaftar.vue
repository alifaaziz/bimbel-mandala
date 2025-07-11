<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const slug = route.params.id as string; // Ambil slug dari route params
const programData = ref<any>(null);
const isTutor = ref(false);
const classCode = ref<string | null>(null); // Tambahkan state untuk Code Kelas

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');

    // Fetch program berdasarkan slug
    const res = await fetch(`http://localhost:3000/packages/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!res.ok) throw new Error('Gagal mengambil data program');
    programData.value = await res.json();

    // Fetch data kelas dari /classes/my
    const classesRes = await fetch('http://localhost:3000/classes/my', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (classesRes.ok) {
      const classesData = await classesRes.json();
      // Cari kelas yang sesuai dengan slug
      const matchedClass = classesData.data.find((cls: any) => cls.slug === slug);
      classCode.value = matchedClass ? matchedClass.code : null; // Simpan Code Kelas
    }

    // Cek role user
    const userRes = await fetch('http://localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      isTutor.value = userData.data?.role === 'tutor';
    }
  } catch (err) {
    console.error('Error:', err);
  }
});

function formatTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB';
}

function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = {
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  setup(props: InfoRowProps) {
    return () =>
      h('div', { style: { display: 'flex', gap: '12px' } }, [
        h('span', { style: { fontWeight: 'bold', width: '100px' } }, props.label),
        h('span', null, `: ${props.value}`),
      ]);
  },
};

const badgeClass = (level: string) => {
  switch (level.toLowerCase()) {
    case 'sd': return 'grade-sd';
    case 'smp': return 'grade-smp';
    case 'sma': return 'grade-sma';
    default: return '';
  }
};

const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
</script>

<template>
  <div class="container-detail" v-if="programData">
    <div>
      <img
        class="program-photo"
        :src="programData.photo ? `http://localhost:3000${programData.photo}` : '/tutor/Tutor_Default.png'"
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
            <InfoRow label="Area" :value="programData.area" />
            <InfoRow label="Pertemuan" :value="`${programData.totalMeetings} Pertemuan`" />
            <InfoRow label="Pukul" :value="formatTime(programData.time)" />
            <InfoRow label="Durasi" :value="`${programData.duration} Menit`" />
          </n-space>
        </div>
        <div>
          <p class="bodyb1 type-program">
            Code Kelas: {{ classCode || 'Tidak Tersedia' }}
          </p>
          <p v-if="!isTutor" class="bodym3 price">
            Silahkan gunakan kode kelas ini untuk bergabung ke kelas.
          </p>
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
  margin: 1rem auto;
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

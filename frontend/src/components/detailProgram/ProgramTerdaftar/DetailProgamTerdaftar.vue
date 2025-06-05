<script setup lang="ts">
import { defineComponent, h, ref, onMounted } from 'vue';

const programData = ref<any>(null);
const isTutor = ref(false);

onMounted(() => {
  programData.value = {
    photo: '',
    name: 'Program Matematika Dasar',
    tutorName: 'Budi Santoso',
    level: 'SMP',
    days: ['Senin', 'Rabu', 'Jumat'],
    area: 'Yogyakarta',
    totalMeetings: 12,
    time: '2024-06-01T15:00:00.000Z',
    duration: 90,
    groupType: [
      { type: 'Privat', price: 200000 },
      { type: 'Kelompok', price: 150000 }
    ]
  };

  isTutor.value = false;
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
});

function groupTypeLabel(groupTypeArr: any[]): string {
  if (!Array.isArray(groupTypeArr)) return '';
  return groupTypeArr.some(gt => gt.type?.toLowerCase().includes('kelas'))
    ? 'Kelas'
    : 'Privat/Kelompok';
}

const badgeClass = (level: string) => {
  switch (level.toLowerCase()) {
    case 'sd': return 'grade-sd';
    case 'smp': return 'grade-smp';
    case 'sma': return 'grade-sma';
    default: return '';
  }
}

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
            {{ groupTypeLabel(programData.groupType) }}
          </p>
          <p v-if="!isTutor" class="bodyb1 price">
            {{ formatCurrency(Number(programData.groupType[0].price)) }} - 
            {{ formatCurrency(Number(programData.groupType[programData.groupType.length - 1].price)) }}
          </p>
        </div>
        <div>
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

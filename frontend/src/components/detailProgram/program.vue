<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailProgram from './DetailProgram.vue';
import HonorTutor from './HonorTutor.vue';
import BiayaSiswa from './BiayaSiswa.vue';
import InfoProgram from './InfoProgram.vue';
import CaraPendaftaran from './CaraPendaftaran.vue';
import ProgramTerdaftar from './ProgramTerdaftar/ProgramTerdaftar.vue';

const route = useRoute();
const router = useRouter();
const slug = route.params.id as string; // Ambil slug dari route params
const programData = ref<any>(null);
const isTutor = ref(false);
const isRegisteredProgram = ref(false); // State untuk mengecek apakah program terdaftar

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`/packages/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Gagal mengambil data program');
    const program = await res.json();
    programData.value = program;

    if (program.status === 'aktif') {
      const hasKelas = Array.isArray(program.groupType) && program.groupType.some(gt => gt.type === 'kelas');
      if (!hasKelas) {
        return;
      }
    }

    const userRes = await fetch('localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (userRes.ok) {
      const data = await userRes.json();
      isTutor.value = data.data?.role === 'tutor';
    }

    const classesRes = await fetch('localhost:3000/classes/my', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (classesRes.ok) {
      const classesData = await classesRes.json();
      isRegisteredProgram.value = classesData.data.some((cls: any) => cls.slug === slug);
    }
  } catch (err) {
    programData.value = null;
    console.error('Error:', err);
  }
});
</script>

<template>
  <div>
    <ProgramTerdaftar v-if="isRegisteredProgram" />
    
    <template v-else>
      <DetailProgram />
      <div class="padding-components detail-siswa">
        <div v-if="isTutor">
          <HonorTutor />
        </div>
        <div v-else>
          <BiayaSiswa />
        </div>
        <InfoProgram />
        <CaraPendaftaran />
      </div>
    </template>
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

.detail-siswa {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

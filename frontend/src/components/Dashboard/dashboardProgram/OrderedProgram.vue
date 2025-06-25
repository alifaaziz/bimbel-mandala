<template>
  <div class="ordered-program-container">
    <n-space vertical :size="20">
      <n-h3 class="component-title">Program Terpesan</n-h3>

      <div v-for="program in orderedPrograms" :key="program.id">
        <n-card
          class="program-card"
          :bordered="false"
          content-style="padding: 16px 24px;"
        >
          <n-thing>
            <template #header>
              <span class="program-subject">{{ program.subject }}</span>
            </template>
            
            <template #description>
              <span class="program-teacher">{{ program.teacher }}</span>
            </template>

            <template #action>
              <n-button
                round
                ghost
                type="primary"
                @click="handleAction(program)"
              >
                Aksi
              </n-button>
            </template>
          </n-thing>
        </n-card>
      </div>
    </n-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NCard, NThing, NButton, NSpace, NH3, useMessage } from 'naive-ui';

// Opsional: untuk menampilkan notifikasi saat tombol "Aksi" diklik
const message = useMessage();

// Data reaktif untuk program yang dipesan.
// Dibuat sebagai array agar mudah jika ingin menampilkan lebih dari satu.
const orderedPrograms = ref([
  {
    id: 1,
    subject: 'Fisika SMA',
    teacher: 'Pak Dendy Wan S.Pd'
  },
  // Anda bisa menambahkan program lain di sini
  // {
  //   id: 2,
  //   subject: 'Kimia SMA',
  //   teacher: 'Ibu Retno Wulan S.Si'
  // }
]);

// Fungsi yang dipanggil ketika tombol "Aksi" diklik
const handleAction = (program) => {
  console.log('Aksi untuk program:', program.subject);
  message.info(`Tombol aksi untuk "${program.subject}" diklik!`);
};
</script>

<style scoped>
.ordered-program-container {
  padding: 24px;
  max-width: 500px; /* Batasi lebar agar tidak terlalu stretched */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.component-title {
  margin: 0;
  font-weight: 700;
  color: #1e3a8a; /* Warna biru tua yang solid */
}

.program-card {
  background-color: #f1f5f9; /* Warna latar abu-abu muda */
  border-radius: 12px; /* Membuat sudut lebih rounded */
}

/* Kustomisasi n-thing agar sesuai desain */
:deep(.n-thing-main) {
  flex-grow: 1;
}

.program-subject {
  font-weight: 600;
  font-size: 1.15rem;
  color: #1e293b;
}

.program-teacher {
  font-size: 0.95rem;
  color: #64748b;
}
</style>
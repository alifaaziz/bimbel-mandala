<template>
  <div class="ordered-program-container">
    <n-space vertical :size="20">
      <div class="header-row-ordered">
        <n-h3 class="component-title">Program Terpesan</n-h3>
        <div class="pagination-wrapper">
          <button
            class="pagination-btn"
            :disabled="page === 1"
            @click="handlePrev"
          >&lt;</button>
          <button
            class="pagination-btn"
            :disabled="page >= Math.ceil(total / limit)"
            @click="handleNext"
          >&gt;</button>
        </div>
      </div>

      <div v-for="program in orderedPrograms" :key="program.id">
        <n-card
          class="program-card"
          :bordered="false"
          content-style="padding: 16px 24px;"
        >
          <n-thing>
            <template #header>
              <div class="header-row">
                <span class="program-subject">{{ program.subject }}</span>
                <n-button
                  round
                  ghost
                  type="primary"
                  size="small"
                  @click="handleAction(program)"
                  class="aksi-btn"
                >
                  Aksi
                </n-button>
              </div>
            </template>
            <template #description>
              <span class="program-teacher">{{ program.teacher }}</span>
            </template>
          </n-thing>
        </n-card>
      </div>
    </n-space>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NCard, NThing, NButton, NSpace, NH3, useMessage } from 'naive-ui';

const message = useMessage();
const orderedPrograms = ref([]);
const page = ref(1);
const limit = ref(2);
const total = ref(0);

const fetchOrderedPrograms = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/orders?page=${page.value}&limit=${limit.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    orderedPrograms.value = result.data.data.map(item => ({
      id: item.id,
      subject: `${item.packageName} ${item.level}`,
      teacher: item.tutorName,
      status: item.status
    }));
    total.value = result.data.total;
  } catch (error) {
    message.error('Gagal mengambil data program terpesan');
  }
};

const handleAction = (program) => {
  message.info(`Tombol aksi untuk "${program.subject}" diklik!`);
};

function handlePrev() {
  if (page.value > 1) {
    page.value--;
    fetchOrderedPrograms();
  }
}
function handleNext() {
  if (page.value < Math.ceil(total.value / limit.value)) {
    page.value++;
    fetchOrderedPrograms();
  }
}

onMounted(() => {
  fetchOrderedPrograms();
});
</script>

<style scoped>
.ordered-program-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  max-width: 400px; /* Batasi lebar agar tidak terlalu stretched */
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

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-row-ordered {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.aksi-btn {
  margin-left: 12px;
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

.pagination-wrapper {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}

.pagination-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #154484;
  background: #fff;
  color: #154484;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
  line-height: 1;
}
.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
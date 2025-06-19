<template>
  <n-modal
    v-model="showModal"
    :mask-closable="false"
    preset="card"
    class="custom-card-modal"
    title=" "
  >
    <n-space vertical align="center" :size="24" style="text-align: center;">
      <n-h2 class="modal-title">
        Hapus Akun Siswa
      </n-h2>

      <n-text class="modal-text">
        Apakah anda yakin untuk menghapus akun {{ studentName }}?
      </n-text>

      <n-button
        type="primary"
        @click="handleConfirm"
        block
        round
        size="large"
        class="delete-button"
      >
        Hapus
      </n-button>

      <n-button
        ghost
        @click="handleCancel"
        block
        round
        size="large"
      >
        Batal
      </n-button>
    </n-space>
  </n-modal>
</template>

<script setup>
import { computed } from 'vue';
import { NModal, NCard, NSpace, NH2, NText, NButton } from 'naive-ui';

// Mendefinisikan props yang diterima dari komponen induk
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  studentName: {
    type: String,
    required: true,
  },
});

// Mendefinisikan event yang akan dikirim ke komponen induk
const emit = defineEmits(['update:show', 'confirm']);

// `computed` property untuk menyinkronkan status show/hide dengan parent
const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
});

const handleConfirm = () => {
  emit('confirm');
  // Modal akan ditutup oleh parent setelah aksi konfirmasi selesai
};

const handleCancel = () => {
  emit('update:show', false); // Langsung menutup modal
};
</script>

<style>
/* Menggunakan style global agar bisa menargetkan n-card di dalam modal preset */
.custom-card-modal .n-card {
  max-width: 420px;
  border-radius: 24px !important;
  padding: 24px 16px !important;
}

/* Menghilangkan header default dari modal preset="card" */
.custom-card-modal .n-card-header {
  padding: 0 !important;
}

.modal-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.75rem;
  color: #0F2C5A; /* Biru Tua */
}

.modal-text {
  font-size: 1rem;
  color: #64748B; /* Abu-abu */
}

.delete-button {
  background-color: #0F2C5A !important;
}
</style>
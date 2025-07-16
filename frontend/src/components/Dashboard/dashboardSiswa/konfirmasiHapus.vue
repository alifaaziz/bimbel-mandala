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
import { NModal, NSpace, NH2, NText, NButton } from 'naive-ui';

// Props dari parent
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
});

// Emit event ke parent
const emit = defineEmits(['update:show', 'confirm']);

// Sinkronisasi modal show/hide
const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
});

// Fungsi hapus user
const handleConfirm = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/users/${props.studentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Gagal menghapus user');
    emit('confirm');
  } catch (err) {
    alert('Terjadi kesalahan saat menghapus user');
  }
};

// Fungsi batal
const handleCancel = () => {
  emit('update:show', false);
};
</script>

<style>
.custom-card-modal .n-card {
  max-width: 420px;
  border-radius: 24px !important;
  padding: 24px 16px !important;
}

.custom-card-modal .n-card-header {
  padding: 0 !important;
}

.modal-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.75rem;
  color: #0F2C5A;
}

.modal-text {
  font-size: 1rem;
  color: #64748B;
}

.delete-button {
  background-color: #0F2C5A !important;
}
</style>
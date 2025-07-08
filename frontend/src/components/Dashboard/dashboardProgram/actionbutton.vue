<template>
  <div class="action-buttons-container">
    <n-divider />

    <n-space>
      <n-button 
        type="primary" 
        size="large" 
        @click="handleCreate"
        strong
      >
        Buat Program
      </n-button>
      
      <n-button 
        ghost 
        type="primary" 
        size="large" 
        round 
        @click="handleCancel"
      >
        Batal
      </n-button>
    </n-space>
  </div>
</template>

<script setup>
import { NButton, NSpace, NDivider, useMessage } from 'naive-ui';

// useMessage adalah hook untuk menampilkan notifikasi pop-up (opsional)
// Agar ini berfungsi, App.vue Anda harus dibungkus dengan <n-message-provider>
const message = useMessage();

const handleCreate = () => {
  console.log('Tombol "Buat Program" diklik.');
  message.success('Program berhasil dibuat!');
};

const handleCancel = () => {
  console.log('Tombol "Batal" diklik.');
  message.warning('Aksi telah dibatalkan.');
};
</script>

<style scoped>
.action-buttons-container {
  padding-top: 16px;
  width: 100%;
}
</style>
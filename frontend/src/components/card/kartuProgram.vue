<script setup>
import { NCard } from 'naive-ui'
</script>

<template>
  <h1 class="headerr2">Program</h1>
  <h2 class="headerb1">Unggulan</h2>
  <n-card 
    class="n-card"
    style="max-width: 558px; margin: 0 auto;"
  >
    <div class="card-content">
      <div class="card-image">
        <img 
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
          alt="Cover Image" 
        />
      </div>
      <div class="card-text">
        <h3>Card Title</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sapien, est felis, sagittis viverra nulla mattis scelerisque.
        </p>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.n-card {
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem; /* Jarak antara gambar dan teks */
}

.card-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px; /* Opsional: Membuat gambar memiliki sudut melengkung */
}

.card-text {
  flex: 1; /* Membuat teks mengambil sisa ruang */
}

.card-text h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.card-text p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}
</style>
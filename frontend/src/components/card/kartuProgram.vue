<script setup>
import { NCard } from 'naive-ui'
</script>

<template>
  <n-card 
    class="n-card"
    style="width: 558px; height: 304px; margin: 0 auto; background-color: #003366;"
  >
    <div class="card-content">
      <!-- Bagian gambar -->
      <div class="card-image">
        <img 
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
          alt="Profile Image" 
        />
        <p class="privat">Privat/Kelompok</p>
      </div>
      <!-- Bagian teks -->
      <div class="card-text">
        <div class="header">
          <div class="title-group">
            <h3>Matematika</h3>
            <p class="name">Pak Dendy Wan S.Pd</p>
          </div>
          <div class="badge">SMA</div>
        </div>
        <p><strong>Area:</strong> Semarang</p>
        <p><strong>Hari:</strong> Senin, Rabu, Sabtu</p>
        <p><strong>Pukul:</strong> 15:00 WIB</p>
        <p><strong>Durasi:</strong> 2 Jam</p>
        <div class="footer">
          <button class="btn-daftar">Daftar Program</button>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.n-card {
  width: 520px; 
  height: 280px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #003366; /* Warna latar belakang biru */
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem; /* Jarak antara gambar dan teks */
  height: 100%;
}

.card-image {
  display: flex;
  flex-direction: column; /* Agar teks berada di bawah gambar */
  align-items: center;
}

.card-image img {
  width: 200px;
  height: 228px;
  object-fit: cover;
  border-radius: 8px; /* Sudut yang disesuaikan */
}

.card-image .privat {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: white;
  font-weight: bold;
  text-align: center;
}

.card-text {
  flex: 1;
  color: white; /* Warna teks */
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.card-text h3 {
  font-size: 2rem; /* Ukuran font Header B 0 */
  font-family: 'Poppins', sans-serif; /* Font Poppins */
  font-weight: 700; /* Font weight untuk Header B 0 */
  color: #DEE4EE; /* Warna teks */
}

.card-text .badge {
  padding: 10px 20px;
  background-color: #dee4ee;
  font-size: 1,5rem;
  color: #617592;
  border: none;
  border-radius: 90px; 
  font-weight: bold;
}

.card-text .name {
  margin-top: -1rem;
  font-size: 1.125rem; /* Ukuran font */
  font-family: 'Poppins', sans-serif; /* Font Poppins */
  font-weight: 700; /* Font weight bold */
  color: #DEE4EE; /* Warna teks */
}

.card-text p {
  margin-top: 0.65rem;
  font-size: 16px; /* Ukuran font */
  font-family: 'Poppins', sans-serif; /* Font Poppins */
  font-weight: 400; /* Font weight reguler */
  color: white; /* Warna teks */
}

.footer {
  margin-top: 1rem;
}

.btn-daftar {
  padding: 10px 20px;
  background-color: #9bafcb;
  color: #154484;
  border: none;
  border-radius: 90px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.btn-daftar:hover {
  background-color: #fb8312;
}
</style>

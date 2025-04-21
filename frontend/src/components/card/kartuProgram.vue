<script setup>
import { NCard } from 'naive-ui'
import { programs } from '@/assets/dataSementara/program.js'
</script>

<template>
  <div class="card-container">
    <n-card 
      v-for="program in programs" 
      :key="program.id"
      class="n-card"
      style="width: 584px; height: 304px; margin: 0 auto; background-color: #003366;"
    >
      <div class="card-content">
        <!-- Bagian gambar -->
        <div class="card-image">
          <img 
            :src="program.image" 
            :alt="`Image of ${program.title}`" 
          />
          <p class="privat">{{ program.type }}</p>
        </div>
        <!-- Bagian teks -->
        <div class="card-text">
          <div class="header">
            <div class="title-group">
              <h3>{{ program.title }}</h3>
              <p class="name">{{ program.teacher }}</p>
            </div>
            <div class="badge">{{ program.level }}</div>
          </div>
          <p><strong>Area:</strong> {{ program.area }}</p>
          <p><strong>Hari:</strong> {{ program.days }}</p>
          <p><strong>Pukul:</strong> {{ program.time }}</p>
          <p><strong>Durasi:</strong> {{ program.duration }}</p>
          <div class="footer">
            <button class="btn-daftar">Daftar Program</button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap; /* Agar card bisa turun ke baris berikutnya jika tidak muat */
  gap: 1rem; /* Jarak antar card */
  justify-content: center; /* Pusatkan card secara horizontal */
}
  
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

@media (max-width: 960px) {
  .card-container {
    flex-direction: column; /* Susun kartu secara vertikal */
    gap: 1rem; /* Jarak antar kartu */
  }

  .n-card {
    width: 90%; /* Sesuaikan lebar kartu dengan lebar layar */
    height: auto; /* Biarkan tinggi menyesuaikan konten */
    transform: scale(0.9); /* Mengecilkan ukuran kartu */
  }

  .card-content {
    flex-direction: column; /* Susun konten kartu secara vertikal */
    align-items: flex-start; /* Rata kiri */
    gap: 0.8rem; /* Jarak antar elemen */
  }

  .card-image img {
    width: 90%; /* Gambar memenuhi lebar kartu */
    height: auto; /* Biarkan tinggi menyesuaikan */
  }

  .card-text {
    width: 90%; /* Sesuaikan teks dengan lebar kartu */
    font-size: 0.9rem; /* Mengecilkan ukuran teks */
  }

  .btn-daftar {
    width: 90%; /* Tombol memenuhi lebar kartu */
    text-align: center; /* Teks tombol di tengah */
    font-size: 0.9rem; /* Mengecilkan ukuran font tombol */
  }
}
</style>

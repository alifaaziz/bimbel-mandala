<template>
  <div class="paling-populer-container">
    <h2 class="title">Paling Populer</h2>
    <div class="courses-grid">
      <div v-for="(course, index) in courses" :key="index" class="course-card">
        <img :src="course.image" :alt="course.subject" class="course-image" />
        <div class="course-info">
          <div class="subject-level">
            <h3 class="subject">{{ course.subject }}</h3>
            <span class="level">{{ course.level }}</span>
          </div>
          <p class="instructor">{{ course.instructor }}</p>
          <div class="details">
            <p><span class="label">Area</span> : {{ course.area }}</p>
            <p><span class="label">Hari</span> : {{ course.days }}</p>
            <p><span class="label">Pukul</span> : {{ course.time }}</p>
            <p><span class="label">Durasi</span> : {{ course.duration }}</p>
          </div>
          <div class="footer">
            <span class="type">{{ course.type }}</span>
            <button class="register-button">Daftar Program</button>
          </div>
        </div>
      </div>
    </div>
    <div class="navigation-dots">
      <span class="arrow left-arrow">&leftarrow;</span>
      <span
        v-for="n in 4"
        :key="'dot-' + n"
        :class="['dot', { active: n === 1 }]"
      ></span>
      <span class="arrow right-arrow">&rightarrow;</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PalingPopuler',
  data() {
    return {
      courses: [
        {
          image: 'https://via.placeholder.com/200x150.png?text=Pak+Dendy', // Ganti dengan URL gambar yang sesuai
          subject: 'Matematika',
          level: 'SMA',
          instructor: 'Pak Dendy Wan S.Pd',
          area: 'Semarang',
          days: 'Senin, Rabu, Sabtu',
          time: '15:00 WIB',
          duration: '2 Jam',
          type: 'Privat/Kelompok',
        },
        {
          image: 'https://via.placeholder.com/200x150.png?text=Pak+Dendy', // Ganti dengan URL gambar yang sesuai
          subject: 'Matematika',
          level: 'SMA',
          instructor: 'Pak Dendy Wan S.Pd',
          area: 'Semarang',
          days: 'Senin, Rabu, Sabtu',
          time: '15:00 WIB',
          duration: '2 Jam',
          type: 'Privat/Kelompok',
        },
        {
          image: 'https://via.placeholder.com/200x150.png?text=Pak+Dendy', // Ganti dengan URL gambar yang sesuai
          subject: 'Matematika',
          level: 'SMA',
          instructor: 'Pak Dendy Wan S.Pd',
          area: 'Semarang',
          days: 'Senin, Rabu, Sabtu',
          time: '15:00 WIB',
          duration: '2 Jam',
          type: 'Privat/Kelompok',
        },
        {
          image: 'https://via.placeholder.com/200x150.png?text=Pak+Dendy', // Ganti dengan URL gambar yang sesuai
          subject: 'Matematika',
          level: 'SMA',
          instructor: 'Pak Dendy Wan S.Pd',
          area: 'Semarang',
          days: 'Senin, Rabu, Sabtu',
          time: '15:00 WIB',
          duration: '2 Jam',
          type: 'Privat/Kelompok',
        },
      ],
    };
  },
};
</script>

<style scoped>
.paling-populer-container {
  background-color: #ffffff; /* Atau warna latar belakang utama jika ada */
  padding: 20px;
  font-family: sans-serif;
}

.title {
  text-align: center;
  color: #0056b3; /* Biru tua seperti di gambar */
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Membuat grid responsif */
  gap: 20px;
  margin-bottom: 30px;
}

.course-card {
  background-color: #0d47a1; /* Biru tua untuk card */
  border-radius: 10px;
  color: white;
  display: flex;
  overflow: hidden; /* Untuk memastikan gambar tidak keluar dari border radius */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 130px; /* Sesuaikan dengan ukuran gambar di desain */
  height: auto; /* Menjaga rasio aspek gambar */
  object-fit: cover;
}

.course-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.subject-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subject {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.level {
  background-color: #e0e0e0;
  color: #0d47a1; /* Warna teks level disesuaikan agar kontras */
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
}

.instructor {
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 500;
}

.details p {
  font-size: 13px;
  margin: 4px 0;
  color: #e0e0e0; /* Warna teks detail sedikit lebih terang */
}

.details .label {
  font-weight: 500;
  color: #bdbdbd; /* Warna label sedikit berbeda */
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.type {
  background-color: #1565c0; /* Biru yang sedikit lebih terang untuk badge */
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
}

.register-button {
  background-color: #e0e0e0;
  color: #0d47a1; /* Warna teks tombol */
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #cccccc;
}

.navigation-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.arrow {
  color: #0d47a1;
  font-size: 24px;
  cursor: pointer;
  padding: 0 10px;
}

.dot {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin: 0 5px;
  cursor: pointer;
}

.dot.active {
  background-color: #0d47a1;
}

/* Responsif tambahan jika diperlukan */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr; /* Satu kolom di layar kecil */
  }
  .course-card {
    flex-direction: column; /* Tumpuk gambar dan info di layar kecil */
  }
  .course-image {
    width: 100%;
    height: 200px; /* Sesuaikan tinggi gambar */
    border-bottom-left-radius: 0;
    border-top-right-radius: 10px; /* Jaga lengkungan atas */
  }
  .subject-level {
    flex-direction: column;
    align-items: flex-start;
  }
  .level {
    margin-top: 5px;
  }
}
</style>
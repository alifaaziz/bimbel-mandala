<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="../../assets/logomandala22.png" alt="Logo Bimbingan Belajar Mandala" class="logo">
    </div>
    <nav class="navigation">
      <ul>
        <li class="nav-item active">
          <a href="#">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-user-graduate"></i>
            <span>Siswa</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-user"></i>
            <span>Tutor</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-tasks"></i>
            <span>Program</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-calendar-alt"></i>
            <span>Jadwal Program Aktif</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-clipboard"></i>
            <span>Catatan & Biaya</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="sidebar-bottom">
      <ul>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-bell"></i>
            <span>Notifikasi</span>
            <span class="notification-badge"></span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#">
            <i class="fas fa-sign-out-alt"></i>
            <span>Log Out</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarNav'
}
</script>

<style scoped>
.sidebar {
  width: 256px; /* Lebar sidebar bisa disesuaikan */
  background-color: #091c36; /* Warna latar belakang utama sidebar */
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh; /* Tinggi sidebar sesuai tinggi viewport */
  font-family: sans-serif; /* Ganti dengan font yang sesuai */
}

.logo-container {
  background-color: #fff; /* Warna latar belakang logo section */
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom-right-radius: 30px; /* Lengkungan seperti di gambar */
  border-bottom-left-radius: 30px; /* Lengkungan seperti di gambar */
  margin-bottom: 10px; /* Jarak ke menu navigasi */
}

.logo {
  height: 50px; /* Sesuaikan ukuran logo */
  margin-right: 15px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  color: #000; /* Warna teks logo */
}

.brand-name {
  font-size: 0.8em;
  font-weight: bold;
  color: #555; /* Warna teks "BIMBINGAN BELAJAR" */
}

.brand-main {
  font-size: 1.5em;
  font-weight: bold;
  color: #003366; /* Warna biru tua untuk "MANDALA" */
}

.brand-tagline {
  font-size: 0.7em;
  color: #777; /* Warna teks tagline */
}

.navigation {
  flex-grow: 1; /* Membuat navigasi mengisi ruang yang tersisa */
  padding: 0 20px;
}

.navigation ul,
.sidebar-bottom ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 5px; /* Jarak antar item */
}

.nav-item a {
  display: flex;
  align-items: center;
  padding: 15px 20px; /* Padding untuk setiap item */
  color: #fff;
  text-decoration: none;
  border-radius: 25px; /* Lengkungan untuk item */
  transition: background-color 0.3s ease;
}

.nav-item a:hover {
  background-color: #1a1a1a; /* Warna latar saat hover */
}

.nav-item.active a {
  background-color: #003366; /* Warna latar item aktif (biru tua) */
  color: #fff;
}

.nav-item i {
  margin-right: 15px;
  font-size: 1.2em; /* Ukuran ikon */
  width: 20px; /* Agar ikon sejajar */
  text-align: center;
}

.nav-item span {
  font-size: 0.95em;
}

.sidebar-bottom {
  padding: 0 20px 20px 20px; /* Padding untuk bagian bawah */
  border-top: 1px solid #333; /* Garis pemisah jika diperlukan */
  margin-top: auto; /* Mendorong ke bawah */
}

.notification-badge {
  width: 8px;
  height: 8px;
  background-color: #ff8c00; /* Warna badge notifikasi (oranye) */
  border-radius: 50%;
  margin-left: auto; /* Mendorong badge ke kanan */
  align-self: flex-start; /* Menjaga posisi badge di atas */
  margin-top: 5px; /* Sedikit jarak dari atas */
}

/* Pastikan Anda telah mengimpor Font Awesome jika menggunakan class fas, far */
/* Contoh import di file main.js atau index.html: */
/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" /> */
</style>
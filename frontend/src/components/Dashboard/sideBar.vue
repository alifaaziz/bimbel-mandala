<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="../../assets/logomandala22.png" alt="Logo Bimbingan Belajar Mandala" class="logo" />
    </div>

    <nav class="navigation">
      <ul class="bodyr1">
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/home.svg" alt="Home Icon" class="icon-white">
            <span>Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/siswa.svg" alt="Home Icon" class="icon-white">
            <span>Siswa</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/teacher.svg" alt="Home Icon" class="icon-white">
            <span>Tutor</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/program.svg" alt="Home Icon" class="icon-white">
            <span>Program</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/jpa.svg" alt="Home Icon" class="icon-white">
            <span>Jadwal Program Aktif</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/cb.svg" alt="Home Icon" class="icon-white">
            <span>Catatan & Biaya</span>
          </a>
        </li>
      </ul>
    </nav>

    <n-divider />

    <div class="sidebar-bottom bodyr1">
      <ul>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/bell.svg" alt="Home Icon" class="icon-white">
            <span>Notifikasi</span>
            <span class="notification-badge"></span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-but" href="#">
            <img src="@/assets/icons/admin/logout.svg" alt="Home Icon" class="icon-white">
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
  top: 0;
  left: 0;
  width: 256px;
  height: 100vh;
  background-color: #091c36;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: sans-serif;
  z-index: 1000;
  overflow-y: auto;
}

.logo-container {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  padding: 0px 12px;
}

.logo {
  height: 50px;
}

.navigation {
  margin-top: 20px;
}

.icon-white {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.nav-but {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.navigation ul,
.sidebar-bottom ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item a {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #fff;
  text-decoration: none;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.nav-item a:hover,
.nav-item a.active {
  background-color: #1a1a1a;
}

.nav-item i {
  margin-right: 15px;
  font-size: 1.2em;
  width: 20px;
  text-align: center;
}

.nav-item span {
  font-size: 0.95em;
}

.notification-badge {
  width: 8px;
  height: 8px;
  background-color: #ff8c00;
  border-radius: 50%;
  margin-left: auto;
  align-self: flex-start;
  margin-top: 5px;
}
</style>

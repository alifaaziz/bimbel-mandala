<template>
  <div>
    <!-- Sidebar -->
    <div class="sidebar" ref="sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="logo-container">
        <img src="../../assets/logo_mandala_bg.svg" alt="Logo" class="logo" />
      </div>

      <nav class="navigation">
        <ul class="bodyr1">
          <li class="nav-item">
            <router-link
              class="nav-but"
              to="/dashboardadmin"
              :class="{ active: activeMenu === 'Dashboard' }"
              @click.native="setActive('Dashboard')"
            >
              <img src="@/assets/icons/admin/home.svg" alt="Home Icon" class="icon-white">
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-but"
              to="/dashboardadmin/siswa"
              :class="{ active: activeMenu === 'Siswa' }"
              @click.native="setActive('Siswa')"
            >
              <img src="@/assets/icons/admin/siswa.svg" alt="Siswa Icon" class="icon-white">
              <span>Siswa</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-but"
              to="/dashboardadmin/tutor"
              :class="{ active: activeMenu === 'Tutor' }"
              @click.native="setActive('Tutor')"
            >
              <img src="@/assets/icons/admin/teacher.svg" alt="Tutor Icon" class="icon-white">
              <span>Tutor</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-but"
              to="/dashboardadmin/program"
              :class="{ active: activeMenu === 'Program' }"
              @click.native="setActive('Program')"
            >
              <img src="@/assets/icons/admin/program.svg" alt="Program Icon" class="icon-white">
              <span>Program</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-but"
              to="/dashboardadmin/jadwal"
              :class="{ active: activeMenu === 'Jadwal Program Aktif' }"
              @click.native="setActive('Jadwal Program Aktif')"
            >
              <img src="@/assets/icons/admin/jpa.svg" alt="JPA Icon" class="icon-white">
              <span>Jadwal Program Aktif</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-but"
              to="/dashboardadmin/catatanbiaya"
              :class="{ active: activeMenu === 'Catatan & Biaya' }"
              @click.native="setActive('Catatan & Biaya')"
            >
              <img src="@/assets/icons/admin/cb.svg" alt="CB Icon" class="icon-white">
              <span>Catatan & Biaya</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <n-divider />

      <div class="sidebar-bottom bodyr1">
        <ul>
          <li class="nav-item">
            <a class="nav-but" href="#" @click.prevent="handleLogout">
              <img src="@/assets/icons/admin/logout.svg" alt="Logout Icon" class="icon-white">
              <span>Log Out</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- Burger Menu (mobile only) -->
    <div class="burger-menu" ref="burger" @click="toggleSidebar" v-show="!sidebarOpen">
      <p class="buttonb1">Menu</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarNav',
  data() {
    return {
      sidebarOpen: false,
      activeMenu: 'Dashboard' // default menu aktif
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    handleClickOutside(event) {
      const isMobile = window.innerWidth <= 768;
      if (
        isMobile &&
        this.sidebarOpen &&
        !this.$refs.sidebar.contains(event.target) &&
        !this.$refs.burger.contains(event.target)
      ) {
        this.sidebarOpen = false;
      }
    },
    setActive(menu) {
      this.activeMenu = menu;
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.$router.push('/auth');
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.sidebar {
  top: 0;
  left: 0;
  width: 256px;
  height: 100vh;
  background-color: #0B2343;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: sans-serif;
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

/* Logo */
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

.nav-item a.active {
  background-color: #154484;
  color: #fff;
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

/* Burger Menu */
.burger-menu {
  display: none;
  position: fixed;
  top: 20px;
  z-index: 1100;
  background-color: orange;
  border-radius: 0 8px 8px 0;
  padding: 8px;
}

.buttonb1 {
  color: white;
}

/* Responsiveness */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .burger-menu {
    display: block;
  }
}
</style>

<script setup>
import butDaftar from './dirButton/butDaftar.vue';
import butMasuk from './dirButton/butMasuk.vue';
</script>

<script>
import { defineComponent } from 'vue';
import { NLayout, NLayoutHeader, NMenu, NButton, NDrawer } from 'naive-ui';
import { auth } from '../auth.js';


export default defineComponent({
  name: 'Navbar',
  components: {
    NLayout,
    NLayoutHeader,
    NMenu,
    NButton,
    NDrawer,
    butDaftar,
    butMasuk,
  },
  data() {
    return {
      isDesktop: window.innerWidth >= 981,
      drawerVisible: false,
      currentRoute: this.$route.name,
      menuOptions: [
        { label: 'Beranda', key: 'Beranda', to: '/' },
        { label: 'Tentang Kami', key: 'Tentang Kami', to: '/tentangkami' },
        { label: 'Program', key: 'Program', to: '/#' },
        { label: 'Menjadi Tutor', key: 'Menjadi Tutor', to: '/pendaftarantutor' },
        { label: 'Daftar', key: 'Daftar', to: '/#' }, 
        { label: 'Masuk', key: 'Masuk', to: '/Auth' },  
      ],
      menuTheme: {
        itemTextColor: '#9BAFCB',
        borderRadius: '6px',
        itemColorHover: '#154484',
        fontSize: '16px',
        colorHover: '#FB8312',
      },
    };
  },
  computed: {
    // Hapus Masuk dan Daftar dari menu yang ditampilkan
    filteredMenuOptions() {
      return this.menuOptions.filter(
        (option) => option.label !== 'Masuk' && option.label !== 'Daftar'
      );
    },
  },
  methods: {
    handleResize() {
      this.isDesktop = window.innerWidth >= 981;
    },
    toggleMenu() {
      this.drawerVisible = !this.drawerVisible;
    },
    handleMenuClick(key) {
      const selectedOption = this.menuOptions.find(option => option.key === key);
      if (selectedOption && selectedOption.to) {
        this.$router.push(selectedOption.to);
      }
      this.drawerVisible = false;
    },
  },
  watch: {
    $route(to) {
      this.currentRoute = to.name;
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
});
</script>

<template>
  <n-layout>
    <n-layout-header class="navbar">
      <div class="navbar-wrapper">
        <div class="logo">
          <img src="../assets/logomandala22.png" alt="Logo" />
        </div>

        <div class="menu-container">
          <!-- Tombol untuk mobile -->
          <n-button
            class="menu-button"
            @click="toggleMenu"
            v-if="!isDesktop"
          >
            ☰
          </n-button>

          <!-- Desktop Menu -->
          <template v-else>
            <n-menu
              mode="horizontal"
              :options="filteredMenuOptions"
              :theme-overrides="menuTheme"
              :value="currentRoute"
              @update:value="handleMenuClick"
            />

            <!-- Khusus tombol Masuk & Daftar -->
            <template v-if="!auth.isLoggedIn">
              <butDaftar />
              <butMasuk />
            </template>
            <template v-else>
              <div class="user-info">
                <span>{{ auth.user.name }}</span>
                <n-button size="small" @click="logout">Logout</n-button>
              </div>
            </template>
          </template>

          <!-- Drawer Menu Mobile -->
          <n-drawer
            v-if="!isDesktop"
            v-model:show="drawerVisible"
            placement="right"
            size="260"
          >
            <n-menu
              mode="vertical"
              :options="menuOptions"
              :theme-overrides="menuTheme"
              @update:value="handleMenuClick"
            />
          </n-drawer>
        </div>
      </div>
    </n-layout-header>
  </n-layout>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 68px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 2px solid #9BAFCB;
  background-color: white;
  padding: 0 8rem;
  display: flex;
  align-items: center;
}

.navbar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 56px;
  object-fit: contain;
}

.menu-container {
  display: flex;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

/* Tambahan baru: tombol Masuk & Daftar */
.auth-buttons {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

/* Deep style overrides */
::v-deep(.n-menu-item) {
  transition: all 0.2s ease;
  border-radius: 8px;
}

::v-deep(.n-menu-item-content-header:hover),
::v-deep(.n-menu-item-content:hover) {
  color: #FB8312 !important;
}

::v-deep(.n-menu-item-content--selected .n-menu-item-content-header) {
  color: #FB8312 !important;
  font-weight: 600;
}

/* Responsive padding */
@media (max-width: 1024px) {
  .navbar {
    padding: 0 4rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 2rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 1rem;
  }
}
</style>

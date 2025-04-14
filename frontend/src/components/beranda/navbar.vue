<template>
    <n-layout>
      <n-layout-header class="navbar">
        <div class="logo">
          <img src="../../assets/logomandala22.png" alt="Logo" />
        </div>
        <div class="menu-container">
          <n-button
            class="menu-button"
            @click="toggleMenu"
            v-if="!isDesktop"
          >
            ☰
          </n-button>
  
          <!-- Desktop Menu -->
          <n-menu
            v-else
            mode="horizontal"
            :options="menuOptions"
            :theme-overrides="menuTheme"
            @update:value="handleMenuClick"
          />
  
          <!-- Mobile Menu -->
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
      </n-layout-header>
    </n-layout>
  </template>
  
  <script>
  import {
    defineComponent,
    ref,
    onMounted,
    onUnmounted,
  } from 'vue';
  import {
    NLayout,
    NLayoutHeader,
    NMenu,
    NButton,
    NDrawer,
  } from 'naive-ui';
  
  export default defineComponent({
    name: 'Navbar',
    components: {
      NLayout,
      NLayoutHeader,
      NMenu,
      NButton,
      NDrawer,
    },
    data() {
      return {
        isDesktop: window.innerWidth >= 981,
        drawerVisible: false,
        menuOptions: [
          { label: 'Beranda', key: 'Beranda' },
          { label: 'Tentang Kami', key: 'Tentang Kami' },
          { label: 'Program', key: 'Program' },
          { label: 'Menjadi Tutor', key: 'Menjadi Tutor' },
        ],
        menuTheme: {
          itemTextColor: '#9BAFCB', // Warna teks default
          borderRadius: '6px', // Radius border item
          itemColorHover: '#000000', 
          fontSize: '16px', // Ukuran font
          colorHover: '#FB8312', // Warna teks saat hover
        },
      };
    },
    methods: {
      handleResize() {
        this.isDesktop = window.innerWidth >= 981;
      },
      toggleMenu() {
        this.drawerVisible = !this.drawerVisible;
      },
      handleMenuClick(key) {
        console.log('Menu clicked:', key);
        this.drawerVisible = false;
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
  
  <style scoped>
  .navbar {
    width: 100%;
    height: 68px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
    padding: 0 8rem;
    border-bottom: 2px solid #9BAFCB; 
  }
  
  .logo {
    display: contents;
    align-items: center;
    height: 100%;
  }

  .logo img {
    height: 56px;
    object-fit: contain;
  }
  
  .menu-container {
    display: flex;
    align-items: center;
    margin-left: 20px;
    font-family: 'Poppins', sans-serif;
  }
  
  ::v-deep(.n-menu-item) {
    transition: all 0.2s ease;
    border-radius: 8px;
  }

  ::v-deep(.n-menu-item-content-header:hover) {
    color: #FB8312 !important;
  }

  ::v-deep(.n-menu-item-content:hover) {
    color: #FB8312 !important;
  }

  ::v-deep(.n-menu-item-content--selected .n-menu-item-content-header) {
    color: #FB8312 !important;
    font-weight: 600; /* optional: to highlight selected item more */
}

@media (max-width: 961px) {
    .navbar {
      padding: 2rem 40px;
    }
  }

</style>


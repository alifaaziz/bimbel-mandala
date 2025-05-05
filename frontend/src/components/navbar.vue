<script setup>
import butDaftar from './dirButton/butDaftar.vue';
import butMasuk from './dirButton/butMasuk.vue';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NLayout, NLayoutHeader, NMenu, NButton, NDrawer } from 'naive-ui';
import { auth } from '../auth.js';

const props = defineProps({
  // You can add props here if needed
});

const router = useRouter();
const route = useRoute();

const isDesktop = ref(window.innerWidth >= 981);
const drawerVisible = ref(false);
const currentRoute = ref(route.name);

const menuOptionsLoggedOut = [
  { label: 'Beranda', key: 'Beranda', to: '/' },
  { label: 'Tentang Kami', key: 'Tentang Kami', to: '/tentangkami' },
  { label: 'Program', key: 'Program', to: '/program' },
  { label: 'Menjadi Tutor', key: 'Menjadi Tutor', to: '/pendaftarantutor' },
  { label: 'Daftar', key: 'Daftar', to: '/daftar' },
  { label: 'Masuk', key: 'Masuk', to: '/auth' },
];

const menuOptionsLoggedIn = [
  { label: 'Beranda', key: 'Beranda', to: '/' },
  { label: 'Tentang Kami', key: 'Tentang Kami', to: '/tentangkami' },
  { label: 'Absen', key: 'Absen', to: '/absen' },
  { label: 'Program', key: 'Program', to: '/program' },
  { label: 'Rekap', key: 'Rekap', to: '/rekap' },
];

const menuTheme = {
  itemTextColor: '#9BAFCB',
  borderRadius: '6px',
  itemColorHover: '#154484',
  fontSize: '16px',
  colorHover: '#FB8312',
};

const filteredMenuOptions = computed(() => {
  if (auth.isLoggedIn) {
    return menuOptionsLoggedIn;
  }

  // Hide 'Daftar' and 'Masuk' on desktop (they'll be shown as buttons)
  if (isDesktop.value) {
    return menuOptionsLoggedOut.filter(option => 
      option.key !== 'Daftar' && option.key !== 'Masuk'
    );
  }

  return menuOptionsLoggedOut;
});

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 981;
};

const toggleMenu = () => {
  drawerVisible.value = !drawerVisible.value;
};

const handleMenuClick = (key) => {
  const selectedOption = filteredMenuOptions.value.find(option => option.key === key);
  if (selectedOption?.to) {
    router.push(selectedOption.to);
  }
  drawerVisible.value = false;
};

const logout = () => {
  // Implement your logout logic here
  auth.logout();
  router.push('/');
};

watch(
  () => route.name,
  (newRoute) => {
    currentRoute.value = newRoute;
  }
);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <n-layout>
    <n-layout-header class="navbar">
      <div class="navbar-wrapper">
        <router-link to="/" class="logo">
          <img src="../assets/logomandala22.png" alt="Logo" />
        </router-link>

        <div class="menu-container">
          <!-- Mobile menu button -->
          <n-button
            v-if="!isDesktop"
            class="menu-button"
            @click="toggleMenu"
            aria-label="Toggle menu"
          >
            ☰
          </n-button>

          <!-- Desktop menu -->
          <template v-else>
            <n-menu
              mode="horizontal"
              :options="filteredMenuOptions"
              :theme-overrides="menuTheme"
              :value="currentRoute"
              @update:value="handleMenuClick"
            />

            <div class="menu-divider"></div>

            <template v-if="!auth.isLoggedIn">
              <butDaftar />
              <butMasuk />
            </template>
            
            <template v-else>
              <div class="user-actions">
                <router-link 
                  to="/notification" 
                  class="action-icon"
                  aria-label="Notifications"
                >
                  <ion-icon name="notifications-outline"></ion-icon>
                </router-link>
                <router-link 
                  to="/jadwal" 
                  class="action-icon"
                  aria-label="Schedule"
                >
                  <ion-icon name="calendar-outline"></ion-icon>
                </router-link>
                <router-link 
                  to="/akun" 
                  class="action-icon"
                  aria-label="Account"
                >
                  <ion-icon name="person-outline"></ion-icon>
                </router-link>
              </div>
            </template>
          </template>

          <!-- Mobile drawer menu -->
          <n-drawer
            v-if="!isDesktop"
            v-model:show="drawerVisible"
            placement="right"
            :width="260"
          >
            <n-menu
              mode="vertical"
              :options="filteredMenuOptions"
              :theme-overrides="menuTheme"
              @update:value="handleMenuClick"
            />
            
            <div class="mobile-auth-actions" v-if="auth.isLoggedIn">
              <div class="user-info">
                <span>{{ auth.user.name }}</span>
                <n-button size="small" @click="logout">Logout</n-button>
              </div>
            </div>
          </n-drawer>
        </div>
      </div>
    </n-layout-header>
  </n-layout>
</template>

<style scoped>
.navbar {
  --navbar-height: 68px;
  --navbar-padding-x: clamp(1rem, 5vw, 8rem);
  --menu-divider-color: #9BAFCB;
  --icon-color: #154484;
  --icon-hover-color: #FB8312;
  
  width: 100%;
  height: var(--navbar-height);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 2px solid var(--menu-divider-color);
  background-color: white;
  padding: 0 8rem;
}

.navbar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

.logo {
  display: flex;
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
  gap: 1rem;
  font-family: 'Poppins', sans-serif;
  height: 100%;
}

.menu-divider {
  width: 2px;
  height: 32px;
  background-color: var(--menu-divider-color);
  margin: 0 1rem;
  align-self: center;
}

/* User actions */
.user-actions {
  display: flex;
  gap: 1.5rem;
  margin-left: 1rem;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--icon-color);
  transition: color 0.2s ease;
}

.action-icon:hover {
  color: var(--icon-hover-color);
}

ion-icon {
  font-size: 24px;
}

/* Mobile auth actions */
.mobile-auth-actions {
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
  margin-top: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Menu item styles */
:deep(.n-menu-item) {
  transition: all 0.2s ease;
  border-radius: 8px;
}

:deep(.n-menu-item-content-header:hover),
:deep(.n-menu-item-content:hover) {
  color: var(--icon-hover-color) !important;
}

:deep(.n-menu-item-content--selected .n-menu-item-content-header) {
  color: var(--icon-hover-color) !important;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .menu-divider {
    margin: 0 0.5rem;
  }

  .navbar {
    padding: 0 2rem;
  }
}
</style>
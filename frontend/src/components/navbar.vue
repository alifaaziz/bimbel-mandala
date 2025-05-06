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

// State management
const isDesktop = ref(window.innerWidth >= 981);
const drawerVisible = ref(false);
const currentRoute = ref(route.name);
const showNotificationPopup = ref(false);

// Notification data
const notifications = ref([
  { 
    id: 1, 
    type: 'Program', 
    message: 'Selamat, Bimbingan belajar Matematika SMA #11234 bersama Pak Dendy Wan S.Pd telah selesai dilakukan.', 
    read: false, 
    time: '10 menit lalu',
    photo: './tutor/3.png'
  },
  { 
    id: 2, 
    type: 'Absensi', 
    message: 'Anda telah melakukan absensi pada bimbingan belajar Matematika SMA #11234.', 
    read: false, 
    time: '1 jam lalu',
    photo: './tutor/3.png'
  },
  { 
    id: 3, 
    type: 'Absensi', 
    message: 'Pak Dendy Wan S.Pd telah melakukan absensi pada bimbingan belajar Matematika SMA #11234.', 
    read: true, 
    time: '2 hari lalu',
    photo: './tutor/3.png'
  },
  { 
    id: 4, 
    type: 'Jadwal', 
    message: 'Pak Dendy Wan S.Pd melakukan perubahan jadwal pada Matematika SMA #11234.', 
    read: true, 
    time: '1 minggu lalu',
    photo: './tutor/3.png',
    scheduleId: '11234'
  },
  { 
    id: 5, 
    type: 'Izin', 
    message: 'Pak Dendy Wan S.Pd melakukan izin pada Matematika SMA #11234.', 
    read: true, 
    time: '1 minggu lalu',
    photo: './tutor/3.png',
    reason: 'Sakit flu berat, tidak memungkinkan untuk mengajar'
  }
]);

// Computed properties
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

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

  if (isDesktop.value) {
    return menuOptionsLoggedOut.filter(option => 
      option.key !== 'Daftar' && option.key !== 'Masuk'
    );
  }

  return menuOptionsLoggedOut;
});

// Methods
const goToSchedule = (scheduleId) => {
  showNotificationPopup.value = false;
  router.push(`/jadwal/${scheduleId}`);
};

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

const toggleNotifications = () => {
  showNotificationPopup.value = !showNotificationPopup.value;
  if (showNotificationPopup.value) {
    notifications.value.forEach(n => n.read = true);
  }
};

const closeNotifications = (event) => {
  if (!event.target.closest('.notification-popup') && 
      !event.target.closest('.notification-wrapper')) {
    showNotificationPopup.value = false;
  }
};

const logout = () => {
  auth.logout();
  router.push('/');
};

// Watchers and lifecycle hooks
watch(
  () => route.name,
  (newRoute) => {
    currentRoute.value = newRoute;
  }
);

onMounted(() => {
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', closeNotifications);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', closeNotifications);
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
                <div class="notification-wrapper">
                  <button 
                    @click.stop="toggleNotifications"
                    class="action-icon"
                    aria-label="Notifications"
                  >
                    <ion-icon name="notifications-outline"></ion-icon>
                    <span v-if="unreadCount > 0" class="notification-badge">
                      {{ unreadCount }}
                    </span>
                  </button>
                  
                  <div v-if="showNotificationPopup" class="notification-popup">
                    <div class="notification-header">
                      <h3 class="headersb2">Notifikasi</h3>
                      <button 
                        @click.stop="showNotificationPopup = false" 
                        class="close-btn"
                      >
                        <ion-icon name="close-outline"></ion-icon>
                      </button>
                    </div>
                    
                    <div class="notification-list">
                      <div 
                        v-for="notification in notifications" 
                        :key="notification.id"
                        class="notification-item"
                        :class="{ 'unread': !notification.read }"
                      >
                        <span v-if="!notification.read" class="unread-dot"></span>
                        <div class="notification-photo">
                          <img 
                            :src="notification.photo" 
                            alt="Foto notifikasi" 
                          />
                        </div>
                        
                        <div class="notification-content">
                          <h4 class="bodyb2">{{ notification.type }}</h4>
                          <p class="bodyr3">{{ notification.message }}</p>
                          <div v-if="notification.type === 'Izin' && notification.reason" class="reason-box">
                            <div class="reason-label">Alasan Izin:</div>
                            <div class="reason-text bodyr3">{{ notification.reason }}</div>
                          </div>
                          <span class="notification-time bodyr3">
                            {{ notification.time }}
                          </span>
                          
                          <div 
                            v-if="notification.type === 'Jadwal'" 
                            class="notification-actions"
                          >
                            <n-button 
                              size="small"
                              @click.stop="goToSchedule(notification.scheduleId)"
                              class="schedule-button buttonm4"
                              round
                            >
                              Lihat Jadwal
                            </n-button>
                          </div>
                        </div>
                      </div>

                      <div 
                        v-if="notifications.length === 0" 
                        class="empty-notifications"
                      >
                        Tidak ada notifikasi
                      </div>
                    </div>
                    
                    <router-link 
                      to="/notification" 
                      class="view-all"
                      @click.stop="showNotificationPopup = false"
                    >
                      Lihat Semua Notifikasi
                    </router-link>
                  </div>
                </div>
                
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
            <div class="mobile-auth-actions" v-if="auth.isLoggedIn">
              <div class="user-actions">
                <div class="notification-wrapper">
                  <button 
                    @click.stop="toggleNotifications"
                    class="action-icon"
                    aria-label="Notifications"
                  >
                    <ion-icon name="notifications-outline"></ion-icon>
                    <span v-if="unreadCount > 0" class="notification-badge">
                      {{ unreadCount }}
                    </span>
                  </button>
                  
                  <div v-if="showNotificationPopup" class="notification-popup">
                    <div class="notification-header">
                      <h3 class="headersb2">Notifikasi</h3>
                      <button 
                        @click.stop="showNotificationPopup = false" 
                        class="close-btn"
                      >
                        <ion-icon name="close-outline"></ion-icon>
                      </button>
                    </div>
                    
                    <div class="notification-list">
                      <div 
                        v-for="notification in notifications" 
                        :key="notification.id"
                        class="notification-item"
                        :class="{ 'unread': !notification.read }"
                      >
                        <div class="notification-photo">
                          <img 
                            :src="notification.photo" 
                            alt="Foto notifikasi" 
                          />
                        </div>
                        
                        <div class="notification-content">
                          <h4 class="bodyb2">{{ notification.type }}</h4>
                          <p class="bodyr3">{{ notification.message }}</p>
                          <div v-if="notification.type === 'Izin' && notification.reason" class="reason-box">
                            <div class="reason-label">Alasan Izin:</div>
                            <div class="reason-text bodyr3">{{ notification.reason }}</div>
                          </div>
                          <span class="notification-time bodyr3">
                            {{ notification.time }}
                          </span>
                          
                          <div 
                            v-if="notification.type === 'Jadwal'" 
                            class="notification-actions"
                          >
                            <n-button 
                              size="small" 
                              @click.stop="goToSchedule(notification.scheduleId)"
                              class="schedule-button"
                            >
                              Lihat Jadwal
                            </n-button>
                          </div>
                        </div>
                      </div>

                      <div 
                        v-if="notifications.length === 0" 
                        class="empty-notifications"
                      >
                        Tidak ada notifikasi
                      </div>
                    </div>
                    
                    <router-link 
                      to="/notification" 
                      class="view-all"
                      @click.stop="showNotificationPopup = false"
                    >
                      Lihat Semua Notifikasi
                    </router-link>
                  </div>
                </div>
                
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
            </div>
            <n-menu
              mode="vertical"
              :options="filteredMenuOptions"
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
/* Layout and structure */
.navbar {
  --navbar-height: 68px;
  --navbar-padding-x:  8rem;
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
  padding: 0 var(--navbar-padding-x);
}

.navbar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

.menu-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Poppins', sans-serif;
  height: 100%;
}

/* Logo styles */
.logo {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo img {
  height: 56px;
  object-fit: contain;
}

/* Menu divider */
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
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.action-icon:hover {
  color: var(--icon-hover-color);
}

ion-icon {
  font-size: 24px;
}

/* Notification styles */
.notification-wrapper {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-popup {
  width: 400px; 
  position: absolute;
  top: 100%;
  right: 0;
  max-height: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-header h3 {
  color: #154484;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 20px;
  display: flex;
  align-items: center;
  padding: 4px;
}

.notification-list {
  overflow-y: auto;
  flex-grow: 1;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.notification-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-content {
  flex-grow: 1;
  min-width: 0;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.unread {
  background-color: #f8f9ff;
}

.notification-content h4 {
  margin: 0 0 4px 0;
  color: #154484;
}

.notification-content p {
  margin: 0 0 4px 0;
  color: #555;
}

.notification-time {
  color: #999;
}

.empty-notifications {
  padding: 16px;
  text-align: center;
  color: #999;
}

.view-all {
  display: block;
  text-align: center;
  padding: 12px;
  font-size: 13px;
  color: #154484;
  text-decoration: none;
  border-top: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.view-all:hover {
  background-color: #f5f5f5;
}

/* Notification actions */
.notification-actions {
  margin-top: 8px;
}

.schedule-button {
  background-color: #154484;
  color: white;
  padding: 4px 8px;
}

.schedule-button:hover {
  background-color: #1a56b4;
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

.reason-box {
  margin-top: 8px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #154484;
}

.reason-label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}

.reason-text {
  color: #333;
  line-height: 1.4;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .menu-divider {
    margin: 0 0.5rem;
  }

  .navbar {
    padding: 0 2rem;
  }
  
  .notification-popup {
    width: 90vw;
    max-width: 350px;
    left: 50%; 
    right: auto; 
    transform: translateX(-50%);
    top: 60px; 
    position: fixed; 
  }
  @keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
}
</style>
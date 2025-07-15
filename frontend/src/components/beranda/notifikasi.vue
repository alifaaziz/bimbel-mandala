<script setup>
import { ref, computed, onMounted } from 'vue';

const showNotificationPopup = ref(false);
const notifications = ref([]);
const isLoggedIn = ref(!!localStorage.getItem('token'));

function formatNotifTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now - date;
  if (diff < 86400000) {
    return dateStr.slice(11, 16);
  }
  return date.toLocaleDateString('id-ID');
}

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

async function fetchNotifications() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/notification', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const result = await res.json();
    notifications.value = (result.data || []).map(item => ({
      id: item.id,
      type: item.type === 'Perubahan Jadwal' ? 'Jadwal' : item.type,
      message: item.description,
      read: item.viewed,
      createdAt: item.createdAt,
      photo: item.photo
        ? (item.photo.startsWith('http') ? item.photo : `${item.photo}`)
        : '/mandala.png',
      reason: item.reason,
      scheduleId: item.scheduleId
    }));
  } catch (err) {
    notifications.value = [];
  }
}

const notificationsWithTime = computed(() =>
  notifications.value.map(item => ({
    ...item,
    time: formatNotifTime(item.createdAt)
  }))
);

function toggleNotifications() {
  showNotificationPopup.value = !showNotificationPopup.value;
  if (!showNotificationPopup.value) {
    fetchNotifications();
  } else {
    notifications.value.forEach(n => n.read = true);
  }
}

onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <div>
    <n-float-button
      class="custom-float-btn"
      position="fixed"
      :right="40"
      :bottom="40"
      style="z-index: 2000;"
      @click="toggleNotifications"
      v-if="isLoggedIn"
    >
      <n-badge :value="unreadCount" :offset="[6, -8]">
        <n-icon>
          <img src="@/assets/icons/bell_orange.svg" alt="Bell Icon" />
        </n-icon>
      </n-badge>
    </n-float-button>

    <div v-if="showNotificationPopup" class="notification-popup-float">
      <div class="notification-header">
        <h3 class="headersb2">Notifikasi</h3>
        <button @click="showNotificationPopup = false" class="close-btn">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      <div class="notification-list">
        <div 
          v-for="notification in notificationsWithTime" 
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
        >
          <span v-if="!notification.read" class="unread-dot"></span>
          <div class="notification-photo">
            <img :src="notification.photo" alt="Foto notifikasi" />
          </div>
          <div class="notification-content">
            <h4 class="bodyb2">{{ notification.type }}</h4>
            <p class="bodyr3" v-html="notification.message"></p>
            <div v-if="notification.type === 'Izin' && notification.reason" class="reason-box">
              <div class="reason-label">Alasan Izin:</div>
              <div class="reason-text bodyr3">{{ notification.reason }}</div>
            </div>
            <span class="notification-time bodyr3">
              {{ notification.time }}
            </span>
          </div>
        </div>
        <div v-if="notifications.length === 0" class="empty-notifications">
          Tidak ada notifikasi
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-float-btn {
  width: 52px !important;
  height: 52px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FB8312;
}
.n-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.n-icon img {
  display: block;
  margin: 0 auto;
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* Notification popup styling */
.notification-popup-float {
  width: 350px;
  position: fixed;
  bottom: 100px;
  right: 40px;
  max-height: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 3000;
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
.unread-dot {
  width: 8px;
  height: 8px;
  background: #FF4757;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  margin-top: 8px;
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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
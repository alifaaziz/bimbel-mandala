<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <component :is="layout">
      <router-view />
    </component>
  </n-config-provider>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Main from './Main.vue';
import Auth from './MasukDaftar.vue';
import { NConfigProvider } from 'naive-ui'

const route = useRoute();

const layout = computed(() => {
  if (route.path.startsWith('/Auth')) {
    return Auth;
  } else {
    return Main;
  }
});

const themeOverrides = {
  common: {
    primaryColor: '#154484', // ganti dengan warna utama kamu
    primaryColorHover: '#103364',
    primaryColorPressed: '#103364',
    primaryColorSuppl: '#103364'
  }
}
</script>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Main from './Main.vue';
import Auth from './MasukDaftar.vue';
import Jadwal from './components/Jadwal.vue';
import { NConfigProvider, NMessageProvider } from 'naive-ui';

const route = useRoute();

const layout = computed(() => {
  if (route.path.startsWith('/Auth')) {
    return Auth;
  } 
  else if (route.path.startsWith('/Jadwal')) {
    return Jadwal;
  } 
  else {
    return Main;
  }
});

const themeOverrides = {
  common: {
    primaryColor: '#154484',
    primaryColorHover: '#103364',
    primaryColorPressed: '#103364',
    primaryColorSuppl: '#103364'
  }
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <component :is="layout">
        <router-view />
      </component>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Main from './Main.vue';
import Auth from './Auth.vue';
import Jadwal from './components/Jadwal.vue';

import Otp from './components/Auth/otp.vue';
import ResetPassword from './components/Auth/ResetPassword.vue';

import ProfileUser from './components/ProfileUser.vue';
import DetailJadwal from './components/jadwal/DetailJadwal.vue'
import { NConfigProvider, NMessageProvider } from 'naive-ui';

const route = useRoute();

const layout = computed(() => {
  if (route.path.startsWith('/auth')) {
    return Auth;
  } 
  else if (route.path.startsWith('/otp')) {
    return Otp;
  } 
  else if (route.path.startsWith('/resetpassword')) {
    return ResetPassword;
  } 
  else if (route.path.startsWith('/jadwal')) {
    return Jadwal;
  } 
  else if (route.path.startsWith('/detailjadwal')) {
    return DetailJadwal;
  } 
  else if (route.path.startsWith('/profileuser')) {
    return ProfileUser;
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


<style>
#app {
  background-color: #ffffff;
}
</style>
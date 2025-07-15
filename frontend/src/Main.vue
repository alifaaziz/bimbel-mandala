<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import navbar from './components/navbar.vue';

const isAdmin = ref(false)
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    isLoading.value = false
    return
  }
  try {
    const res = await fetch('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      isAdmin.value = data.data?.role === 'admin'
      if (isAdmin.value && router.currentRoute.value.path !== '/dashboardadmin') {
        router.replace('/dashboardadmin')
        return
      }
    } else {
      localStorage.removeItem('token')
    }
  } catch (e) {
    localStorage.removeItem('token')
  }
  isLoading.value = false
})
</script>

<template>
  <div class="Main">
    <navbar v-if="!isAdmin && !isLoading"/>
    <router-view />
  </div>
</template>

<script>
export default {
  watch: {
    $route(to, from) {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
.Main {
  max-width: 100%;
  margin-top: 32px;
  background-color: white; 
}
</style>


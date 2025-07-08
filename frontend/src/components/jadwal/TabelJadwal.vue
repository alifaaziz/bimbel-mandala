<script setup>
import { ref, onMounted } from 'vue'
import navbarJadwal from './navbarJadwal.vue'
import JadwalUser from './JadwalUser.vue'
import JadwalTutor from './JadwalTutor.vue'
import Footer from '../footer.vue'

const isTutor = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  const res = await fetch('http://localhost:3000/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (res.ok) {
    const data = await res.json()
    isTutor.value = data.data?.role === 'tutor'
  }
})
</script>

<template>
  <navbarJadwal />
  <div class="padding-components">
    <JadwalTutor v-if="isTutor" />
    <JadwalUser v-else />
  </div>
  <Footer />
</template>
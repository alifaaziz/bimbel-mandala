<script setup>
import { ref, onMounted } from 'vue'
import topSearchBar from './topSearchBar.vue'
import Rekomendasi from './Rekomendasi.vue'
import PalingPopuler from './PalingPopuler.vue'
import seluruhProgram from './SeluruhProgram.vue'
import Footer from '../footer.vue'

// State untuk memeriksa apakah user adalah siswa
const isStudent = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch('http://localhost:3000/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.ok) {
      const data = await res.json()
      isStudent.value = data.data?.role === 'siswa' // sesuaikan dengan nama role di backend kamu
    }
  } catch (err) {
    console.error('Error fetching user data:', err)
  }
})
</script>

<template>
  <div class="padding-components">
    <topSearchBar />
    <Rekomendasi v-if="isStudent" />
    <PalingPopuler />
    <!-- <mostPopular /> -->
    <seluruhProgram />
  </div>
  <Footer />
</template>

<style scoped>
.padding-components {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-bottom: 4rem;
}
</style>

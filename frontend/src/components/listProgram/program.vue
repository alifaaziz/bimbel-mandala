<script setup>
import { ref, onMounted } from 'vue'
import topSearchBar from './topSearchBar.vue'
import Rekomendasi from './Rekomendasi.vue'
import PalingPopuler from './PalingPopuler.vue'
import seluruhProgram from './SeluruhProgram.vue'
import Footer from '../footer.vue'

const isTutor = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  const res = await fetch('/users/me', {
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
  <div class="padding-components">
    <div>
      <topSearchBar v-if="!isTutor" />
    </div>
    <div v-if="!isTutor">
      <Rekomendasi />
    </div>
    <PalingPopuler v-if="!isTutor"/>
    <seluruhProgram />
  </div>
  <Footer />
</template>

<style scoped>
.padding-components {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 3rem;
  padding-top: 3rem;
}
</style>

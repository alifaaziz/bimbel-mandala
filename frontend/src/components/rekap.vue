<script setup>
import { ref, onMounted } from 'vue'
import StatisticProgram from '@/components/rekap/StatisticProgram.vue'
import RekapDetail from '@/components/rekap/RekapDetail.vue'
import RekapDetailTutor from '@/components/rekap/RekapDetailTutor.vue'
import Footer from '@/components/footer.vue'

const isTutor = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const res = await fetch('http://localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    isTutor.value = data.data?.role === 'tutor'
  } catch (err) {
    isTutor.value = false
  }
})
</script>

<template>
    <div class="padding-components">
        <StatisticProgram />
    </div>
    <div class="rekap-container padding-components">
        <RekapDetailTutor v-if="isTutor" />
        <RekapDetail v-else />
    </div>
    <Footer />
</template>

<style scoped>
.rekap-container{
    padding-bottom: 2rem;
    padding-top: 2rem;
}
.template{
    background-color: white;
}
</style>
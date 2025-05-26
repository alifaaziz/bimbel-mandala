<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const isNew = params.get('new')
  if (token) {
    localStorage.setItem('token', token)
    if (isNew) {
      router.replace('/')
    } else {
      router.replace('/absen')
    }
  } else {
    alert('Login Google gagal.')
    router.replace('/login')
  }
})
</script>

<template>
  <div>Memproses login Google...</div>
</template>
<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonm3"
          round
          @click="goToEditProfile"
        >
          <img src="@/assets/icons/edit.svg" alt="">
          Edit Profile
        </n-button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const userRole = ref('siswa')

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const res = await fetch('localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    userRole.value = data.data?.role || 'siswa'
  } catch (err) {
    userRole.value = 'siswa'
  }
})

const goToEditProfile = () => {
  if (userRole.value === 'tutor') {
    router.push('/profileuser/editprofiletutor')
  } else {
    router.push('/profileuser/editprofile')
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  height: 2.5rem; 
}

.button-container .custom-button {
  color: #154484;
  border: 2px solid #154484;
  padding: 10px 1rem;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button img {
  margin-right: 0.5rem;
  height: 16px;
} 

.custom-button:hover {
  background-color: #DEE4EE; 
  cursor: pointer;
}
</style>
<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonm3"
          round
          @click="$router.push('/profileuser/editprofile')"
        >
          <img src="@/assets/icons/edit.svg" alt="">
          Edit Profile
        </n-button>
    </div>
</template>

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
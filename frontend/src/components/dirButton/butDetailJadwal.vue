<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonm4"
          tertiary
          round
          @click="$router.push('/#')"
        >
          Detail
        </n-button>
    </div>
</template>

<style scoped>
.button-container {
  display: flex;
  height: 2rem; 
  align-items: center;
}

.custom-button {
  background-color: #154484;
  color: white;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
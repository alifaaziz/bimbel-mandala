<script setup>

</script>

<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonb2"
          tertiary
          round
          @click="$router.push({ path: '/auth', query: { tab: 'signup' } })"
        >
          Daftar
        </n-button>
    </div>
</template>

<style scoped>
.button-container {
  display: flex;
  height: 2.5rem; 
}

.custom-button {
  background-color: white;
  color: #154484;
  padding: 10px 20px;
  transition: all 0.3s ease;
  border: 1px solid #154484;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
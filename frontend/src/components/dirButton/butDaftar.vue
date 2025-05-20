<script setup>

</script>

<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonb2"
          tertiary
          round
          @click="$router.push('/#')"
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
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #9BAFCB; 
  cursor: pointer;
}
</style>
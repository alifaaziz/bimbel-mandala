<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonb2"
          tertiary
          round
          @click="$emit('click')"
        >
          Simpan Perubahan
        </n-button>
    </div>
</template>

<style scoped>
.button-container {
  display: flex;
  height: 100%;
  margin: 1rem 0;
}

.custom-button {
  background-color: #154484;
  color: white;
  padding: 10px 4rem;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
<template>
    <div>
        <n-button
          class="custom-button buttonm3"
          tertiary
          round
        >
          {{ label }}
        </n-button>
    </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Submit'
  }
});
</script>

<style scoped>
.button-container {
  display: flex;
  height: 2.5rem; 
}

.custom-button {
  color: #154484;
  border: 1px solid #154484;
  padding: 10px 2rem;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
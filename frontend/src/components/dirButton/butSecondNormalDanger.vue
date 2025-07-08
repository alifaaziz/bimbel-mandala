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
  color: red;
  border: 1px solid red;
  padding: 10px 2rem;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: maroon; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
<template>
    <div>
        <n-button
          class="custom-button buttonm1"
          tertiary
          round
          @click="$emit('click')"
        >
          {{ label }}
        </n-button>
    </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Primer Huge'
  }
});
</script>

<style scoped>
.button-container {
  display: flex;
}

.custom-button {
  background-color: #154484;
  color: #DEE4EE;
  border: 1px solid #154484;
  border-radius: 2rem;
  height: 48px;
  padding: 0 2rem;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
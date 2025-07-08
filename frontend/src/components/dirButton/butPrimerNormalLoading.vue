<template>
    <div>
        <n-button
          class="custom-button buttonm3"
          tertiary
          round
          :disabled="loading"
        >
          <template v-if="loading">
            <span class="spinner"></span>
            Memproses
          </template>
          <template v-else>
            {{ label }}
          </template>
        </n-button>
    </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Submit'
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.button-container {
  display: flex;
  height: 2.5rem; 
}

.custom-button {
  background-color: #154484;
  color: #DEE4EE;
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

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #DEE4EE;
  border-top: 2px solid #154484;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
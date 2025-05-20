<template>
    <div class="button-container">
        <n-button
          class="custom-button buttonb2"
          tertiary
          round
          @click="navigateToDetailProgram"
        >
          Kenali Lebih Jauh
        </n-button>
    </div>
</template>

<script>
export default {
  methods: {
    navigateToDetailProgram() {
      this.$router.push('/tentangkami');
    }
  }
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  height: 100%; 
}

.custom-button {
  background-color: #154484;
  color: white;
  padding: 10px 20px;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}
</style>
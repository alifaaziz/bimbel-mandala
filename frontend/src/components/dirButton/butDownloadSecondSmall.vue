<template>
  <div>
    <n-button
      class="custom-button buttonm3"
      tertiary
      round
      @click="$emit('click')"
    >
      <span style="margin-right: 8px;">{{ label }}</span>
      <img
        src="@/assets/download.svg"
        alt="Download"
        class="icon-download"
      />
    </n-button>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Donwload Rekap',
  }
});
</script>

<style scoped>
.button-container {
  display: flex;
}

.custom-button {
  color: #154484;
  border: 1px solid #154484;
  background-color: #e8f5e9;
  padding: 10px 2rem;
  transition: all 0.3s ease;
  border-radius: 25px;
  display: flex;
  align-items: center;
}

.custom-button:hover {
  background-color: #0B2343; 
  color: #e8f5e9;
  cursor: pointer;
}

.custom-button:active,
.custom-button:focus {
  background-color: #e8f5e9 !important;
  color: #154484 !important;
  outline: none;
  box-shadow: none;
}

.icon-download {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  display: inline-block;
}
</style>
<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <img alt="Logo Mandala" class="logo" src="../assets/logomandala.svg" width= 184px />
    <h1 class="Hero">{{ msg }}</h1>
    <h3>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Vulputate ut laoreet velit ma.
    </h3>
  </div>
</template>

<style scoped>
h3 {
  font-size: 1rem;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.logo {
  display: block;
  margin-bottom: 120px;
}
</style>

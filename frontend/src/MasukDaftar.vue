<script setup>
import HelloWorld from './components/HelloWorld.vue'
import LoginCom from './components/logincom.vue'
</script>

<template>

  <!-- Header dengan componen dan msg  -->
  <header>
      <!-- Background -->
    <div class="background"></div>
    <div class="wrapper">
      <HelloWorld msg="Selamat Datang di Mandala!" />
    </div>
  </header>

  <!-- main pake componen form -->
  <main>
    <LoginCom />
  </main>
</template>

<style scoped>

  header {
    line-height: 1.5;
  }

  .logo {
    display: block;
    margin: 0 auto 1rem;
  }

  @media (min-width: 982px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
      min-height: 0;
    }
  }
</style>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-image: url('./assets/bg.jpg');
  background-size: cover;
  background-position: 20% center;
  z-index: -1;
  filter: brightness(0.5);
}

@media (max-width: 982px) {
  .background {
    width: 100%;
    height: 100%;
  }
}

#template {
    display: grid;
    grid-template-columns: 1fr 1fr; 
    padding: 0 2rem;
  }
</style>
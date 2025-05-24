<script setup>
import { ref } from 'vue';
import LoginForm from './components/Auth/LoginForm.vue';
import SignupForm from './components/Auth/SignupForm.vue';

const showLogin = ref(true);

const toggleForm = () => {
  showLogin.value = !showLogin.value;
};
</script>

<template>
  <div class="container-auth">
    <!-- Left Side: Background dan Text dinamis -->
    <div :class="['left-side', showLogin ? 'login-bg' : 'signup-bg']">
      <div class="overlay">
        <router-link to="/">
          <img src="./assets/logomandala.svg" alt="Mandala Logo" class="logo" />
        </router-link>
        <div>
          <h1 class="headlineb1 welcoming-text">
            {{ showLogin ? 'Selamat Datang di Mandala!' : 'Selamat Datang di Mandala!' }}
          </h1>
          <p class="bodyr2">
            {{ showLogin 
              ? 'Kami senang Anda kembali. Masuk untuk melanjutkan dengan lebih banyak pengalaman seru.'
              : 'Daftar sekarang dan rasakan berbagai kemudahan dalam belajar bersama kami!' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="right-side">
      <div class="form-container">
        <LoginForm v-if="showLogin" @toggle-form="toggleForm" />
        <SignupForm v-else @toggle-form="toggleForm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-auth {
  display: flex;
  height: 100vh;
}

/* Left Side Umum */
.left-side {
  flex: 1;
  position: relative;
}

.welcoming-text {
  margin-bottom: 1rem;
}

/* Background untuk Login */
.login-bg {
  background: url('./assets/login.jpg') no-repeat 20% center/cover;
}

/* Background untuk Signup */
.signup-bg {
  background: url('./assets/signup.png') no-repeat right center/cover;
}

/* Overlay hitam setengah transparan */
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8rem;
}

/* Logo */
.logo {
  width: 200px;
  margin-bottom: 2rem;
}

/* Text di overlay */
.overlay h1 {
  color: #ffffff;
}

.overlay p {
  color: #ffffff;
}

/* Right Side */
.right-side {
  flex: 1;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

/* Container form */
.form-container {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 768px) {
  .container-auth {
    flex-direction: column;
    height: auto;
  }

  .left-side,
  .right-side {
    flex: none;
    width: 100%;
    min-height: 300px;
  }

  .left-side {
    min-height: 200px;
    background-position: center center !important;
  }

  .overlay {
    gap: 2rem;
    padding: 1.5rem;
    align-items: center;
    text-align: center;
  }

  .logo {
    width: 150px;
    margin-bottom: 1rem;
  }

  .form-container {
    max-width: 100%;
    padding: 0 1rem;
  }
}
</style>

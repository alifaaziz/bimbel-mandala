<script>
export default {
  name: "ResetPassword_Email",
  data() {
    return {
      email: "",
      error: "",
      success: "",
      loading: false,
    };
  },
  methods: {
    async submitEmail() {
      this.error = "";
      this.success = "";
      if (!this.validateEmail(this.email)) {
        this.error = "Format email tidak valid.";
        return;
      }
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/auth/password-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 
            errorData.error?.message || 
            "Gagal mengirim token. Pastikan email terdaftar."
          );
        }

        this.success = "Token reset password telah dikirim ke email Anda.";
        setTimeout(() => {
          this.$router.push("/auth");
        }, 1200);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    validateEmail(email) {
      // Validasi email sederhana
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
  },
};
</script>

<template>
  <div class="reset-password-page-center">
    <div class="reset-password-email">
      <h2 class="headersb1">Konfirmasi Email untuk Reset Password</h2>
      <form @submit.prevent="submitEmail">
        <label class="bodyr2" for="email">Masukkan Email Anda:</label>
        <input
          class="bodyr2"
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="contoh@email.com"
        />
        <span v-if="error" class="error">{{ error }}</span>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Mengirim...' : 'Kirim Token Reset' }}
        </button>
        <span v-if="success" class="success">{{ success }}</span>
      </form>
    </div>
  </div>
</template>

<style scoped>
.reset-password-page-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f7f9fb;
}
.reset-password-email {
  max-width: 400px;
  margin-top: 60px;
  margin-bottom: auto;
  background: #fff;
  padding: 32px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(21, 68, 132, 0.07);
}
.headersb1 {
  text-align: left;
  color: #154484;
  margin-bottom: 2rem;
}
.bodyr2 {
  color: #061222;
}
label {
  display: block;
  margin-bottom: 8px;
}
input[type="email"] {
  width: 100%;
  border: 1px solid #dfe2e5;
  border-radius: 2rem;
  padding: 8px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
button {
  padding: 8px 16px;
  background-color: #154484;
  color: #fff;
  border: none;
  border-radius: 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
button:disabled {
  background-color: #b0b8c1;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #0d2c5a;
  box-shadow: 0 2px 8px rgba(21, 68, 132, 0.15);
}
.error {
  color: red;
  display: block;
  margin-bottom: 8px;
}
.success {
  color: green;
  display: block;
  margin-top: 8px;
}
</style>
<template>
  <div class="hari-mengajar">
    <h2 class="title">Hari aktif</h2>
    <div class="days">
      <button 
        v-for="(day, index) in days" 
        :key="index" 
        :class="['day-button', { active: selectedDays.includes(day) }]"
        @click="toggleDay(day)"
      >
        {{ day }}
      </button>
    </div>
    <div class="actions">
      <button class="btn-primary">Daftar Sebagai Tutor</button>
      <button class="btn-secondary">Batal Edit</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"],
      selectedDays: ["Senin", "Rabu", "Jum'at"], // Contoh hari yang dipilih
    };
  },
  methods: {
    toggleDay(day) {
      if (this.selectedDays.includes(day)) {
        this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
        this.selectedDays.push(day);
      }
    },
  },
};
</script>

<style scoped>
.hari-mengajar {
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #154484;
  margin-bottom: 1rem;
  text-align: left; /* Membuat teks rata kiri */
}

.days {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.day-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #154484;
  border-radius: 20px;
  background-color: white;
  color: #154484;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-button.active {
  background-color: #154484;
  color: white;
}

.day-button:hover {
  background-color: #154484;
  color: white;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  background-color: #154484;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0d3468;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #154484;
  background-color: white;
  border: 1px solid #154484;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #f0f4ff;
}
</style>
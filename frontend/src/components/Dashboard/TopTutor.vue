<template>
  <div class="top-tutor-card">
    <h2 class="headerb2 card-title">Top Tutor</h2>

    <div class="bodysb1 list-header">
      <span class="header-label name-label">Nama</span>
      <span class="header-label completed-label">P. Selesai</span>
    </div>

    <ul class="bodyr2 tutor-list">
      <li v-for="tutor in tutors" :key="tutor.id || tutor.name" class="tutor-item">
        <span class="tutor-name">{{ tutor.name }}</span>
        <span class="tutor-completed-count">{{ tutor.completedPrograms }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopTutorList',
  data() {
    return {
      tutors: [], // Data tutor akan diisi dari API
    };
  },
  methods: {
    async fetchTopTutors() {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login kembali.');
        }
        const response = await fetch('localhost:3000/users/tutors', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Ambil 4 tutor teratas berdasarkan classCount
        this.tutors = result.data
          .sort((a, b) => b.classCount - a.classCount) // Urutkan berdasarkan classCount (desc)
          .slice(0, 5) // Ambil 4 teratas
          .map(tutor => ({
            name: tutor.name,
            completedPrograms: tutor.classCount, // Map classCount ke completedPrograms
          }));
      } catch (error) {
        console.error('Error fetching top tutors:', error);
        alert('Gagal mengambil data tutor.');
      }
    },
  },
  mounted() {
    this.fetchTopTutors(); // Panggil fetch saat komponen dimuat
  },
};
</script>

<style scoped>
.top-tutor-card {
  background-color: #ffffff;
  border-radius: 12px; /* Rounded corners for the card */
  padding: 24px;
  max-width: 360px; /* Maximum width of the card */
}

.card-title {
  color: #1e3a8a; /* Warna biru tua untuk judul */
  margin-bottom: 20px; /* Jarak bawah dari judul ke daftar */
}

.list-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px; /* Space below header text */
  margin-bottom: 6px; /* Space between header and first list item */
}

.header-label {
  color: #154484; /* Dark navy blue for header labels */
}

.name-label {
  flex-grow: 1; /* Allows 'Nama' to take available space */
}

.completed-label {
  flex-basis: 90px; /* Consistent width for the 'P. Selesai' column header */
  text-align: right;
}

.tutor-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tutor-item {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Vertically aligns name and count */
  padding: 10px 0; /* Vertical spacing for each tutor item */
  border-bottom: 1px solid #f0f2f5; /* Light separator line */
}

.tutor-item:last-child {
  border-bottom: none; /* No border for the last item */
}

.tutor-name {
  color: #061222; /* Dark gray for tutor names for readability */
}

.tutor-completed-count {
  flex-basis: 90px; /* Consistent width for the count, aligning with header */
  text-align: right;
  color: #426EB9; /* Distinct blue for the counts */
}
</style>
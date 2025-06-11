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
      tutors: [
        { id: 1, name: 'Pak Dendy Wan S.Pd', completedPrograms: 12 },
        { id: 2, name: 'Bu Susi Wati S.Pd', completedPrograms: 7 },
        { id: 3, name: 'Pak Wahyu Hendi S.Pd', completedPrograms: 6 },
        { id: 4, name: 'Bu Luna S.Pd', completedPrograms: 5 },
        { id: 5, name: 'Pak Indra Jaya S.Pd', completedPrograms: 2 },
      ],
    };
  },
};
</script>

<style scoped>
.top-tutor-card {
  background-color: #ffffff;
  border-radius: 20px; /* Rounded corners for the card */
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
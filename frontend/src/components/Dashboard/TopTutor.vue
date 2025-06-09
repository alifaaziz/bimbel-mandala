<template>
  <div class="top-tutor-card">
    <h2 class="card-title">Top Tutor</h2>

    <div class="list-header">
      <span class="header-label name-label">Nama</span>
      <span class="header-label completed-label">P. Selesai</span>
    </div>

    <ul class="tutor-list">
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
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); /* Soft shadow for depth */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 360px; /* Maximum width of the card */
  margin: 20px auto; /* Centering the card for display */
}

.card-title {
  font-size: 1.8rem; /* e.g., 28px */
  font-weight: bold;
  color: #0B2A4F; /* Dark navy blue for the title */
  margin-bottom: 20px; /* Space below the title */
}

.list-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px; /* Space below header text */
  margin-bottom: 6px; /* Space between header and first list item */
}

.header-label {
  font-size: 1rem; /* e.g., 16px */
  font-weight: bold;
  color: #0B2A4F; /* Dark navy blue for header labels */
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
  flex-grow: 1; /* Allows tutor name to take available space */
  font-size: 0.95rem; /* e.g., 15px */
  color: #2d3748; /* Dark gray for tutor names for readability */
}

.tutor-completed-count {
  flex-basis: 90px; /* Consistent width for the count, aligning with header */
  text-align: right;
  font-size: 0.95rem; /* e.g., 15px */
  color: #426EB9; /* Distinct blue for the counts */
  font-weight: 500; /* Medium weight for emphasis */
}
</style>
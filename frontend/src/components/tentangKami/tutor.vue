<script setup>
import { ref, onMounted } from 'vue';
import { NCard } from 'naive-ui';

const tutors = ref([]);

const fetchTutors = async () => {
  try {
    const response = await fetch('localhost:3000/users/tutors'); 
    const data = await response.json();
    tutors.value = data.data;
  } catch (error) {
    console.error('Error fetching tutors:', error);
  }
};

onMounted(() => {
  fetchTutors();
});
</script>

<template>
  <div class="header-container">
    <h1 class="headerr2 title1">Berbagai</h1>
    <h2 class="headerb1 title2">Tutor Profesional</h2>
  </div>
  <div class="card-container">
    <n-card
      v-for="(item, index) in tutors"
      :key="item.id"
      :id="item.id"
    >
      <template #header>
        <div class="headersb3 name">
          {{ item.name }}
          <div class="bodyr4 caption">{{ item.subject }} - {{ item.teachLevel }}</div>
        </div>
      </template>
      <template #cover>
        <img :src="item.photo ? `${item.photo}` : 'tutor/Tutor_Default.png'" alt="Card Image">
      </template>
      <div class="bodyr3 content">
        {{ item.description }}
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.header-container {
  align-items: center;
  margin-bottom: 2rem;
}
.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 0 8rem;
}

.n-card {
  max-width: 100%;
  border-radius: 20px;
}

.n-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 20px;
}

.name {
  color: #154484;
  text-align: left;
}
.caption {
  color: #9BAFCB;
  text-align: left;
}
.content {
  color: #9BAFCB;
}

.title1 {
  color: #FDC998 !important;
  text-align: center;
}
.title2 {
  color: #154484;
  text-align: center;
  margin-bottom: 12px;
}

@media (max-width: 960px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 2rem;
  }
}
</style>
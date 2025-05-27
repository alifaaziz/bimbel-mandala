<template>
    <div class="program-card">
        <div class="card-header headerb3">Skema Honor Tutor</div>
      <div class="card-body">
        <div class="col-skema">
            <h3 class="headersb4">Privat</h3>
            <div class="detail-skema">
                <div>
                    <span class="bodysb3">Rpxxx.xxx</span>
                </div>
            </div>
        </div>
        <div class="col-skema">
            <h3 class="headersb4">Kelompok 2 Siswa</h3>
            <div class="detail-skema">
                <div>
                    <span class="bodysb3">Rpxxx.xxx</span>
                </div>
            </div>
        </div>
        <div class="col-skema">
            <h3 class="headersb4">Kelompok 3 Siswa</h3>
            <div class="detail-skema">
                <div>
                    <span class="bodysb3">Rpxxx.xxx</span>
                </div>
            </div>
        </div>
        <div class="col-skema">
            <h3 class="headersb4">Kelompok 4 Siswa</h3>
            <div class="detail-skema">
                <div>
                    <span class="bodysb3">Rpxxx.xxx</span>
                </div>
            </div>
        </div>
        <div class="col-skema">
            <h3 class="headersb4">Kelompok 5 Siswa</h3>
            <div class="detail-skema">
                <div>
                    <span class="bodysb3">Rpxxx.xxx</span>
                </div>
            </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const programs = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  const res = await fetch('http://localhost:3000/classes/my', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  programs.value = data.data || []
})
</script>
  
<style scoped>
.program-card {
  border: 1px solid #f39c12;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  color: #061222;
}

.card-header {
  background-color: #154288;
  color: white;
  padding: 12px 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-body {
  display: flex;
  flex-direction: row;
  padding: 2rem 3rem;
}

.col-skema {
    max-width: 200px;
    flex: 1;
    margin: 0 auto;
}


.headersb4 {
  color: #154288;
  margin-bottom: 1rem;
}

.detail-skema {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {

}
</style>

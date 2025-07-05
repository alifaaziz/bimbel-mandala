<script setup>
import daftarProgram from '@/components/Dashboard/dashboardProgram/daftarProgram.vue';
import OrderedProgram from '@/components/Dashboard/dashboardProgram/OrderedProgram.vue';
import ProgramSummary from '@/components/Dashboard/dashboardProgram/ProgramSummary.vue';
import ActivePrograms from '@/components/Dashboard/dashboardProgram/ActivePrograms.vue';
</script>

<template>
    <div class="main-content">
        <daftarProgram />
        <div class="right-side">
            <OrderedProgram />
            <ProgramSummary />
            <ActivePrograms />
        </div>
    </div>
</template>

<style setup>
.main-content {
  gap: 8px;
  justify-content: space-between;
  padding: 20px;
  overflow-y: auto;
  background-color: #0B2343;
}
.right-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 280px;
}
</style>
<script setup>
import StatisticProgram from '@/components/rekap/StatisticProgram.vue'
import RekapDetail from '@/components/rekap/RekapDetail.vue'
import RekapDetailTutor from '@/components/rekap/RekapDetailTutor.vue'
import Footer from '@/components/footer.vue'
import { auth, USER_ROLES } from '@/components/Absen/auth.js'

const currentUser = auth.users.find(user => user.isActive);
const isTutor = currentUser && currentUser.role === USER_ROLES.TUTOR;
</script>

<template>
    <div class="padding-components">
        <StatisticProgram />
    </div>
    <div class="rekap-container padding-components">
        <RekapDetailTutor v-if="isTutor" />
        <RekapDetail v-else />
    </div>
    <Footer />
</template>

<style scoped>
.rekap-container{
    padding-bottom: 2rem;
    padding-top: 2rem;
}
.template{
    background-color: white;
}
</style>
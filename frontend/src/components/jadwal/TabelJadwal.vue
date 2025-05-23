<script setup>
import navbarJadwal from './navbarJadwal.vue';
import JadwalUser from './JadwalUser.vue';
import JadwalTutor from './JadwalTutor.vue';
import Footer from '../footer.vue';
import { auth, USER_ROLES } from '@/components/Absen/auth.js'; 

const currentUser = auth.users.find(user => user.isActive);
const isTutor = currentUser && currentUser.role === USER_ROLES.TUTOR;
</script>

<template>
    <navbarJadwal />
    <div class="padding-components">
        <JadwalTutor v-if="isTutor" />
        <JadwalUser v-else />
    </div>
    <Footer />
</template>
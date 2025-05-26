import { createRouter, createWebHistory } from 'vue-router'
import Main from '../Main.vue';
import Home from '../Home.vue'; 
import TentangKami from '../TentangKami.vue';
import DetailProgram from '../detailProgram.vue';
import PendaftaranTutor from '../pendaftaranTutor.vue';
import AbsenSiswa from '../components/Absen.vue';

import Otp from '@/components/Auth/otp.vue';

import Jadwal from '@/components/Jadwal.vue';
import TabelJadwal from '@/components/jadwal/TabelJadwal.vue'
import DetailJadwal from '@/components/jadwal/DetailJadwal.vue'

import ProfileUser from '@/components/ProfileUser.vue'
import User from '@/components/Profile/User.vue'
import EditProfile from '@/components/Profile/EditProfile.vue'
import EditProfileTutor from '@/components/Profile/EditProfileTutor.vue'
import Rekap from '@/components/rekap.vue'

const routes = [
  { 
    path: '/', 
    component: Main,
    children: [
      {
        path: '', 
        name: 'Beranda', 
        component: Home,
      },
      { 
        path: 'detailprogram/:id', 
        name: 'Detail Program', 
        component: DetailProgram 
      },
      { path: 'tentangkami', 
        name: 'Tentang Kami', 
        component: TentangKami 
      },
      { path: 'pendaftarantutor', 
        name: 'Menjadi Tutor', 
        component: PendaftaranTutor 
      },
      { path: 'absen', 
        name: 'Absen', 
        component: AbsenSiswa 
      },
      { path: 'rekap', 
        name: 'Rekap', 
        component: Rekap 
      },
      // { path: 'rekap', 
      //   name: 'Rekap', 
      //   component: RekapSiswa 
      // },
    ]
  },
  {
    path: '/otp', 
    component: Otp,
  },
  {
    path: '/jadwal', 
    component: Jadwal,
    children: [
      {
        path: '', 
        name: 'tabeljadwal', 
        component: TabelJadwal,
      },
    ]
  },
  {
    path: '/detailjadwal', 
    component: DetailJadwal,
  },
  { 
    path: '/profileuser', 
    component: ProfileUser,
    children: [
      {
        path: '', 
        name: 'User', 
        component: User,
      },
      { 
        path: 'editprofile', 
        name: 'EditProfile', 
        component: EditProfile 
      },
      { 
        path: 'editprofiletutor', 
        name: 'EditProfileTutor', 
        component: EditProfileTutor
      },
    ]
  },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
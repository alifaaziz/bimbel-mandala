import { createRouter, createWebHistory } from 'vue-router'
import Main from '../Main.vue';
import Home from '../Home.vue'; 
import TentangKami from '../TentangKami.vue';
import DetailProgram from '../detailProgram.vue';

import Program from '@/components/listProgram/program.vue'
import programBelajar from '../components/detailProgram/program.vue'
import PemesananProgram from '../components/detailProgram/PemesananProgram.vue';

import PendaftaranTutor from '../pendaftaranTutor.vue';
import AbsenSiswa from '../components/Absen.vue';

import Otp from '@/components/Auth/otp.vue';
import ResetPassword from '@/components/Auth/ResetPassword.vue';
import ResetPasswordEmail from '@/components/Auth/ResetPassword_Email.vue';
import ResetPasswordPass from '@/components/Auth/ResetPassword_Password.vue';

import Jadwal from '@/components/Jadwal.vue';
import TabelJadwal from '@/components/jadwal/TabelJadwal.vue'
import DetailJadwal from '@/components/jadwal/DetailJadwal.vue'

import ProfileUser from '@/components/ProfileUser.vue'
import User from '@/components/Profile/User.vue'
import EditProfile from '@/components/Profile/EditProfile.vue'
import EditProfileTutor from '@/components/Profile/EditProfileTutor.vue'
import Rekap from '@/components/rekap.vue'
import GoogleSuccess from '@/components/Auth/GoogleSuccess.vue';

import Dashboardadmin from '@/components/Dashboard/DashboardParent.vue';
import HomeAdmin from '@/components/Dashboard/dashboard.vue';
import Siswa from '@/components/Dashboard/dashboardSiswa/siswa.vue';

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
        name: 'DetailProgram', 
        component: DetailProgram,
        children: [
          {
            path: '',
            name: 'ProgramBelaajar',
            component: programBelajar
          },
          {
            path: 'pemesananprogram',
            name: 'PemesananProgram',
            component: PemesananProgram
          }
        ]
      },
      { path: 'tentangkami', 
        name: 'TentangKami', 
        component: TentangKami 
      },
      { path: 'program', 
        name: 'Program', 
        component: Program 
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
    path: '/resetpassword', 
    component: ResetPassword,
    children: [
      {
        path: '',
        name: 'ResetPasswordEmail', 
        component: ResetPasswordEmail
      },
      {
        path: 'passwordbaru',
        name: 'ResetPasswordPass', 
        component: ResetPasswordPass
      }
    ]
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
    path: '/detailjadwal/:slug', 
    component: DetailJadwal,
  },
  {
    path: '/google/success',
    component: GoogleSuccess
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
  {
    path: '/dashboardadmin', 
    component: Dashboardadmin,
    children: [
      {
        path: '',
        name: 'HomeAdmin',
        component: HomeAdmin,
      },
      {
        path: 'siswa',
        name: 'Siswa',
        component: Siswa,
      },
    ]
  }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
export const USER_ROLES = {
  SISWA: 'siswa',
  TUTOR: 'tutor',
};

export const auth = {
  isLoggedIn: true,
  users: [
    {
      nama: 'Arell Saverro',
      jenjang: 'SMA',
      email: 'arell@email.com',
      noWhatsapp: '081904573890',
      noTelpWali: '081298765432',
      sekolah: 'SMA Negeri 100 Semarang',
      jurusan: 'IPA',
      alamat: 'Jl. Merdeka No. 123, Semarang',
      role: USER_ROLES.SISWA,
      isActive: false, 
    },
    {
      nama: 'Dendy Wan, S.Pd',
      gelar: 'S.Pd',
      email: 'namaemail@gmail.com',
      noWhatsapp: '085786234264',
      alamat: 'Jl Sekaran No.05, RT05/04, Gunung Pati, Kota Semarang',
      gender: 'Laki-laki',
      asalKampus: 'Universitas Negeri Semarang',
      prodi: 'Pendidikan Matematika',
      role: USER_ROLES.TUTOR,
      hariAktif: ["Senin", "Selasa"],
      isActive: true,
    }
  ]
}
<template>
    <footer class="footer">
    <img src="../../assets/logomandala.svg" alt="Logo Bimbel Mandala" class="logo" />
      <div class="footer-container">
        <div class="footer-section">
          <h4>Contact us</h4>
          <p>mandala@gmail.com</p>
          <p>+62-0000-0000</p>
          <p>xxx,xxx, Semarang</p>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
  
        <div class="footer-section">
          <h4>Bimbel Mandala</h4>
          <ul>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Profile Tutor</a></li>
            <li><a href="#">Karir</a></li>
            <li><a href="#">Galeri</a></li>
          </ul>
        </div>
  
        <div class="footer-section layanan">
          <h4>Layanan</h4>
          <ul>
            <li><a href="#">Informasi</a></li>
            <li><a href="#">Saran</a></li>
            <li><a href="#">Acara</a></li>
          </ul>
        </div>
      </div>
  
      <div class="footer-bottom">
        <div class="language">
          <i class="fas fa-globe"></i> Indonesia
        </div>
        <div class="copyright">
          Copyright © 2025. All rights reserved.
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // No script logic needed for now.
  </script>
  
  <style scoped>
  .footer {
    background-color: #051329;
    color: #ffffff;
    padding: 3rem 8rem;
    font-family: 'Segoe UI', sans-serif;
    width: 100%; /* Pastikan footer mengambil lebar penuh */
    box-sizing: border-box; /* Memastikan padding tidak memengaruhi ukuran */
  }
  
  .footer-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
    margin-bottom: 30px;
  }
  
  .footer-section {
    flex: 1;
    min-width: 200px;
  }
  
  .footer-section h4 {
    color: #f9a826;
    margin-bottom: 15px;
  }
  
  .footer-section p,
  .footer-section a {
    color: #ccc;
    text-decoration: none;
    margin: 5px 0;
    display: block;
    font-size: 14px;
  }
  
  .footer-section a:hover {
    text-decoration: underline;
  }
  
  .footer-section ul {
    list-style: none; /* Menghilangkan tanda titik pada daftar */
    padding: 0; /* Menghapus padding default */
    margin: 0; /* Menghapus margin default */
  }
  
  .footer-section.layanan {
    text-align: right; /* Membuat teks rata kanan */
    margin-left: auto; /* Memindahkan elemen ke pojok kanan */
  }
  
  .logo {
    max-width: 130px;
    margin-bottom: 10px;
  }
  
  .social-icons a {
    margin-right: 10px;
    color: #ccc;
    font-size: 16px;
  }
  
  .footer-bottom {
    border-top: 1px solid #1e2e44;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    font-size: 13px;
    color: #aaa;
  }
  
  .language i {
    margin-right: 5px;
  }
  </style>

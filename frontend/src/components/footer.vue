<template>
  <footer class="footer">
    <div class="footer-content">
      <img src="../assets/logo_mandala_bg.svg" alt="Logo Bimbel Mandala" class="logo" />
      
      <div class="footer-container">
        <!-- Contact Section -->
        <div class="footer-section">
          <h4>About us</h4>
          <p class="about">Bimbel Mandala adalah bimbingan belajar terpercaya, meraih prestasi akademik melalui metode belajar yang interaktif dan menyenangkan.</p>
        </div>

        <div class="footer-section">
          <h4>Contact us</h4>
          <p>info@bimbelmandala.id</p>
          <p>+62 855-4000-0900</p>
          <p>Jl.Taman Sari Hill Residen. Blok B01. No. 10 Kel. Mangunharjo, Kec Tembalang. Kota Semarang</p>
        </div>

        <!-- About Section -->
        <div class="footer-section">
          <h4>Bimbel Mandala</h4>
          <ul>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Profile Tutor</a></li>
            <li><a href="/pendaftarantutor">Karir</a></li>
            <li><a href="#">Galeri</a></li>
          </ul>
        </div>

        <!-- Services Section -->
        <div class="footer-section">
          <h4>Layanan</h4>
          <ul>
            <li><a href="#">Informasi</a></li>
            <li><a href="#">Saran</a></li>
            <li><a href="#">Acara</a></li>
          </ul>
        </div>
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

<style scoped>
footer {
  background-color: #051329;
  color: #ffffff;
  padding: 3rem 8rem;
  font-family: 'Segoe UI', sans-serif;
}

.footer-content {
  max-width: 100%;
  margin: 0 auto;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.about {
  text-align: justify;
}

.footer-section {
  padding: 15px;
}

.footer-section h4 {
  color: #f9a826;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-section p,
.footer-section a {
  color: #ccc;
  text-decoration: none;
  margin: 8px 0;
  display: block;
  font-size: 14px;
}

.footer-section a:hover {
  text-decoration: underline;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.logo {
  max-width: 130px;
  display: block;
  margin-bottom: 20px;
}

.social-icons {
  margin-top: 15px;
}

.social-icons a {
  margin-right: 15px;
  color: #ccc;
  font-size: 1.2rem;
}

.footer-bottom {
  border-top: 1px solid #1e2e44;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 25px;
  margin-top: 40px;
  font-size: 13px;
  color: #aaa;
}

.language i {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem;
  }
  
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>
<script setup>
import navbarProfile from "./navbarProfile.vue"
import butEditProfile from "../dirButton/butEditProfile.vue";
import butLogout from "../dirButton/butLogout.vue";
import tabJadwalProgram from "./JadwalProgram.vue";
import tabProgram from "./ProgramTerdaftar.vue";
import Footer from "@/components/footer.vue"
</script>

<template>
  <navbarProfile/>
  <div class="profile-container padding-components">
    <div class="space-profile">
        <div class="identitas">
            <h4 class="headerb2">Arell Saverro</h4>
            <p class="bodyr2">SMA</p>
        </div>
        <div class="butAct">
            <butEditProfile />
            <butLogout />
        </div>
    </div>
    <n-divider/>
    <div class="space-profile">
        <n-space vertical>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/mail.svg" alt="">
                    <p>
                        Alamat E-mail
                    </p>
                </div>
                <p>: namaemail@gmail.com</p>
            </div>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/whatsapp.svg" alt="">
                    <p>
                        No. WhatsApp
                    </p>
                </div>
                <p>: 085786234264</p>
            </div>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/phone.svg" alt="">
                    <p>
                        No. Telp Wali
                    </p>
                </div>
                <p>: 085786234263</p>
            </div>
        </n-space>
        <n-space vertical>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/building.svg" alt="">
                    <p>
                        Sekolah
                    </p>
                </div>
                <p>: SMA Negeri 10 Semarang</p>
            </div>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/home.svg" alt="">
                    <p>
                        Alamat rumah
                    </p>
                </div>
                <p>: Jl Sekaran No.05 RT05/04, Gunung Pati, Kota Semarang</p>
            </div>
        </n-space>
    </div>
    <n-divider />
    <tabJadwalProgram/>
    <n-divider />
    <tabProgram/>
  </div>
  <Footer/>
</template>

<style>
.profile-container {
  margin-top: 104px !important;
  margin-bottom: 4rem;
}

.space-profile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  color: #061222;
  flex-wrap: wrap;
  gap: 1rem;
}

.identitas {
  color: #154484;
}

.butAct {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.detail-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 160px;
}

.detail-profile img {
  height: 20px;
}

.detail-separator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.detail-separator p:last-child {
  margin: 0;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .space-profile {
    flex-direction: column;
    align-items: flex-start;
  }

  .butAct {
    justify-content: flex-start;
  }

  .detail-profile {
    width: 100%;
  }

  .detail-separator {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-separator p:last-child {
    margin-left: 0;
  }
}
</style>
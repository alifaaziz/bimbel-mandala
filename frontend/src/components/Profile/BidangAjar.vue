<template>
    <div class="ajar-component">
        <h3 class="headersb3 title-bidang-ajar">
            Bidang Ajar
        </h3>
        <div>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/mail.svg" alt="">
                    <p>Jenjang</p>
                </div>
                <p>: SMP, SMA</p>
            </div>
            <div class="detail-separator">
                <div class="detail-profile">
                    <img src="@/assets/icons/mail.svg" alt="">
                    <p>Mata Pelajaran</p>
                </div>
                <p>: Matematika, fisika, kimia</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.title-bidang-ajar {
    color: #154484;
    align-items: left;
}
.ajar-component {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.detail-separator {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  color: #061222;
}
.detail-separator p:last-child {
  margin: 0;
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
</style>
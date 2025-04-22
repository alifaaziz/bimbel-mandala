<template>
    <div class="container-detail">
        <div>
            <img class="program-photo" src="/public/tutor/3.png" alt="">
        </div>
        <div>Kolom 2</div>
    </div>
</template>

<style setup>
.container-detail{
    display: flex;
    gap: 2rem;
    height: 700px;
    width: 1440px;
    padding: 0 8rem;
}

.program-photo{
    width: 541px;
    height: 496px;
    object-fit: cover;
    border-radius: 20px;
}

@media (max-width: 960px) {
    .container-detail {
        width: 100%;
    }
}
</style>
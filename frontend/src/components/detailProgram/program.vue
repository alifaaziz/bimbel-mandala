<script setup lang="ts">
import { defineComponent, h } from 'vue'

interface InfoRowProps {
  label: string
  value: string
}

const InfoRow = defineComponent({
  name: 'InfoRow',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  setup(props: InfoRowProps) {
    return () =>
      h('div', { style: { display: 'flex', gap: '12px' } }, [
        h('span', { style: { fontWeight: 'bold', width: '100px' } }, props.label),
        h('span', null, `: ${props.value}`)
      ])
  }
})
</script>

<template>
    <div class="container-detail">
        <div>
            <img class="program-photo" src="/public/tutor/3.png" alt="">
        </div>
        <div>
            <div class="head-detail">
                <div>
                    <div class="headersb1 head-program">Matematika</div>
                    <div class="bodym2">Pak Dendy Wan S.Pd</div>
                </div>
                <div>
                    <div class="headerb1 grade">
                        SMA
                    </div>
                </div>
            </div>
            <div>
                <n-space class="bodyr2">
                    <n-tag class="tag">
                        Senin
                    </n-tag>
                    <n-tag class="tag">
                        Selasa
                    </n-tag>
                    <n-tag class="tag">
                        Rabu
                    </n-tag>
                    <n-tag class="tag">
                        Kamis
                    </n-tag>
                    <n-tag class="tag">
                        Jumat
                    </n-tag>
                    <n-tag class="tag">
                        Sabtu
                    </n-tag>
                </n-space>
            </div>
            <n-space vertical size="medium">
                <InfoRow label="Area" value="Semarang" />
                <InfoRow label="Pertemuan" value="6 Bulan (3x perminggu)" />
                <InfoRow label="Pukul" value="15:00 WIB" />
                <InfoRow label="Durasi" value="120 Menit" />
            </n-space>
        </div>
    </div>
</template>

<style setup>

.container-detail{
    display: flex;
    gap: 4rem;
    height: 496px;
    width: 1440px;
    padding: 0 8rem;
    margin : 2rem 0;
}
.program-photo{
    width: 541px;
    height: 496px;
    object-fit: cover;
    border-radius: 20px;
}

.head-detail {
    display: flex;
    gap: 23rem;
    margin-bottom: 2rem;
}
.head-program {
    color: #154484;
}
.grade {
    background-color: darkgray;
    color: white;
    padding: 0.5rem 1rem; 
    border-radius: 2rem;
}

.tag {
    background-color: #154484;
    color: white;
    padding: 0.5rem 1rem; 
    border-radius: 2rem;
}
@media (max-width: 960px) {
    .container-detail {
        width: 100%;
    }
}
</style>
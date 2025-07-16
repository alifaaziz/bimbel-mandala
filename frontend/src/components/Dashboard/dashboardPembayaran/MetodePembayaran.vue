<script setup>
import { ref } from 'vue'
import { NButton, NCard, NInput, NModal, NSelect, useMessage } from 'naive-ui'

const message = useMessage()

const paymentMethods = ref([
  { id: 1, type: 'bank', name: 'BCA', accountNumber: '1234567890', accountName: 'Arel Savero' },
  { id: 2, type: 'ewallet', name: 'OVO', accountNumber: '081234567890', accountName: 'Arel Savero' }
])

const showModal = ref(false)
const newPayment = ref({
  type: '',
  name: '',
  accountNumber: '',
  accountName: ''
})

const typeOptions = [
  { label: 'Bank', value: 'bank' },
  { label: 'E-Wallet', value: 'ewallet' }
]

const addPaymentMethod = () => {
  if (!newPayment.value.type || !newPayment.value.name || !newPayment.value.accountNumber || !newPayment.value.accountName) {
    message.warning('Lengkapi semua data metode pembayaran!')
    return
  }

  paymentMethods.value.push({
    id: Date.now(),
    ...newPayment.value
  })

  message.success('Metode pembayaran berhasil ditambahkan!')
  showModal.value = false
  newPayment.value = {
    type: '',
    name: '',
    accountNumber: '',
    accountName: ''
  }
}

const removeMethod = (id) => {
  if (confirm('Yakin ingin menghapus metode pembayaran ini?')) {
    paymentMethods.value = paymentMethods.value.filter(p => p.id !== id)
    message.success('Metode pembayaran dihapus.')
  }
}
</script>

<template>
  <div class="container">
    <h2 class="headersb1">Metode Pembayaran</h2>
    <n-button type="primary" @click="showModal = true">+ Tambah Metode Pembayaran</n-button>

    <div class="method-list">
      <h3 class="headersb2">Rekening Bank</h3>
      <n-card v-for="item in paymentMethods.filter(p => p.type === 'bank')" :key="item.id" style="margin-bottom: 12px">
        <div class="card-content">
          <div>
            <strong>{{ item.name }}</strong><br />
            {{ item.accountNumber }}<br />
            a.n. {{ item.accountName }}
          </div>
          <n-button type="error" size="small" @click="removeMethod(item.id)">Hapus</n-button>
        </div>
      </n-card>

      <h3 class="headersb2">E-Wallet</h3>
      <n-card v-for="item in paymentMethods.filter(p => p.type === 'ewallet')" :key="item.id" style="margin-bottom: 12px">
        <div class="card-content">
          <div>
            <strong>{{ item.name }}</strong><br />
            {{ item.accountNumber }}<br />
            a.n. {{ item.accountName }}
          </div>
          <n-button type="error" size="small" @click="removeMethod(item.id)">Hapus</n-button>
        </div>
      </n-card>
    </div>

    <!-- Modal Tambah -->
    <n-modal v-model:show="showModal" title="Tambah Metode Pembayaran" preset="dialog">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <n-select v-model:value="newPayment.type" :options="typeOptions" placeholder="Pilih Tipe"/>
        <n-input type="text" v-model:value="newPayment.name" placeholder="Nama Bank / E-Wallet"/>
        <n-input-number v-model:value="newPayment.accountNumber" placeholder="Nomor Rekening / HP"/>
        <n-input type="text" v-model:value="newPayment.accountName" placeholder="Nama Pemilik"/>
        <n-button type="primary" block @click="addPaymentMethod">Simpan</n-button>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
.container {
  margin: 20px;
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 16px;
}
.headersb1 {
  color: #154484;
  margin-bottom: 16px;
}
.headersb2 {
  margin-top: 24px;
  margin-bottom: 12px;
  color: #FB8312;
}
.method-list {
  margin-top: 24px;
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

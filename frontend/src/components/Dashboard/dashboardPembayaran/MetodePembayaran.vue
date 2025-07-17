<script setup>
import { ref, onMounted } from 'vue'
import { NButton, NCard, NInput, NModal, NSelect, useMessage } from 'naive-ui'

const message = useMessage()

const paymentMethods = ref([])
const showModal = ref(false)
const newPayment = ref({
  type: '',
  name: '',
  accountNumber: ''
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/payments', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (res.ok) {
      const result = await res.json()
      paymentMethods.value = result.data.map(item => ({
        id: item.id,
        name: item.platform,
        accountNumber: item.accountNumber,
      }))
    }
  } catch (err) {
    message.error('Gagal mengambil metode pembayaran')
  }
})

const addPaymentMethod = async () => {
  if (!newPayment.value.name || !newPayment.value.accountNumber) {
    message.warning('Lengkapi semua data metode pembayaran!')
    return
  }

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        platform: newPayment.value.name,
        accountNumber: newPayment.value.accountNumber
      })
    })
    if (!res.ok) throw new Error('Gagal menambah metode pembayaran')
    const result = await res.json()
    paymentMethods.value.push({
      id: result.data.id,
      name: result.data.platform,
      accountNumber: result.data.accountNumber
    })
    message.success('Metode pembayaran berhasil ditambahkan!')
    showModal.value = false
    newPayment.value = {
      name: '',
      accountNumber: ''
    }
  } catch (err) {
    message.error('Gagal menambah metode pembayaran')
  }
}

const removeMethod = async (id) => {
  if (confirm('Yakin ingin menghapus metode pembayaran ini?')) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/payments/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Gagal menghapus metode pembayaran');
      paymentMethods.value = paymentMethods.value.filter(p => p.id !== id);
      message.success('Metode pembayaran dihapus.');
    } catch (err) {
      message.error('Gagal menghapus metode pembayaran');
    }
  }
}

function onAccountNumberInput(e) {
  newPayment.value.accountNumber = e.target.value.replace(/\D/g, '');
}
</script>

<template>
  <div class="container-luar">
    <div class="container">
      <h2 class="headersb1">Metode Pembayaran</h2>
      <n-button type="primary" @click="showModal = true">+ Tambah Metode Pembayaran</n-button>
  
      <div class="method-list">
        <n-card v-for="item in paymentMethods" :key="item.id" style="margin-bottom: 12px">
          <div class="card-content">
            <div>
              <strong>{{ item.name }}</strong><br />
              {{ item.accountNumber }}<br />
            </div>
            <n-button type="error" size="small" @click="removeMethod(item.id)">Hapus</n-button>
          </div>
        </n-card>
      </div>
  
      <!-- Modal Tambah -->
      <n-modal v-model:show="showModal" title="Tambah Metode Pembayaran" preset="dialog">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <n-input type="text" v-model:value="newPayment.name" placeholder="Nama Bank / E-Wallet"/>
          <n-input
            type="text"
            v-model:value="newPayment.accountNumber"
            placeholder="Nomor Rekening / HP"
            @input="onAccountNumberInput"
          />
          <n-button type="primary" block @click="addPaymentMethod">Simpan</n-button>
        </div>
      </n-modal>
    </div>
  </div>
</template>

<style scoped>
.container-luar{
  overflow-y: auto;
  width: 100%;
}
.container {
  margin: 20px;
  width: 100wh;
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
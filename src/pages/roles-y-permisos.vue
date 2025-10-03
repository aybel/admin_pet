<script setup lang="ts">
import { VCardText } from 'vuetify/components';

const data = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    startDate: '2021-01-01',
    experience: 5,
    age: 30,
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    startDate: '2020-05-15',
    experience: 3,
    age: 28,
  },
  {
    id: 3,
    fullName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    startDate: '2019-11-30',
    experience: 7,
    age: 35,
  },
]

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'fullName' },
  { title: 'EMAIL', key: 'email' },
  { title: 'DATE', key: 'startDate' },
  { title: 'EXPERIENCE', key: 'experience' },
  { title: 'AGE', key: 'age' },
]

const searchQuery = ref(null)
const isDialogVisible = ref(false)
</script>

<template>
  <VCard>
    <VCardTitle>Roles y Permisos</VCardTitle>
    <VCardText class="d-flex flex-wrap gap-4">
      <div class="d-flex align-center">
        <!-- 👉 Search  -->
        <VTextField v-model="searchQuery" placeholder="Buscar rol" style="inline-size: 200px;" density="compact"
          class="me-3" />
      </div>

      <VSpacer />

      <div class="d-flex gap-x-4 align-center">
        <!-- 👉 Export button -->
        <VBtn variant="outlined" color="secondary" prepend-icon="ri-upload-2-line">
          Exportar
        </VBtn>

        <VBtn color="primary" prepend-icon="ri-add-line" @click="() => { }">
          Agregar Rol
        </VBtn>
      </div>
    </VCardText>
    <VDataTable :headers="headers" :items="data" :items-per-page="5" class="text-no-wrap">
      <template #item.id="{ item }">
        <span class="text-h6">{{ item.id }}</span>
      </template>
    </VDataTable>
  </VCard>
</template>

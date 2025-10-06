<script setup lang="ts">
import { ref } from 'vue'

const data = []
const advertencia = ref(false)
import { onMounted } from 'vue'

onMounted(() => {
  loadRolesAndPermissions()
})

const loadRolesAndPermissions = async () => {
  try {
    const response = await $api('/roles/paginated', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      onResponseError: ({ response }) => {
        console.log('Error en la solicitud:', response._data.error)
        advertencia.value = response._data.error
      },
    })

    if (response) {
      data.push(...response.data)
    }
    console.log(data)

  } catch (error) {
    advertencia.value = error.message || 'Ocurrió un error al paginar los roles.'
    console.log(error)
  }
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Rol', key: 'name' },
  { title: 'Permisos', key: 'permissions_pluck' },
]

const searchQuery = ref(null)
const isAddRoleDialogVisible = ref(false)
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
        <VBtn color="primary" prepend-icon="ri-add-line" @click="isAddRoleDialogVisible = !isAddRoleDialogVisible">
          Agregar Rol
        </VBtn>
      </div>
    </VCardText>
    <VDataTable :headers="headers" :items="data" :items-per-page="5" class="text-no-wrap">
      <template #item.id="{ item }">
        <span class="text-h6">{{ item.id }}</span>
        <span class="text-h6">{{ item.name }}</span>
        <VChip v-if="item.permissions_pluck.length" class="ms-2">{{ item.permissions_pluck.join(', ') }}</VChip>
      </template>
    </VDataTable>
    <AddRoleDialog v-model:is-dialog-visible="isAddRoleDialogVisible" />
  </VCard>
</template>

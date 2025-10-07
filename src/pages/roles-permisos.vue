<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { $api } from '@/utils/api'
import DialogConfirm from '@/components/DialogConfirm.vue'

const data = ref([])
const advertencia = ref(false)
const success = ref(false)
const eliminar = ref(false)
const itemToDelete = ref(null)
const tipo = ref('error')

onMounted(() => {
  loadRolesAndPermissions()
})

const loadRolesAndPermissions = async () => {
  try {
    const response = await $api('/roles/paginated', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      onResponseError: ({ response }) => {
        console.log('Error en la solicitud:', response._data.error)
        advertencia.value = response._data.error
      },
    })

    if (response) {
      data.value.push(...response.data)
    }
  } catch (error) {
    advertencia.value = error.message || 'Ocurrió un error al paginar los roles.'
    console.log(error)
  }
}

const clickEliminar = item => {
  itemToDelete.value = item
  eliminar.value = true
}

const confirmDelete = () => {
  if (itemToDelete.value) {
    deleteItem(itemToDelete.value)
    eliminar.value = false
    itemToDelete.value = null
  }
}

const handleDialogClose = () => {
  eliminar.value = false
  itemToDelete.value = null
}

const deleteItem = async (item) => {
  try {
    const response = await $api('/rol/' + item.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      onResponseError: ({ response }) => {
        console.log('Error en la solicitud:', response._data.error)
        advertencia.value = response._data.error
      },
    })

    if (response && response.success) {
      success.value = response.message
      tipo.value = 'success'
      advertencia.value = true
      setTimeout(() => {
        success.value = false
        advertencia.value = false
      }, 1500)
      data.value = []
      await loadRolesAndPermissions()
    }
  } catch (error) {
    advertencia.value = error.message || 'Ocurrió un error al guardar el rol'
    console.error(error)
    tipo.value = 'error'
  }
}

const editItem = (item) => {

}


const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Rol', key: 'name' },
  { title: 'Fecha de creación', key: 'created_at' },
  { title: 'Permisos', key: 'permissions_pluck' },
  { title: 'Acciones', key: 'actions' },
]

const searchQuery = ref(null)
const isAddRoleDialogVisible = ref(false)
</script>

<template>
  <VCard>
    <DialogMensaje v-if="advertencia" :mensaje="advertencia" :tipo="tipo" />
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
      </template>
      <template #item.permissions_pluck="{ item }">
        <ul>
          <li v-for="perm in item.permissions_pluck" :key="perm">{{ perm }}</li>
        </ul>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn size="small" @click="editItem(item)">
            <VIcon icon="ri-pencil-line" />
          </IconBtn>
          <IconBtn size="small" @click="clickEliminar(item)">
            <VIcon icon="ri-delete-bin-line" />
          </IconBtn>
        </div>
      </template>
    </VDataTable>
    <DialogConfirm v-if="eliminar" title="Confirmar eliminación" text="¿Estás seguro de que deseas eliminar el rol?"
      :confirm="confirmDelete" @close="handleDialogClose" />
    <AddRoleDialog v-model:is-dialog-visible="isAddRoleDialogVisible" />
  </VCard>
</template>

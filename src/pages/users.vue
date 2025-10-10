<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { $api } from '@/utils/api'
import DialogConfirm from '@/components/DialogConfirm.vue'
import DialogMensaje from '@/components/DialogMensaje.vue'
import AddUserDialog from '@/components/veterinaria/user/AddUserDialog.vue'
import EditUserDialog from '@/components/veterinaria/user/EditUserDialog.vue'

const data = ref([])
const advertencia = ref('')
const success = ref('')
const eliminar = ref(false)
const itemToDelete = ref(null)
const selectedUser = ref(null)
const isEditUserDialogVisible = ref(false)
const tipo = ref('error')

const refreshDataTable = () => {
  data.value = []
  loadUsers()
}

onMounted(() => {
  loadUsers()
})

const loadUsers = async () => {
  const response = await $api('/users/search' + (searchQuery.value ? `?query=${searchQuery.value}` : ''), {
    method: 'GET',
    onResponseError: ({ response }) => {
      advertencia.value = response._data.error
    },
  })

  if (response) {
    data.value.push(...response.data)
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

const handleEditDialogClose = value => {
  if (!value) { // Solo limpiar cuando el modal se cierre (value = false)
    selectedUser.value = null
  }
}

const deleteItem = async item => {
  try {
    const response = await $api(`/users/${item.id}`, {
      method: 'DELETE',
      onResponseError: ({ response }) => {
        console.log('Error en la solicitud:', response._data.error)
        advertencia.value = response._data.error
      },
    })

    if (response && response.success) {
      success.value = response.success
      tipo.value = 'success'
      advertencia.value = response.message
      setTimeout(() => {
        success.value = ''
        advertencia.value = ''
      }, 1500)
      data.value = []
      await loadUsers()
    }
  } catch (error) {
    advertencia.value = error.message || 'Ocurrió un error al eliminar el usuario'
    console.error(error)
    tipo.value = 'error'
  }
}

const editItem = item => {
  console.log('Editar usuario:', item)
  selectedUser.value = item
  isEditUserDialogVisible.value = true
}

const exportToExcel = () => {
  if (!data.value.length) {
    advertencia.value = 'No hay datos para exportar'
    tipo.value = 'warning'

    return
  }

  // Preparar los datos para exportar
  const exportData = data.value.map(user => ({
    'ID': user.id,
    'Nombre': user.name,
    'Email': user.email,
    'Teléfono': user.phone || '',
    'Cargo': user.designation || '',
    'Rol': user.role?.name || '',
    'Estado': user.status === 'active' ? 'Activo' : 'Inactivo',
    'Fecha de creación': new Date(user.created_at).toLocaleDateString('es-ES'),
  }))

  // Convertir a CSV
  const csvContent = convertToCSV(exportData)
  
  // Crear y descargar el archivo
  downloadCSV(csvContent, 'usuarios.csv')
  
  // Mostrar mensaje de éxito
  success.value = 'Datos exportados exitosamente'
  setTimeout(() => {
    success.value = ''
  }, 3000)
}

const convertToCSV = (data) => {
  if (!data.length) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Escapar comillas y envolver en comillas si contiene comas o comillas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}

const downloadCSV = (csvContent, filename) => {
  // Agregar BOM para caracteres especiales en Excel
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Cargo', key: 'designation' },
  { title: 'Rol', key: 'role' },
  { title: 'Estado', key: 'status' },
  { title: 'Fecha de creación', key: 'created_at' },
  { title: 'Acciones', key: 'actions' },
]

const searchQuery = ref(null)
const isAddUserDialogVisible = ref(false)
</script>

<template>
  <VCard>
    <VCardTitle>Gestión de Usuarios</VCardTitle>
    <DialogMensaje v-if="advertencia" :mensaje="advertencia" :tipo="tipo" />
    <DialogMensaje v-if="success" :mensaje="success" :tipo="'success'" />
    <VCardText class="d-flex flex-wrap gap-4">
      <div class="d-flex align-center">
        <!-- 👉 Search  -->
        <VTextField v-model="searchQuery" placeholder="Buscar usuario" style="inline-size: 200px;" density="compact"
          class="me-3" />
      </div>
      <VSpacer />
      <div class="d-flex gap-x-4 align-center">
        <!-- 👉 Export button -->
        <VBtn variant="outlined" color="secondary" prepend-icon="ri-upload-2-line" @click="exportToExcel">
          Exportar
        </VBtn>
        <VBtn color="primary" prepend-icon="ri-add-line" @click="isAddUserDialogVisible = !isAddUserDialogVisible">
          Agregar Usuario
        </VBtn>
      </div>
    </VCardText>

    <VDataTable :headers="headers" :items="data" :items-per-page="5" class="text-no-wrap">

      <template #item.id="{ item }">
        <span class="text-h6">{{ item.id }}</span>
      </template>
      <template #item.name="{ item }">
        <div class="d-flex align-center">
          <VAvatar size="32" :color="item.avatar_url ? '' : 'primary'"
            :class="item.avatar_url ? '' : 'v-avatar-light-bg primary--text'"
            :variant="!item.avatar_url ? 'tonal' : undefined">
            <VImg v-if="item.avatar_url" :src="item.avatar_url" />
            <span v-else class="text-sm">{{ avatarText(item.name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.name }}</span>
            <small>{{ item.surname ? ' ' + item.surname : '' }}</small>
          </div>
        </div>
      </template>
      <template #item.status="{ item }">
        <VChip :color="item.email_verified_at != null ? 'success' : 'error'" size="small">
          {{ item.email_verified_at != null ? 'Activo' : 'No activo' }}
        </VChip>
      </template>
      <template #item.role="{ item }">
        <VChip color="primary" size="small">
          {{ item.role.name }}
        </VChip>
      </template>
      <template #item.created_at="{ item }">
        <VChip color="primary" size="small">
          <span v-if="item.created_at">{{ new Date(item.created_at).toLocaleDateString('es-ES', {
            day: '2-digit', month:
              '2-digit', year: 'numeric'
          }) }}</span>
        </VChip>
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
    <DialogConfirm v-if="eliminar" title="Confirmar eliminación"
      text="¿Estás seguro de que deseas eliminar este usuario?" :confirm="confirmDelete" @close="handleDialogClose" />
  </VCard>
  <AddUserDialog v-model:is-dialog-visible="isAddUserDialogVisible" @refresh-data-table="refreshDataTable" />
  <EditUserDialog v-model:is-dialog-visible="isEditUserDialogVisible" :user-data="selectedUser"
    @refresh-data-table="refreshDataTable" @update:is-dialog-visible="handleEditDialogClose" />
</template>

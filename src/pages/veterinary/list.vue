<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePage({
  meta: {
    permissions: 'list_veterinarians',
  },
})

const data = ref([])
const advertencia = ref('')
const success = ref('')
const eliminar = ref(false)
const itemToDelete = ref(null)
const selectedUser = ref(null)
const isEditUserDialogVisible = ref(false)
const tipo = ref('error')

const loadVeterinarians = async () => {
  const response = await $api('/veterinarians/search' + (searchQuery.value ? `?query=${searchQuery.value}` : ''), {
    method: 'GET',
    onResponseError: ({ response }) => {
      advertencia.value = response._data.error
    },
  })
  
  if (response) {
    data.value.push(...response.data)
  }

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


onMounted(() => {
  loadVeterinarians()
})
</script>

<template>
  <VCard>
    <VCardTitle>Gestión de Veterinarios</VCardTitle>
    <DialogMensaje v-if="advertencia" :mensaje="advertencia" :tipo="tipo" />
    <DialogMensaje v-if="success" :mensaje="success" :tipo="'success'" />
    <VCardText class="d-flex flex-wrap gap-4">
      <div class="d-flex align-center">
        <!-- 👉 Search  -->
        <VTextField v-model="searchQuery" placeholder="Buscar veterinario" style="inline-size: 200px;" density="compact"
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
  </VCard>
</template>

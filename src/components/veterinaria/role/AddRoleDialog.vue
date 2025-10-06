<script setup>
import { ref } from 'vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])


const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}

const listPermissions = PERMISOS
const rolNombre = ref(null)
let permisosSeleccionados = ref([])
const advertencia = ref(false)
const success = ref(false)

const agregarPermisoSeleccionado = permiso => {
  const index = permisosSeleccionados.value.indexOf(permiso)
  if (index > -1) {
    permisosSeleccionados.value.splice(index, 1)
  } else {
    permisosSeleccionados.value.push(permiso)
  }
}

const store = async () => {
  advertencia.value = false

  // Aquí puedes implementar la lógica para guardar los permisos
  if (rolNombre.value === null) {
    advertencia.value = "Capture un nombre al Rol"
    return
  }
  if (permisosSeleccionados.value.length === 0 || rolNombre.value === null) {
    advertencia.value = "Seleccione al menos un permiso y asigne un nombre al rol"
    return
  }
  try {
    const response = await $api('/rol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: rolNombre.value,
        permissions: permisosSeleccionados.value,
      }),
      onResponseError: ({ response }) => {
        console.log('Error en la solicitud:', response._data.error)
        advertencia.value = response._data.error
      },
    })

    if (response && response.success) {
      success.value = response.message
      setTimeout(() => {
        emit('update:isDialogVisible', false)
        success.value = false
        rolNombre.value = null
        permisosSeleccionados.value = []
      }, 1500)
    }
  } catch (error) {
    advertencia.value = error.message || 'Ocurrió un error al guardar el rol'
    console.error(error)
  }
}
</script>

<template>
  <VDialog :model-value="props.isDialogVisible" max-width="750" @update:model-value="dialogVisibleUpdate">
    <VCard class="refer-and-earn-dialog pa-3 pa-sm-11">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="default" @click="emit('update:isDialogVisible', false)" />

      <VCardText class="pa-5">
        <div class="mb-6">
          <h4 class="text-h4 text-center mb-2">
            Agregar Rol
          </h4>
        </div>
        <VAlert v-if="advertencia" type="warning" class="mb-4">
          {{ advertencia }}
        </VAlert>
        <VAlert v-if="success" type="success" class="mb-4">
          {{ success }}
        </VAlert>
        <VTextField label="Rol:" placeholder="Ingrese el nombre del rol" density="comfortable" class="mb-6"
          v-model="rolNombre" />
        <VBtn color="primary" class="mt-6" style="float: right;" @click="store()">
          Guardar Cambios
        </VBtn>
        <VBtn variant="outlined" class="mt-6 me-3" style="float: right;" @click="emit('update:isDialogVisible', false)">
          Cancelar
        </VBtn>
      </VCardText>
      <VCardText>
        <VTable>
          <thead>
            <tr>
              <th class="text-left">Módulo</th>
              <th class="text-left">Permiso</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(permission, index) in listPermissions" :key="index">
              <td>{{ permission.name }}</td>
              <td>
                <div v-for="(perm, idx) in permission.permisos" :key="idx">
                  <ul>
                    <li style="list-style: none;">
                      <VCheckbox :label="perm.name" :value="perm.permiso"
                        @click="agregarPermisoSeleccionado(perm.permiso)" />
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>

      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.refer-link-input {
  .v-field--appended {
    padding-inline-end: 0;
  }

  .v-field__append-inner {
    padding-block-start: 0.125rem;
  }
}
</style>

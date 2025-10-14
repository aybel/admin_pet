<script setup>
import { onMounted, ref } from 'vue'
import { $api } from '@/utils/api'

const emit = defineEmits(['refreshDataTable'])

definePage({
  meta: {
    permissions: 'all',
  },
})

onMounted(() => {
  loadRoles()
  loadHours()
})

// Formulario del usuario
const userName = ref('')
const userLastName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const userPasswordConfirm = ref('')
const userRole = ref('')
const userPhone = ref('')
const userDesignation = ref('')
const userBirthday = ref('')
const userAvatar = ref(null)
const advertencia = ref(false)
const success = ref(false)
const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

// Opciones para los selects
const roleOptions = ref()
const hoursOptions = ref()

// Cargar roles desde la API
const loadRoles = async () => {
  const response = await $api('/roles/available', {
    method: 'GET',
    onResponseError: ({ response }) => {
      advertencia.value = response._data.message
    },
  })

  if (response) {

    roleOptions.value = response.data
      .filter(role => role.name.toLowerCase() === 'veterinario')
      .map(role => ({
        title: role.name,
        value: role.id,
      }))
  }
}

const loadHours = async () => {
  const response = await $api('/schedule-hours', {
    method: 'GET',
    onResponseError: ({ response }) => {
      advertencia.value = response._data.message
    },
  })

  if (response) {
    hoursOptions.value = response.data.data.map(item => ({ title: `${item.start_time} - ${item.end_time}`, value: `${item.id}` }))
  }
}

const resetForm = () => {
  userName.value = ''
  userLastName.value = ''
  userEmail.value = ''
  userPassword.value = ''
  userPasswordConfirm.value = ''
  userRole.value = ''
  userPhone.value = ''
  userDesignation.value = ''
  userBirthday.value = ''
  userAvatar.value = null
  advertencia.value = false
  success.value = false
}

const validateForm = () => {
  if (!userName.value.trim()) {
    advertencia.value = "El nombre es requerido"
    return false
  }

  if (!userLastName.value.trim()) {
    advertencia.value = "El apellido es requerido"
    return false
  }

  if (!userEmail.value.trim()) {
    advertencia.value = "El email es requerido"
    return false
  }

  // Validación de email básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userEmail.value)) {
    advertencia.value = "El formato del email no es válido"
    return false
  }

  if (!userPassword.value) {
    advertencia.value = "La contraseña es requerida"
    return false
  }

  if (userPassword.value.length < 6) {
    advertencia.value = "La contraseña debe tener al menos 6 caracteres"
    return false
  }

  if (userPassword.value !== userPasswordConfirm.value) {
    advertencia.value = "Las contraseñas no coinciden"
    return false
  }

  if (!userRole.value) {
    advertencia.value = "Debe seleccionar un rol"
    return false
  }

  return true
}

const store = async () => {
  advertencia.value = false

  if (!validateForm()) {
    return
  }
  const formData = new FormData()

  formData.append('name', userName.value)
  formData.append('surname', userLastName.value)
  formData.append('email', userEmail.value)
  formData.append('password', userPassword.value)
  formData.append('password_confirmation', userPasswordConfirm.value)
  formData.append('role_id', userRole.value)
  formData.append('phone', userPhone.value)
  formData.append('designation', userDesignation.value)
  formData.append('birthday', userBirthday.value)
  formData.append('schedule_hours', JSON.stringify(selectedOptions.value))
  if (userAvatar.value && userAvatar.value instanceof File) {
    formData.append('avatar', userAvatar.value)
  }
  try {

    const response = await $api('/users', {
      method: 'POST',
      body: formData,
      onResponseError: ({ response }) => {
        if (response._data.errors.avatar) {
          if (Array.isArray(response._data.errors.avatar)) {
            advertencia.value += response._data.errors.avatar.join(', ')
          }
        } else {
          advertencia.value = response._data.error
        }
      },
    })

    if (response && response.success) {
      success.value = response.message
      setTimeout(() => {
        resetForm()
      }, 1500)
      emit('refreshDataTable')
    }
  } catch (error) {
    //advertencia.value = error.message || 'Ocurrió un error al crear el usuario'
    console.error(error)
  }
}
</script>

<template>
  <VCard class="pa-3 pa-sm-8">
    <VCardText class="pa-5">
      <div class="mb-6">
        <h4 class="text-h4 text-center mb-2">
          Agregar veterinario
        </h4>
      </div>

      <!-- Alertas -->
      <VAlert v-if="advertencia" type="warning" class="mb-4">
        {{ advertencia }}
      </VAlert>

      <VAlert v-if="success" type="success" class="mb-4">
        {{ success }}
      </VAlert>

      <!-- Formulario -->
      <VForm>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="userName" label="Nombre *" placeholder="Ingrese el nombre completo"
              density="comfortable" class="mb-4" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="userLastName" label="Apellido *" placeholder="Ingrese el apellido"
              density="comfortable" class="mb-4" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="userEmail" label="Correo *" placeholder="usuario@ejemplo.com" type="email"
              density="comfortable" class="mb-4" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="userPassword" label="Contraseña *" placeholder="Ingrese la contraseña"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'" density="comfortable"
              class="mb-4" @click:append-inner="isPasswordVisible = !isPasswordVisible" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="userPasswordConfirm" label="Confirmar contraseña *"
              placeholder="Confirme la contraseña" :type="isPasswordConfirmVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordConfirmVisible ? 'ri-eye-off-line' : 'ri-eye-line'" density="comfortable"
              class="mb-4" @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="userPhone" label="Teléfono" placeholder="Ingrese el número de teléfono"
              density="comfortable" class="mb-4" maxlength="25" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="userBirthday" label="Fecha de nacimiento" type="date" density="comfortable"
              class="mb-4" />
          </VCol>

          <VCol cols="12">
            <VTextarea v-model="userDesignation" label="Cargo/Designación" placeholder="Ingrese el cargo o designación"
              density="comfortable" class="mb-4" maxlength="350" rows="3" counter />
          </VCol>

          <VCol cols="12">
            <VFileInput v-model="userAvatar" label="Avatar (Opcional)"
              placeholder="Seleccione una imagen para el avatar" accept="image/*" prepend-icon="ri-image-line"
              density="comfortable" class="mb-4" show-size />
          </VCol>

          <VCol cols="12">
            <VSelect v-model="userRole" label="Rol *" placeholder="Seleccione un rol" :items="roleOptions"
              density="comfortable" class="mb-4" />
          </VCol>
          <VCol cols="12">
            <VSelect v-model="selectedOptions" :items="hoursOptions" :menu-props="{ maxHeight: '400' }" label="Horario"
              multiple persistent-hint placeholder="Seleccciona los horarios de consulta" />
          </VCol>
        </VRow>
      </VForm>

      <!-- Botones -->
      <div class="d-flex justify-end gap-4 mt-6">
        <VBtn variant="outlined" to="/users">
          Cancelar
        </VBtn>
        <VBtn color="primary" @click="store">
          Guardar Usuario
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.user-dialog {
  .v-field--appended {
    padding-inline-end: 0;
  }

  .v-field__append-inner {
    padding-block-start: 0.125rem;
  }
}
</style>

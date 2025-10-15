<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { $api } from '@/utils/api'
import { VCol } from 'vuetify/components'
import ScheduleVeterinary from './schedule-veterinary.vue'

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
const selectedOptions = ref([])

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
  const response = await $api('/schedule-hours/availability/group-hours', {
    method: 'GET',
    onResponseError: ({ response }) => {
      advertencia.value = response._data.message
    },
  })

  if (response) {
    hoursOptions.value = response.data.map(item => (
      {
        hour: `${item.hour}`, value: `${item.id}`,
        intervals: item.intervals,
      }
    ))
  }
}

// Función para manejar los intervalos seleccionados
const handleSelectedIntervals = (intervals) => {
  selectedOptions.value = intervals
  //console.log('Horarios seleccionados:', intervals)
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
    nextTick(() => {
      const input = document.querySelector('input[placeholder="Ingrese el nombre completo"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (!userLastName.value.trim()) {
    advertencia.value = "El apellido es requerido"
    nextTick(() => {
      const input = document.querySelector('input[placeholder="Ingrese el apellido"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (!userEmail.value.trim()) {
    advertencia.value = "El email es requerido"
    nextTick(() => {
      const input = document.querySelector('input[placeholder="usuario@ejemplo.com"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  // Validación de email básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userEmail.value)) {
    advertencia.value = "El formato del email no es válido"
    nextTick(() => {
      const input = document.querySelector('input[placeholder="usuario@ejemplo.com"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (!userPassword.value) {
    advertencia.value = "La contraseña es requerida"
    nextTick(() => {
      const input = document.querySelector('input[placeholder="Ingrese la contraseña"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (userPassword.value.length < 6) {
    advertencia.value = "La contraseña debe tener al menos 6 caracteres"
    nextTick(() => {
      const input = document.querySelector('input[placeholder="Ingrese la contraseña"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (userPassword.value !== userPasswordConfirm.value) {
    advertencia.value = "Las contraseñas no coinciden"
    nextTick(() => {
      const input = document.querySelector('input[placeholder="Confirme la contraseña"]')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (!userRole.value) {
    advertencia.value = "Debe seleccionar un rol"
    nextTick(() => {
      const select = document.querySelector('[placeholder="Seleccione un rol"]')
      if (select) {
        select.focus()
        select.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return false
  }

  if (!selectedOptions.value || selectedOptions.value.length === 0) {
    advertencia.value = "Debe seleccionar al menos un horario"
    nextTick(() => {
      const scheduleTable = document.querySelector('.v-data-table')
      if (scheduleTable) {
        scheduleTable.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
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
  formData.append('last_name', userLastName.value)
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
  console.log(formData);
  
  try {

    const response = await $api('/veterinarians', {
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
            <ScheduleVeterinary :hours-data="hoursOptions" @update:selected-intervals="handleSelectedIntervals" />
          </VCol>
        </VRow>
      </VForm>

      <!-- Botones -->
      <div class="d-flex justify-end gap-4 mt-6">
        <VBtn variant="outlined" to="/users">
          Limpiar formulario
        </VBtn>
        <VBtn color="primary" @click="store">
          Guardar veterinario
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

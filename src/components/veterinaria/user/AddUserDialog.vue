<script setup>
import { ref } from 'vue'
import { $api } from '@/utils/api'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'refreshDataTable'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}

// Formulario del usuario
const userName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const userPasswordConfirm = ref('')
const userRole = ref('')
const userStatus = ref('active')
const advertencia = ref(false)
const success = ref(false)
const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

// Opciones para los selects
const roleOptions = [
  { title: 'Administrador', value: 'admin' },
  { title: 'Veterinario', value: 'veterinario' },
  { title: 'Recepcionista', value: 'recepcionista' },
  { title: 'Usuario', value: 'user' },
]

const statusOptions = [
  { title: 'Activo', value: 'active' },
  { title: 'Inactivo', value: 'inactive' },
]

const resetForm = () => {
  userName.value = ''
  userEmail.value = ''
  userPassword.value = ''
  userPasswordConfirm.value = ''
  userRole.value = ''
  userStatus.value = 'active'
  advertencia.value = false
  success.value = false
}

const validateForm = () => {
  if (!userName.value.trim()) {
    advertencia.value = "El nombre es requerido"
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
  
  try {
    const response = await $api('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userName.value,
        email: userEmail.value,
        password: userPassword.value,
        password_confirmation: userPasswordConfirm.value,
        role: userRole.value,
        status: userStatus.value,
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
        resetForm()
      }, 1500)
      emit('refreshDataTable')
    }
  } catch (error) {
    advertencia.value = error.message || 'Ocurrió un error al crear el usuario'
    console.error(error)
  }
}
</script>

<template>
  <VDialog 
    :model-value="props.isDialogVisible" 
    max-width="600" 
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="pa-3 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn 
        variant="text" 
        size="default" 
        @click="emit('update:isDialogVisible', false)" 
      />

      <VCardText class="pa-5">
        <div class="mb-6">
          <h4 class="text-h4 text-center mb-2">
            Agregar Usuario
          </h4>
        </div>
        
        <!-- Alertas -->
        <VAlert 
          v-if="advertencia" 
          type="warning" 
          class="mb-4"
        >
          {{ advertencia }}
        </VAlert>
        
        <VAlert 
          v-if="success" 
          type="success" 
          class="mb-4"
        >
          {{ success }}
        </VAlert>

        <!-- Formulario -->
        <VForm>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="userName"
                label="Nombre completo *"
                placeholder="Ingrese el nombre completo"
                density="comfortable"
                class="mb-4"
              />
            </VCol>
            
            <VCol cols="12">
              <VTextField
                v-model="userEmail"
                label="Email *"
                placeholder="usuario@ejemplo.com"
                type="email"
                density="comfortable"
                class="mb-4"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="userPassword"
                label="Contraseña *"
                placeholder="Ingrese la contraseña"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                density="comfortable"
                class="mb-4"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="userPasswordConfirm"
                label="Confirmar contraseña *"
                placeholder="Confirme la contraseña"
                :type="isPasswordConfirmVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordConfirmVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                density="comfortable"
                class="mb-4"
                @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VSelect
                v-model="userRole"
                label="Rol *"
                placeholder="Seleccione un rol"
                :items="roleOptions"
                density="comfortable"
                class="mb-4"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VSelect
                v-model="userStatus"
                label="Estado"
                :items="statusOptions"
                density="comfortable"
                class="mb-4"
              />
            </VCol>
          </VRow>
        </VForm>

        <!-- Botones -->
        <div class="d-flex justify-end gap-4 mt-6">
          <VBtn 
            variant="outlined" 
            @click="emit('update:isDialogVisible', false)"
          >
            Cancelar
          </VBtn>
          <VBtn 
            color="primary" 
            @click="store"
          >
            Guardar Usuario
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
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

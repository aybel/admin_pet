<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: '',
  },
  text: {
    type: String,
    required: true,
    default: '',
  },
  confirm: {
    type: Function,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['close'])

import { ref } from 'vue'

const isDialogVisible = ref(true)

const handleCancel = () => {
  isDialogVisible.value = false
  emit('close')
}

const handleConfirm = () => {
  if (props.confirm) {
    props.confirm()
  }
  isDialogVisible.value = false
  emit('close')
}


</script>

<template>
  <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">
        {{ props.title }}
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard title="">
      <DialogCloseBtn variant="text" size="default" @click="handleCancel" />

      <VCardText>
        {{ props.text }}
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn color="error" @click="handleCancel">
          Cancelar
        </VBtn>
        <VBtn color="success" @click="handleConfirm">
          Aceptar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

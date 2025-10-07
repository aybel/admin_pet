<script>

export default {
  name: 'DialogMensaje',
  props: {
    mensaje: {
      type: String,
      required: true,
      default: '',
    },
    tipo: {
      type: String,
      required: true,
      default: 'info', // 'success', 'warning', 'error', 'info'
    },
  },
}
</script>

<template>
  <div class="demo-space-y">
    <VAlert :color="tipo" variant="filled" border="start" elevation="2">
      {{ mensaje }}
    </VAlert>
  </div>
</template>

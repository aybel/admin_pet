<template>
  <div>
    <h1>Listado de Veterinarios</h1>
    <p>Bienvenido al listado de veterinarios.</p>
  </div>
</template>

<script setup>
definePage({
  meta: {
    permissions: 'list-veterinary',
  },
})
</script>

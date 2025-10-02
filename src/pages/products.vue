<template>
  <div>
    <VCard class="ma-5 pa-5">
      <VCardTitle>Gestión de Productos</VCardTitle>
      <VCardText>
        Aquí puedes gestionar todos los productos disponibles en la tienda.
      </VCardText>
      <VTextField label="Nombre" class="mb-4" />
      <VSelect label="Categoría" :items="items" class="mb-4" />
    </VCard>
    <VCardActions>
      <VBtn color="primary">Agregar Producto</VBtn>
    </VCardActions>
  </div>
</template>

<script setup>

const items = ['Todos', 'Alimentos', 'Juguetes', 'Accesorios'];

</script>

<style scoped>
h1 {
  color: #333;
}
</style>

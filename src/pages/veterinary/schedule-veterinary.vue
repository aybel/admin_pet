<script setup>
import { DAYS_TO_NUMBER, ENGLISH_TO_SPANISH_DAYS } from '@/utils/constants'

const props = defineProps({
  hoursData: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:selectedIntervals'])



const hours = ref([])
const data = computed(() => hours.value)
const selectedIntervals = ref({})

// Computed que convierte selectedIntervals en un array para usar en el componente padre
const selectedScheduleArray = computed(() => {
  return Object.values(selectedIntervals.value).map(item => {
    const spanishDay = ENGLISH_TO_SPANISH_DAYS[item.day]

    return {
      intervalId: item.intervalId,
      day: DAYS_TO_NUMBER[spanishDay],
    }
  })
})

// Exponer el array para uso del componente padre
defineExpose({
  selectedScheduleArray,
})

const headers = [
  {
    title: 'Horario',
    key: 'hour',
  },
  {
    title: 'Lunes',
    key: 'monday',
  },
  {
    title: 'Martes',
    key: 'tuesday',
  },
  {
    title: 'Miércoles',
    key: 'wednesday',
  },
  {
    title: 'Jueves',
    key: 'thursday',
  },
  {
    title: 'Viernes',
    key: 'friday',
  },
  {
    title: 'Sábado',
    key: 'saturday',
  },
  {
    title: 'Domingo',
    key: 'sunday',
  },
]

// Función para manejar el cambio de checkbox
const handleIntervalChange = (intervalId, day, checked) => {
  const uniqueKey = `${intervalId}-${day}`

  if (checked) {
    selectedIntervals.value[uniqueKey] = { intervalId, day }
  } else {
    delete selectedIntervals.value[uniqueKey]
  }

  // Forzar reactividad
  selectedIntervals.value = { ...selectedIntervals.value }

  // Emitir el array de horarios seleccionados al componente padre
  emit('update:selectedIntervals', selectedScheduleArray.value)
}

// Función helper para verificar si un checkbox está seleccionado
const isIntervalSelected = (intervalId, day) => {
  const uniqueKey = `${intervalId}-${day}`
  return !!selectedIntervals.value[uniqueKey]
}

watch(() => props.hoursData, newHoursData => {
  if (newHoursData && Array.isArray(newHoursData)) {
    hours.value = newHoursData
  }
}, { immediate: true })

</script>

<template>
  <VDataTable :headers="headers" :items="data" :items-per-page="10" class="text-no-wrap">
    <template #item.hour="{ item }">
      <span class="text-h6">{{ item.hour }}</span>
    </template>

    <!-- Template para Lunes -->
    <template #item.monday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`monday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`monday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'monday')" :label="interval.time_range" hide-details
            density="compact" @update:model-value="(checked) => handleIntervalChange(interval.id, 'monday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>

    <!-- Template para Martes -->
    <template #item.tuesday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`tuesday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`tuesday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'tuesday')" :label="interval.time_range" hide-details
            density="compact"
            @update:model-value="(checked) => handleIntervalChange(interval.id, 'tuesday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>

    <!-- Template para Miércoles -->
    <template #item.wednesday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`wednesday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`wednesday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'wednesday')" :label="interval.time_range"
            hide-details density="compact"
            @update:model-value="(checked) => handleIntervalChange(interval.id, 'wednesday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>

    <!-- Template para Jueves -->
    <template #item.thursday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`thursday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`thursday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'thursday')" :label="interval.time_range"
            hide-details density="compact"
            @update:model-value="(checked) => handleIntervalChange(interval.id, 'thursday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>

    <!-- Template para Viernes -->
    <template #item.friday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`friday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`friday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'friday')" :label="interval.time_range" hide-details
            density="compact" @update:model-value="(checked) => handleIntervalChange(interval.id, 'friday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>

    <!-- Template para Sábado -->
    <template #item.saturday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`saturday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`saturday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'saturday')" :label="interval.time_range"
            hide-details density="compact"
            @update:model-value="(checked) => handleIntervalChange(interval.id, 'saturday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>

    <!-- Template para Domingo -->
    <template #item.sunday="{ item }">
      <div v-if="item.intervals && item.intervals.length > 0" class="d-flex flex-column gap-2">
        <div v-for="interval in item.intervals" :key="`sunday-${interval.id}`" class="d-flex align-center gap-2">
          <input :id="`sunday-${interval.id}`" type="hidden" :value="interval.id">
          <VCheckbox :model-value="isIntervalSelected(interval.id, 'sunday')" :label="interval.time_range" hide-details
            density="compact" @update:model-value="(checked) => handleIntervalChange(interval.id, 'sunday', checked)" />
        </div>
      </div>
      <span v-else class="text-caption text-disabled">Sin horarios</span>
    </template>
  </VDataTable>
</template>

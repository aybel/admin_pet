export const COOKIE_MAX_AGE_1_YEAR = 365 * 24 * 60 * 60

// Mapeo de días de la semana en español a números
export const DAYS_TO_NUMBER = {
  'lunes': 1,
  'martes': 2,
  'miercoles': 3,
  'jueves': 4,
  'viernes': 5,
  'sabado': 6,
  'domingo': 7,
}

// Mapeo de números a días de la semana en español
export const NUMBER_TO_DAYS = {
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
  7: 'domingo',
}

// Array de días de la semana en español (con mayúsculas para UI)
export const DAYS_ES = [
  { value: 1, text: 'Lunes', key: 'lunes' },
  { value: 2, text: 'Martes', key: 'martes' },
  { value: 3, text: 'Miércoles', key: 'miercoles' },
  { value: 4, text: 'Jueves', key: 'jueves' },
  { value: 5, text: 'Viernes', key: 'viernes' },
  { value: 6, text: 'Sábado', key: 'sabado' },
  { value: 7, text: 'Domingo', key: 'domingo' },
]

// Mapeo de días en inglés a español (para compatibilidad)
export const ENGLISH_TO_SPANISH_DAYS = {
  'monday': 'lunes',
  'tuesday': 'martes',
  'wednesday': 'miercoles',
  'thursday': 'jueves',
  'friday': 'viernes',
  'saturday': 'sabado',
  'sunday': 'domingo',
}

export const PERMISOS = [
    {
      name: 'Dashboard',
      permisos: [{
        name: 'Graficos',
        permiso: 'show_report_grafics',
      }],
    },
    {
      name: 'Roles y Permisos',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_rol'
        },
        {
            name: 'Listado',
            permiso: 'list_rol'
        },
        {
            name: 'Edición',
            permiso: 'edit_rol'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_rol'
        }
      ]
    },
    {
      name: 'Staffs',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_staff'
        },
        {
            name: 'Listado',
            permiso: 'list_staff'
        },
        {
            name: 'Edición',
            permiso: 'edit_staff'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_staff'
        }
      ]
    },
    {
      name: 'Veterinario',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_veterinary'
        },
        {
            name: 'Listado',
            permiso: 'list_veterinary'
        },
        {
            name: 'Edición',
            permiso: 'edit_veterinary'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_veterinary'
        },
        {
            name: 'Perfil',
            permiso: 'profile_veterinary'
        }
      ]
    },
    {
      name: 'Mascotitas',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_pet'
        },
        {
            name: 'Listado',
            permiso: 'list_pet'
        },
        {
            name: 'Edición',
            permiso: 'edit_pet'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_pet'
        },
        {
            name: 'Perfil',
            permiso: 'profile_pet'
        }
      ]
    },
    {
      name: 'Citas Medicas',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_appointment'
        },
        {
            name: 'Listado',
            permiso: 'list_appointment'
        },
        {
            name: 'Edición',
            permiso: 'edit_appointment'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_appointment'
        },
      ]
    },
    {
      name: 'Calendario',
      permisos: [{
        name: 'Disponibilidad',
        permiso: 'calendar',
      }],
    },
    {
      name: 'Pagos',
      permisos: [
        {
            name: 'Ver',
            permiso: 'show_payment'
        },
        {
            name: 'Gestión',
            permiso: 'edit_payment'
        },
      ]
    },
    {
      name: 'Vacunas',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_vaccionation'
        },
        {
            name: 'Listado',
            permiso: 'list_vaccionation'
        },
        {
            name: 'Edición',
            permiso: 'edit_vaccionation'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_vaccionation'
        },
      ]
    },
    {
      name: 'Procedimientos quirúrgicos',
      permisos: [
        {
            name: 'Registrar',
            permiso: 'register_surgeries'
        },
        {
            name: 'Listado',
            permiso: 'list_surgeries'
        },
        {
            name: 'Edición',
            permiso: 'edit_surgeries'
        },
        {
            name: 'Eliminar',
            permiso: 'delete_surgeries'
        },
      ]
    },
    {
      name: 'Historial Medico',
      permisos: [{
        name: 'Disponibilidad',
        permiso: 'show_medical_records',
      }],
    },
  ]

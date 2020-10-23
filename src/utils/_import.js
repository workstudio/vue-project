//export const _pviewsImport = file => () => import(`@/views/${file}.vue`)
export const _pviewsImport = file => require(`@/views/${file}.vue`).default

<template>
  <span>{{ row[field].value }}</span>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    row: {type: Object, default() {}},
    field: {type: String, default: ''},
  },
}
</script>

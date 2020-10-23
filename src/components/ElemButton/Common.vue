<template>
  <div>
    <span>{{ row[field].value }}</span>
  </div>
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

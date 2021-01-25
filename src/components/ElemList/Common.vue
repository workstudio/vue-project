<template>
  <span>{{ row[field].value }}</span>
</template>

<script>
import {column} from '@/applications/mixins/column';
export default {
  mixins: [column],
  data() {
    return {}
  },
}
</script>

<template>
  <img :src="row[field].value" alt="" width="150px" height="100px" />
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

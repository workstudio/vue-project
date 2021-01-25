import {globalSettings} from '@/utils/base'

export const column = {
  name: "column",
  components: {
  },

  data() {
    return {}
  },
  props: {
    row: {type: Object, default() {}},
    field: {type: String, default: ''},
    model: null,
  },
}

import {globalSettings} from '@/utils/base'

export const form = {
  name: "form",
  components: {
  },
  data() {
    return {
      //envType: globalSettings.envType,
    }
  },
  props: {
    elem: {type: Object, default() {}},
    listQuery: {type: Object, default() {}},
    inputInfos: {type: Object, default() {}},
    field: {type: String, default: ''},
    formName: {type: String, default: ''},
    value: [String, Array, Number],
    model: {type: Function},  
  },
  computed:{
  },
  methods: {
    replaceCaptchaUrl() {
      this.$refs.captchaDoc['src'] = this.baseMethod.getCaptchaUrl(1)
    },
    handleFilter() {
      this.listQuery[this.field] = this.input;
      this.$emit('update.listQuery');
      this.$emit('handleFilter');
    },
    handleFormChange() {
      this.inputInfos[this.field] = this.input;
      this.dealFormChange(this.input);
    },
    dealFormChange() {
    },
    handleChange() {
    },
  },
}

import Vue from 'vue'
Vue.component('tableCellRender', {
  props: {
    option: {
      type: Object,
      default: null
    },
    row: {
      type: Object,
      default: null
    }
  },
  created () {
    this.$options.template = this.option.template
  },
  watch: {
    option: {
      handler (newValue) {
        this.$emit('on-option-change', newValue)
      }
    }
  }
})

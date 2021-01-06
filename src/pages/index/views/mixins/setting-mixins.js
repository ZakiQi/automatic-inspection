const settingMixins = {
  data () {
    return {
      tableInfo: [],
      userName: ''
    }
  },

  watch: {
    userName (val) {
      console.log(val)
    }
  },

  methods: {
  }
}

export default settingMixins
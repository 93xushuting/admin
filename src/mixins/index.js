export const customDropdownAction = {
  watch: {
    batchActionBtnDisabled: {
      handler: function (bl) {
        this.$nextTick(function () {
          this.$refs.dropdownRef.$children[0].$children.forEach(item => {
            item.disabled = !bl
          })
        })
      },
      immediate: true
    }
  },
  methods: {
    dropdownBtnClick () {
      const bl = this.$refs.dropdownRef.$children[1].showPopper
      this.$refs.dropdownRef.$children[1].$emit('visible', !bl)
    },
    dropdownMenuHide () {
      this.$refs.dropdownRef.$children[1].$emit('visible', false)
    },
    dropdownBtnClickOther () {
      if (!this.$refs.dropdownRef_other) {
        return
      }
      const bl = this.$refs.dropdownRef_other.$children[1].showPopper
      this.$refs.dropdownRef_other.$children[1].$emit('visible', !bl)
    },
    dropdownMenuHideOther () {
      if (!this.$refs.dropdownRef_other) {
        return
      }
      this.$refs.dropdownRef_other.$children[1].$emit('visible', false)
    }
  },
  updated: function () {
    if (typeof this.batchActionBtnDisabled === 'undefined') {
      return
    }
    this.$nextTick(function () {
      this.$refs.dropdownRef.$children[0].$children.forEach(item => {
        item.disabled = !this.batchActionBtnDisabled
      })
    })
  },
  mounted: function () {
    document.body.addEventListener('click', this.dropdownMenuHide)
    document.body.addEventListener('click', this.dropdownMenuHideOther)
  },
  beforeDestroy: function () {
    document.body.removeEventListener('click', this.dropdownMenuHide)
    document.body.removeEventListener('click', this.dropdownMenuHideOther)
  }
}

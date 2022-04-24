<template>
  <div class="breadcrumbTitle">{{obj.breadcrumb.title}}
    <slot name="btns"></slot>
  </div>
</template>
<script>
export default {
  name: 'breadcrumb',
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  mounted () { },
  methods: {

  }
}
</script>

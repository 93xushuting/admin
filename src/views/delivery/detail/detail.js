import TalentDetail from '@c/custom/talentDetail/TalentDetail.vue'

export default {
  components: { TalentDetail },
  data () {
    return {
      breadObj: {
        breadcrumb: {
          isShowBack: false
        }
      },
      id: 0
    }
  },
  created: function () {
    const { id } = this.$route.params
    this.id = id
  },
  watch: {
    '$route' () {
      const { id } = this.$route.params
      this.id = id
    }
  }
}

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
      id: '0'
    }
  },
  created: function () {
    this.id = this.$route.params.id
  }
}

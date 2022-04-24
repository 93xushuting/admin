import UpdateCompany from '../../../components/custom/updateCompany/updateCompany.vue'
export default {
  components: { UpdateCompany },
  data () {
    return {
      title: '',
      id: '0',
      detailForm: {
        industry: {},
        addresses: [],
        companyTags: [],
        companyPics: []
      },
      visibile: false
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('keep_alive/setKeepAlive', {
      updateCompany: to.name === 'addressManageEdit' ? {
        ruleForm: this.$refs.updateCompany.form.ruleForm
      } : null
    })
    next()
  },
  created: function () {
    const addType = this.$route.query.type
    this.id = this.$route.params.id
    if (this.id === '0') {
      this.$route.meta.name = addType === 'proxy' ? '新增企业' : '注册企业'
    } else {
      this.$route.meta.name = '编辑企业'
    }
    this.title = this.$route.meta.name
    this.queryCompanyDetail()
  },
  methods: {
    // 查询企业详情
    queryCompanyDetail () {
      const { id } = this
      if (id === '0') {
        this.visibile = true
        return
      }
      this._api.recruitQueryCompanyDetail({ id }).then(res => {
        const { data } = res
        this.detailForm = Object.assign({}, this.detailForm, {
          name: data.name,
          industryId: data.industry.id + '',
          addresses: data.addresses.map(item => item.id),
          logo: data.logo,
          introduce: data.introduce || '',
          contact: data.contact || '',
          mobile: data.mobile || '',
          countryCode: data.countryCode || '+86',
          companyTags: data.companyTags.map(item => ({ value: item.id })),
          companyPics: data.companyPics.map(item => ({
            id: item.id,
            url: item.url
          }))
        })
        this.visibile = true
      })
    },
    toPage () {
      _fn.toLocation({ path: '/recruit/enterpriseManage' }) // -> /user/123
    }
  }
}

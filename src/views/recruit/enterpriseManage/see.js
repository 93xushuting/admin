import UpdateCompany from '../../../components/custom/updateCompany/updateCompany.vue'
export default {
  name: 'enterpriseManageSee',
  components: { UpdateCompany },
  data () {
    return {
      breadObj: {
        breadcrumb: {
          isShowBack: false
        }
      },
      id: 0,
      realName: '',
      editStatus: false,
      detailInfo: {
        industry: {},
        addresses: [],
        companyTags: [],
        companyPics: []
      },
      detailForm: {}
    }
  },
  created: function () {
    this.id = this.$route.params.id
    this.realName = this.$route.query.realName
    this.queryCompanyDetail()
  },
  methods: {
    updateEditStatus () {
      this.editStatus = false
    },
    // 查询企业详情
    queryCompanyDetail () {
      const { id } = this
      this._api.recruitQueryCompanyDetail({ id }).then(res => {
        const { data } = res
        this.detailInfo = data
        this.detailForm = Object.assign({}, this.detailForm, {
          name: data.name,
          industryId: data.industry.id + '',
          addresses: data.addresses.map(item => item.id),
          logo: data.logo,
          introduce: data.introduce || '',
          contact: data.contact || '',
          mobile: data.mobile || '',
          prefixMobile: '+86',
          companyTags: data.companyTags.map(item => ({ value: item.id })),
          companyPics: data.companyPics.map(item => ({
            id: item.id,
            url: item.url
          }))
        })
      })
    },
    formatterAddresses (list) {
      return list.map(item => item.details).join(',')
    }
  }
}

import UpdateCandidate from '@c/custom/updateCandidate/UpdateCandidate.vue'

export default {
  components: { UpdateCandidate },
  data () {
    return {
      id: '0',
      title: '新增候选人',
      channelList: [],
      editFormInfo: {}
    }
  },
  created: function () {
    const { id } = this.$route.params
    const { jobId } = this.$route.query
    this.id = id
    this.title = this.id !== '0' ? '编辑候选人信息' : '新增候选人'
    if (this.id === '0') {
      this.editFormInfo.jobId = jobId || ''
      const { queryId } = this.$route.query
      // const { keepAlive } = this.$store.state.keep_alive
      // const deliveryUserInfo = keepAlive.deliveryUserInfo
      console.log('olololololololol', queryId)
      if (queryId) {
        this.requestHandle(queryId)
      }
    } else {
      _fn.getDeliveryChannelList(data => {
        this.channelList = data
        this.requestHandle()
      }, {}, false, false)
    }
  },
  methods: {
    toPage () {
      this.$router.go(-1)
    },
    setValue (data, key) {
      if (data) {
        if (data[key] === 0) {
          return 0
        }
        return data[key] || ''
      }
      return ''
    },
    setPrefix (str) {
      if (str) {
        const arr = str.split('-')
        return {
          prefix: arr.length === 2 ? arr[0] : '+86',
          value: arr[arr.length - 1]
        }
      }
      return {
        prefix: '+86',
        value: ''
      }
    },
    setDeliveryChannelType (id) {
      const list = this.channelList.filter(item => item.id === id)
      if (list.length) {
        return [list[0].type, list[0].id]
      }
      const fixDeliveryChannelTyp = _var._deliveryChannelType__global(id)
      if (fixDeliveryChannelTyp) {
        return ['fix', id]
      }
      return []
    },
    requestHandle (id) {
      let url = ''
      let ids = ''
      if (id) {
        url = 'applicant_public_resume_details'
        ids = id
      } else {
        url = 'job_applicant_details'
        ids = this.id
      }
      this._api[url]({
        id: ids
      }).then(res => {
        const { data } = res
        let identities = this.id !== '0' ? data.identity : data.identities
        let others = this.id !== '0' ? (data.others ? data.others[0] : data.others) : data.others
        const adjustabled = data.adjustabled
        const addressWanted = data.addressWanted || []
        const adjustTime = data.adjustTime
        const partJobTime = data.partJobTime || []
        const baseInfoBirthday = this.setValue(data.baseInfo, 'birthday')
        const baseInfoMarriageBirth = this.setValue(data.baseInfo, 'marriageBirth')
        // const baseInfoStartingTime = (this.setValue(data.baseInfo, 'startingTime') || '').substring(0, 7)
        const baseInfoStartingTime = this.setValue(data.baseInfo, 'startingTime')
        const baseInfoRegisteProvinceId = this.setValue(data, 'registeProvinceId')
        const baseInfoRegisterLocation = this.setValue(data.baseInfo, 'registerLocation')
        const baseInfoCurrentProvinceId = this.setValue(data, 'currentProvinceId')
        const baseInfoCurrentLocation = this.setValue(data.baseInfo, 'currentLocation')
        let editFormInfo = {
          applicationType: id ? 1 : 0,
          idx: this.id, // 大于0时不能编辑 应聘职位
          jobId: data.jobVo ? data.jobVo.id : '',
          resumeId: id,
          companyId: data.jobVo ? data.jobVo.company.id : '',
          addressIds: adjustabled ? ['0'] : addressWanted.map(item => item.id),
          partJobTime: adjustTime ? ['0'] : partJobTime,
          deliveryChannelType: this.setDeliveryChannelType(data.deliveryChannelType),
          recommender: data.recommender || '',
          prefix_recommenderPhoneNumber: this.setPrefix(data.recommenderPhoneNumber).prefix,
          recommenderPhoneNumber: this.setPrefix(data.recommenderPhoneNumber).value,
          baseInfoTemplate: data.baseInfo ? {
            id: this.setValue(data.baseInfo, 'id'),
            name: this.setValue(data.baseInfo, 'name'),
            avatar: this.setValue(data.baseInfo, 'avatar'),
            gender: this.setValue(data.baseInfo, 'gender'),
            birthday: baseInfoBirthday ? new Date(baseInfoBirthday) : '',
            age: this.setValue(data.baseInfo, 'age'),
            valid: this.setValue(data.baseInfo, 'valid'),
            marriageBirth: baseInfoMarriageBirth ? Number(baseInfoMarriageBirth) : '',
            startingTime: baseInfoStartingTime ? new Date(baseInfoStartingTime) : '',
            education: this.setValue(data.baseInfo, 'education'),
            registerLocation: [Number(baseInfoRegisteProvinceId), Number(baseInfoRegisterLocation)].filter(item => !!item),
            registerAddress: this.setValue(data.baseInfo, 'registerAddress'),
            currentLocation: [Number(baseInfoCurrentProvinceId), Number(baseInfoCurrentLocation)].filter(item => !!item),
            currentAddress: this.setValue(data.baseInfo, 'currentAddress'),
            prefix_phoneNumber: this.setPrefix(data.baseInfo.phoneNumber).prefix,
            phoneNumber: this.setPrefix(data.baseInfo.phoneNumber).value,
            wechat: this.setValue(data.baseInfo, 'wechat')
          } : {},
          experienceTemplate: data.experience ? data.experience.map(item => {
            const startTime = this.setValue(item, 'startTime')
            const endTime = this.setValue(item, 'endTime')
            return {
              id: this.setValue(item, 'id'),
              rightNow: !endTime,
              companyName: this.setValue(item, 'companyName'),
              position: this.setValue(item, 'position'),
              timeRequired: this.setValue(item, 'timeRequired'),
              startTime: startTime ? new Date(startTime) : '',
              endTime: endTime ? new Date(endTime) : '',
              referenceName: this.setValue(item, 'referenceName'),
              prefix_referencePhone: this.setPrefix(item.referencePhone).prefix,
              referencePhone: this.setPrefix(item.referencePhone).value,
              description: this.setValue(item, 'description')
            }
          }) : [],
          educationTemplate: data.education ? data.education.map(item => {
            const education = this.setValue(item, 'education')
            const startTime = this.setValue(item, 'startTime')
            const endTime = this.setValue(item, 'endTime')
            return {
              id: this.setValue(item, 'id'),
              rightNow: !endTime,
              education: parseInt(education),
              school: this.setValue(item, 'school'),
              major: this.setValue(item, 'major'),
              startTime: startTime ? new Date(startTime) : '',
              endTime: endTime ? new Date(endTime) : '',
              referenceName: this.setValue(item, 'referenceName'),
              prefix_referencePhone: this.setPrefix(item.referencePhone).prefix,
              referencePhone: this.setPrefix(item.referencePhone).value,
              description: this.setValue(item, 'description')
            }
          }) : [],
          identityTemplate: identities ? identities.map(item => {
            return {
              id: this.setValue(item, 'id'),
              identityType: this.setValue(item, 'identityType'),
              identityName: this.setValue(item, 'identityName'),
              identityNumber: this.setValue(item, 'identityNumber'),
              expiryDate: this.setValue(item, 'expiryDate') ? new Date(this.setValue(item, 'expiryDate')) : '',
              identityPic: {
                fileList: item.identityPic ? item.identityPic.split(',').map(pic => {
                  return {
                    url: pic
                  }
                }) : []
              }
            }
          }) : [],
          othersTemplate: data.others ? {
            id: this.setValue(others, 'id'),
            height: this.setValue(others, 'height'),
            weight: this.setValue(others, 'weight'),
            tags: others.tags ? others.tags.split(',').map(item => {
              return {
                value: item
              }
            }) : [],
            selfDesc: this.setValue(others, 'selfDesc'),
            pics: {
              fileList: others.pics ? others.pics.split(',').map(pic => {
                return {
                  url: pic
                }
              }) : []
            }
          } : { tags: [] }
        }
        this.editFormInfo = editFormInfo
      })
    }
  }
}

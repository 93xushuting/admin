import updateCandidate from '@c/custom/updateCandidate/UpdateCandidate.vue'

export default {
  components: { updateCandidate },
  data () {
    return {
      id: '0',
      channelList: [],
      detailInfo: {}
    }
  },
  created: function () {
    const { id } = this.$route.params
    this.id = id
    _fn.getDeliveryChannelList(data => {
      this.channelList = data
      this.queryDetailInfo()
    }, {}, false)
  },
  computed: {
    updateCandidateVisibile () {
      const list = Object.keys(this.detailInfo)
      if (this.id === '0') {
        return true
      }
      return !!list.length
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
    setIdentityNumberPrefix (str) {
      if (str) {
        const arr = str.split('-')
        return {
          type: arr.length === 2 ? Number(arr[0]) : 1,
          value: arr[arr.length - 1]
        }
      }
      return {
        type: 1,
        value: ''
      }
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
    setRightNow (timestamp) {
      if (timestamp) {
        const date = new Date(timestamp)
        return {
          year: date.getFullYear(),
          value: date
        }
      }
      return {
        year: '',
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
    queryDetailInfo () {
      if (this.id === '0') {
        return
      }
      this._api.applicant_public_resume_details({
        id: this.id
      }).then(res => {
        const { data } = res
        const baseInfoBirthday = this.setValue(data.baseInfo, 'birthday')
        const baseInfoMarriageBirth = this.setValue(data.baseInfo, 'marriageBirth')
        const baseInfoStartingTime = this.setValue(data.baseInfo, 'startingTime')
        const baseInfoRegisteProvinceId = this.setValue(data, 'registeProvinceId')
        const baseInfoRegisterLocation = this.setValue(data.baseInfo, 'registerLocation')
        const baseInfoCurrentProvinceId = this.setValue(data, 'currentProvinceId')
        const baseInfoCurrentLocation = this.setValue(data.baseInfo, 'currentLocation')
        this.detailInfo = {
          id: data.id,
          deliveryChannelType: this.setDeliveryChannelType(data.baseInfo.channelType),
          baseInfoTemplate: data.baseInfo ? {
            id: this.setValue(data.baseInfo, 'id'),
            name: this.setValue(data.baseInfo, 'name'),
            avatar: this.setValue(data.baseInfo, 'avatar'),
            gender: this.setValue(data.baseInfo, 'gender'),
            birthday: baseInfoBirthday ? new Date(baseInfoBirthday) : '',
            age: this.setValue(data.baseInfo, 'age'),
            valid: this.setValue(data.baseInfo, 'valid'),
            identityType: this.setIdentityNumberPrefix(data.baseInfo.identityNumber).type,
            identityNumber: this.setIdentityNumberPrefix(data.baseInfo.identityNumber).value,
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
          experienceTemplate: data.experiences ? data.experiences.map(item => {
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
          educationTemplate: data.educations ? data.educations.map(item => {
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
          identityTemplate: data.identities ? data.identities.map(item => {
            const expiryDate = this.setValue(item, 'expiryDate')
            return {
              id: this.setValue(item, 'id'),
              identityType: this.setValue(item, 'identityType'),
              identityName: this.setValue(item, 'identityName'),
              identityNumber: this.setValue(item, 'identityNumber'),
              expiryDate: expiryDate ? new Date(expiryDate) : '',
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
            id: this.setValue(data.others, 'id'),
            height: this.setValue(data.others, 'height'),
            weight: this.setValue(data.others, 'weight'),
            tags: data.others.tags ? data.others.tags.split(',').map(item => {
              return {
                value: item
              }
            }) : [],
            selfDesc: this.setValue(data.others, 'selfDesc'),
            pics: {
              fileList: data.others.pics ? data.others.pics.split(',').map(pic => {
                return {
                  url: pic
                }
              }) : []
            }
          } : {}
        }
      })
    }
  }
}

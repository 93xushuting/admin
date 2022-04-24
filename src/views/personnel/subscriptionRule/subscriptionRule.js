import formCheck from '@/util/formCheck'

let moneyButtons = [{ label: '不限', value: '0' }, { label: '2000以下', value: '1' }, { label: '2000~3000', value: '2' }, { label: '3000~5000', value: '3' }, { label: '5000~8000', value: '4' }, { label: '8000~10000', value: '5' }, { label: '10000以上', value: '6' }]// 薪资选择

let jobWantedContent = [{ value: 1, label: '离职-随时到岗' }, { value: 2, label: '在职-考虑机会' }, { value: 3, label: '在职-暂不考虑' }]// 职业状态
export default {
  data () {
    return {
      areaOptions: [],
      wantedCityGather: [], // 2级城市集合
      jobContent: [], // 职业集合
      areaCityIdWithParentId: [],
      id: '0',
      form: {
        name: 'form',
        inline: true,
        labelWidth: '102px',
        isShowLabel: true,
        temp: {
          name: {
            label: '规则名称',
            isShow: true,
            maxlength: 20
          },
          gender: {
            formType: 'radio',
            label: '性别',
            isShow: true,
            data: _var.sex2
          },
          age: {
            formType: 'custom',
            label: '年龄要求',
            isShow: true,
            key: 'age'
          },
          minAge: {
            formType: 'custom',
            label: '',
            isShow: true,
            key: 'minAge'
          },
          maxAge: {
            formType: 'custom',
            label: '',
            isShow: true,
            key: 'maxAge'
          },
          registerLocation: {
            formType: 'custom',
            label: '户口所在地',
            isShow: true,
            key: 'registerLocation'
          },
          currentLocation: {
            formType: 'custom',
            label: '现居住地',
            isShow: true,
            key: 'currentLocation'
          },
          education: {
            formType: 'select',
            label: '最高学历',
            isShow: true,
            data: _var.educationRequirement.filter(item => !!item.value)
          },
          experience: {
            formType: 'custom',
            label: '工作经验',
            isShow: true,
            key: 'experience'
          },
          minExp: {
            formType: 'custom',
            label: '',
            isShow: true,
            key: 'minExp'
          },
          maxExp: {
            formType: 'custom',
            label: '',
            isShow: true,
            key: 'maxExp'
          },
          marriageBirth: {
            formType: 'select',
            label: '婚育情况',
            isShow: true,
            data: _var.marriageBirth
          },

          jobWanted: {
            formType: 'select',
            label: '求职状态',
            multiple: true,
            isShow: true,
            data: jobWantedContent// 求职状态，
          },
          wantedJob: {
            formType: 'select',
            label: '期望职位',
            multiple: true,
            isShow: true,
            multipleLimit: 5,
            data: this.jobContent
          },
          wantedCity: {
            formType: 'select',
            label: '期望城市',
            multiple: true,
            isShow: true,
            multipleLimit: 3,
            data: this.wantedCityGather
          },
          wantedMoney: {
            formType: 'select',
            label: '期望薪资',
            isShow: true,
            data: moneyButtons
          },

          tags: {
            formType: 'custom',
            label: '标签类型',
            isShow: true,
            key: 'tags',
            data: []
          }
        },
        ruleForm: {
          name: '',
          gender: 0,
          minAge: '',
          maxAge: '',
          registerLocation: [],
          currentLocation: [],
          education: '',
          minExp: '',
          maxExp: '',
          marriageBirth: '',
          tags: [],
          jobWanted: [],
          wantedJob: [],
          wantedCity: [],
          wantedMoney: ''
        },
        rules: {
          name: formCheck.getRuleObj({
            message: '请输入名称'
          })
        }
      }
    }
  },
  created: function () {
    const { id } = this.$route.params
    this.id = id
    this.requestHandle()
  },
  watch: {
    'form.temp.tags.data': {
      handler: function (list) {
        /* const { ruleForm } = this.form
        this.form = Object.assign({}, this.form, {
          ruleForm: {
            ...ruleForm,
            tags: list.filter(item => item.selected).map(item => {
              return {
                id: item.id,
                name: item.name
              }
            })
          }
        }) */
      },
      deep: true
    }
  },
  computed: {
    minMaxAgeRequirementRule () {
      return formCheck.getRuleObj({
        required: false,
        validator: (rule, value, callback) => {
          if (!(value + '')) {
            return callback()
          }
          if (!/^(1[6-9]|[2-9]\d|100)$/g.test(value)) {
            return callback(new Error('16 到 100 之间的正整数'))
          }
          const { ruleForm } = this.form
          if ((ruleForm.minAge + '') && (ruleForm.maxAge + '')) {
            if (ruleForm.minAge > ruleForm.maxAge) {
              return callback(new Error('最小年龄不能大于最大年龄'))
            }
          }
          callback()
        }
      })
    },
    minMaxExpRequirementRule () {
      return formCheck.getRuleObj({
        required: false,
        validator: (rule, value, callback) => {
          if (!(value + '')) {
            return callback()
          }
          if (!/^(\d|[1-5]\d|60)$/g.test(value)) {
            return callback(new Error('0 到 60 之间的整数'))
          }
          const { ruleForm } = this.form
          if ((ruleForm.minExp + '') && (ruleForm.maxExp + '')) {
            if (ruleForm.minExp > ruleForm.maxExp) {
              return callback(new Error('最小经验不能大于最大经验'))
            }
          }
          callback()
        }
      })
    }
  },
  methods: {
    toPage () {
      this.$router.go(-1)
    },
    async requestHandle () {
      // 查询省市信息
      await new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          this.areaOptions = this.flatAreaOptions(res.data)
          this.wantedCityGather = this.filterAreaOptions(res.data)
          this.form.temp.wantedCity.data = this.wantedCityGather
          resolve('')
        }, { comboType: 7 })
      })
      // 查询人才库标签
      await new Promise((resolve, reject) => {
        _fn.getTag(res => {
          const { temp } = this.form
          this.form = Object.assign({}, this.form, {
            temp: {
              ...temp,
              tags: {
                ...temp.tags,
                data: res.data.filter(item => item.enabled).map(item => {
                  return {
                    name: item.name,
                    id: item.id,
                    selected: false
                  }
                })
              }
            }
          })
          resolve('')
        }, { type: 3 })
      })
      // 职业信息
      await new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          this.jobContent = this.flatJobContent(res.data[0])// res.data[0];
          this.form.temp.wantedJob.data = this.jobContent// this.flatJobContent(this.jobContent);
          resolve('')
        }, { comboType: 2 })
      })
      await this.setDetailInfo()
    },
    setDetailInfo () {
      if (this.id === '0') {
        return
      }
      const detailInfo = JSON.parse(this.$route.query.params)
      const { ruleForm, temp } = this.form
      const tags = temp.tags.data.slice()
      tags.forEach(item => {
        detailInfo.searchParams.tags.forEach(c => {
          if (item.id === c.id) {
            item.selected = true
          }
        })
      })
      const registerLocation = this.setLocation(detailInfo, 'registerLocation')
      const currentLocation = this.setLocation(detailInfo, 'currentLocation')

      let checkedCity = []
      detailInfo.searchParams.expectWorkCityIdList && detailInfo.searchParams.expectWorkCityIdList.map(city => {
        checkedCity.push(Number(city))
      })// 转换选中城市

      let positionList = []
      detailInfo.searchParams.expectPositionListIdList && detailInfo.searchParams.expectPositionListIdList.map(item => {
        positionList.push(Number(item))
      })

      let statusList = []
      detailInfo.searchParams.expectWantedStatusCodeList && detailInfo.searchParams.expectWantedStatusCodeList.map(item => {
        statusList.push(Number(item))
      })
      // 薪资范围
      let moneyCheck = ''
      let min = detailInfo.searchParams.minSalary
      let max = detailInfo.searchParams.maxSalary
      if (min && max) {
        if (min == 0 && max == 2000) {
          moneyCheck = '1'
        } else if (min == 2000 && max == 3000) {
          moneyCheck = '2'
        } else if (min == 3000 && max == 5000) {
          moneyCheck = '3'
        } else if (min == 5000 && max == 8000) {
          moneyCheck = '4'
        } else if (min == 8000 && max == 10000) {
          moneyCheck = '5'
        }
      } else if (min) {
        moneyCheck = '6'
      } else {
        moneyCheck = '0'
      }
      // [{ label: "不限", value: "0" }, { label: "2000以下", value: "1" }, { label: "2000~3000", value: "2" }, { label: "3000~5000", value: "3" }, { label: "5000~8000", value: "4" }, { label: "8000~10000", value: "5" }, { label: "10000以上", value: "6" }]
      console.log(detailInfo, '++++++成了++++++++')
      this.form = Object.assign({}, this.form, {
        temp: {
          ...temp,
          tags: {
            ...temp.tags,
            data: tags
          }
        },
        ruleForm: {
          ...ruleForm,
          name: detailInfo.name,
          gender: detailInfo.searchParams.gender,
          minAge: detailInfo.searchParams.minAge || '',
          maxAge: detailInfo.searchParams.maxAge || '',
          registerLocation: registerLocation.length ? [registerLocation[0].provinceId, registerLocation[0].cityId] : [],
          currentLocation: currentLocation.length ? [currentLocation[0].provinceId, currentLocation[0].cityId] : [],
          education: detailInfo.searchParams.education || '',
          minExp: detailInfo.searchParams.minExp === 0 ? 0 : (detailInfo.searchParams.minExp || ''),
          maxExp: detailInfo.searchParams.maxExp === 0 ? 0 : (detailInfo.searchParams.maxExp || ''),
          marriageBirth: detailInfo.searchParams.marriageBirth || '',
          tags: tags.filter(item => item.selected).map(item => {
            return {
              id: item.id,
              name: item.name
            }
          }),
          jobWanted: statusList || [],
          wantedJob: positionList || [], // detailInfo.searchParams.expectPositionListIdList ,
          wantedCity: checkedCity || [],
          wantedMoney: moneyCheck || ''
        }
      })
    },
    setLocation (detailInfo, key) {
      const result = this.areaCityIdWithParentId.filter(item => {
        return detailInfo.searchParams[key] && item.cityId === Number(detailInfo.searchParams[key])
      })
      return result
    },
    flatAreaOptions (data) {
      function flat (node, parentNode) {
        if (parentNode) {
          node.sub = null
        }
        if (node.sub && node.sub.length) {
          node.sub.forEach(item => {
            flat(item, node)
          })
        }
      }
      data.forEach(item => {
        flat(item)
      })
      data.forEach(item => {
        if (item.sub && item.sub.length) {
          item.sub.forEach(city => {
            this.areaCityIdWithParentId.push({
              provinceId: item.id,
              cityId: city.id
            })
          })
        } else {
          this.areaCityIdWithParentId.push({
            provinceId: item.id,
            cityId: ''
          })
        }
      })
      return data
    },
    // 处理城市数据
    filterAreaOptions (data) {
      let content = []
      data.map(item => {
        if (item.sub.length) {
          item.sub.map(itemChildren => {
            content.push({
              label: itemChildren.title,
              value: itemChildren.id
            })
          })
        }
      })
      return content
    },
    // 处理职业信息
    flatJobContent (data) {
      let content = []
      data.map(item => {
        content.push({
          label: item.title,
          value: item.id
        })
      })
      console.log(content, '++++++处理后的job集合++++++++')
      return content
    },
    selectTagHandle (item) {
      const { temp, ruleForm } = this.form
      const { data } = temp.tags
      let list = data.slice()
      list.forEach(c => {
        if (c.id === item.id) {
          c.selected = !c.selected
        }
      })
      this.form = Object.assign({}, this.form, {
        temp: {
          ...temp,
          tags: {
            ...temp.tags,
            data: list
          }
        },
        ruleForm: {
          ...ruleForm,
          tags: list.filter(item => item.selected).map(item => {
            return {
              id: item.id,
              name: item.name
            }
          })
        }
      })
    },
    formSubmit () {
      const { name, ruleForm } = this.form
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = {
            id: this.id === '0' ? '' : this.id,
            name: ruleForm.name,
            searchParams: {
              gender: ruleForm.gender,
              minAge: ruleForm.minAge,
              maxAge: ruleForm.maxAge,
              registerLocation: ruleForm.registerLocation.length ? ruleForm.registerLocation[1] : '',
              currentLocation: ruleForm.currentLocation.length ? ruleForm.currentLocation[1] : '',
              education: ruleForm.education,
              minExp: ruleForm.minExp,
              maxExp: ruleForm.maxExp,
              marriageBirth: ruleForm.marriageBirth,
              tags: ruleForm.tags,
              expectWantedStatusCodeList: ruleForm.jobWanted, // 求职状态
              expectPositionListIdList: ruleForm.wantedJob, // 期望职位
              expectWorkCityIdList: ruleForm.wantedCity // 期望城市
            }
          }
          // 薪资范围
          let salary = {}
          switch (ruleForm.wantedMoney) {
            case '1':
              salary.minSalary = 0
              salary.maxSalary = 2000
              break
            case '2':
              salary.minSalary = 2000
              salary.maxSalary = 3000
              break
            case '3':
              salary.minSalary = 3000
              salary.maxSalary = 5000
              break
            case '4':
              salary.minSalary = 5000
              salary.maxSalary = 8000
              break
            case '5':
              salary.minSalary = 8000
              salary.maxSalary = 10000
              break
            case '6':
              salary.minSalary = 10000
              break
          }
          params.searchParams = { ...params.searchParams, ...salary }
          this._api[this.id !== '0' ? 'search_template_public_update' : 'search_template_public_add'](params).then(res => {
            _fn.message(res.msg || '操作成功', { type: 'success' })
            this.toPage()
          })
        }
      })
    }
  }
}

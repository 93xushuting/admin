import { MP } from '@/util/bmap.js'
import { setMapSquareOverlay } from '@/util/utils.js'
import formCheck from '../../../util/formCheck'
export default {
  name: 'UpdateCompany',
  props: {
    toPageFlag: {
      type: Boolean,
      default: true
    },
    overflow: {
      type: Boolean,
      default: true
    },
    id: {
      type: [String, Number],
      default: 0
    },
    detailForm: {
      type: Object,
      default: {}
    },
    addCompanyType: {
      type: String,
      default: 'proxy'
    }
  },
  data () {
    return {
      mapDialogConfig: {
        visible: false,
        address: '',
        bmap: {}
      },
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          // 基本
          name: {
            label: '企业名称',
            isShow: true,
            formType: 'input',
            maxlength: 20
          },
          industryId: {
            label: '所属行业',
            isShow: true,
            formType: 'select',
            filterable: true,
            data: []
          },
          headUid: {
            label: '负责人',
            isShow: this.addCompanyType === 'autonomous',
            formType: 'select',
            data: []
          },
          addresses: {
            label: '工作地址',
            isShow: this.addCompanyType === 'proxy',
            formType: 'select',
            multiple: true,
            'collapse-tags': true,
            slotEmpty: true,
            filterable: true,
            data: [],
            style: {
              width: this.addCompanyType === 'autonomous' ? '440px' : '1025px'
            }
          },
          logo: { label: '企业logo', isShow: true, formType: 'custom', key: 'logo' },
          companyAddress: {
            label: '企业地址',
            isShow: this.addCompanyType === 'autonomous',
            formType: 'custom',
            key: 'companyAddress',
            data: []
          },
          detailAddress: {
            label: '详细地址',
            formType: 'custom',
            key: 'detailAddress',
            isShow: this.addCompanyType === 'autonomous'
          },
          introduce: {
            label: '企业介绍',
            isShow: true,
            isShowLabel: true,
            formType: 'custom',
            key: 'introduce'
          },
          contact: {
            label: '联系人',
            isShow: true,
            formType: 'input',
            maxlength: 20
          },
          mobile: {
            class: 'infoForm-input',
            label: '联系方式',
            isShow: true,
            formType: 'custom',
            data: [],
            key: 'mobile'
          },
          initialPwd: {
            label: '初始密码',
            isShow: this.addCompanyType === 'autonomous'
          },
          companyTags: {
            label: ' ', // 企业亮点
            isShow: this.addCompanyType === 'proxy',
            formType: 'custom',
            key: 'companyTags',
            data: []
          },
          companyPics: {
            label: '',
            isShow: true,
            formType: 'custom',
            key: 'companyPics'
          },
          version: {
            label: '使用版本',
            isShow: this.addCompanyType === 'autonomous',
            formType: 'select',
            data: []
          }
        },
        ruleForm: {
          name: '',
          industryId: '',
          headUid: '',
          addresses: [],
          logo: '',
          companyAddress: [],
          detailAddress: '',
          introduce: '',
          contact: '',
          mobile: '',
          countryCode: '+86',
          initialPwd: '',
          companyTags: [],
          companyPics: [],
          version: ''
        },
        rules: {
          name: formCheck.getRuleObj({
            validator: null,
            message: '请输入企业名称'
          }),
          industryId: formCheck.getRuleObj({
            validator: null,
            message: '请选择所属行业',
            trigger: 'change'
          }),
          headUid: formCheck.getRuleObj({
            validator: null,
            message: '请选择负责人',
            trigger: 'change'
          }),
          addresses: formCheck.getRuleObj({
            validator: null,
            type: 'array',
            message: '请选择工作地址',
            trigger: 'change'
          }),
          logo: formCheck.getRuleObj({
            validator: null,
            message: '请上传logo',
            trigger: 'change'
          }),
          companyAddress: formCheck.getRuleObj({
            validator: null,
            message: '请选择企业地址',
            trigger: 'change'
          }),
          contact: formCheck.getRuleObj({
            validator: null,
            required: this.addCompanyType === 'autonomous',
            message: '请输入联系人'
          }),
          mobile: formCheck.getRuleObj({
            validator: null,
            required: this.addCompanyType === 'autonomous',
            opts: {
              pattern: 'phone',
              message: '手机号为7~11位数字'
            }
          }),
          initialPwd: formCheck.getRuleObj({
            validator: null,
            required: this.addCompanyType === 'autonomous',
            message: '请输入初始密码'
          }),
          version: formCheck.getRuleObj({
            validator: null,
            required: this.addCompanyType === 'autonomous',
            message: '请选择版本'
          })
        }
      },
      companyPicsFormModel: {
        fileList: []
      }
    }
  },
  created () {
    const requestHandle = async () => {
      // 获取行业列表
      await _fn.getPublicCombobox(res => {
        this.form.temp['industryId'].data = res.map(item => {
          return {
            label: item.label,
            value: String(item.value)
          }
        })
      }, { comboType: 1 }, true)
      // 获取区号
      await _fn.getPublicCombobox(res => {
        this.form.temp['mobile'].data = res
      }, { comboType: 6 }, true)
      // 地址下拉列表
      await _fn.getAddress(res => {
        this.form.temp.addresses.data = res
        this.form.temp.addresses.slotEmpty = !res.length
      }, {}, true)
      await new Promise((resolve, reject) => {
        // 企业亮点
        _fn.getTag(res => {
          this.form.temp['companyTags'].data = res.data.filter(item => item.enabled).map(item => ({
            labelActive: false,
            label: item.name,
            value: item.id
          }))
          if (this.id !== '0') {
            this.updateCompanyTags()
          }
          resolve('')
        }, { type: 1 })
      })
      await this.$nextTick(function () {
        const { keepAlive } = this.$store.state.keep_alive
        if (!keepAlive.updateCompany) {
          return
        }
        this.form.ruleForm = keepAlive.updateCompany.ruleForm
        this.companyPicsFormModel = {
          fileList: keepAlive.updateCompany.ruleForm.companyPics.slice()
        }
        this.form.temp.companyTags.data.forEach(item => {
          keepAlive.updateCompany.ruleForm.companyTags.forEach(c => {
            if (item.value === c.value) {
              this.$set(item, 'labelActive', true)
            }
          })
        })
      })
    }
    requestHandle()
  },
  watch: {
    detailForm: {
      handler: function (obj) {
        const detailFormObj = JSON.parse(JSON.stringify(obj))
        this.form.ruleForm = Object.assign({}, this.form.ruleForm, {
          ...detailFormObj,
          companyPics: []
        })
        this.companyPicsFormModel = {
          fileList: detailFormObj.companyPics.length ? detailFormObj.companyPics.slice() : []
        }
      },
      immediate: true
    },
    'form.temp.companyTags.data': {
      handler: function (params) {
        this.form.ruleForm.companyTags = params.filter(item => item.labelActive)
      },
      deep: true
    },
    companyPicsFormModel: {
      handler: function (data) {
        this.form.ruleForm.companyPics = data.fileList.map(item => ({
          url: item.url
        }))
      },
      immediate: true
    },
    'mapDialogConfig.visible' (val) {
      const { BMap } = this.mapDialogConfig.bmap
      const rightclickHandle = (e) => {
        const { point } = e
        const { BMap, map } = this.mapDialogConfig.bmap
        this.getAddressByRightClick(BMap, point)
        this.setMapMarker(BMap, map, point)
      }
      if (val && !BMap) {
        this.initMap().then(({ BMap, map }) => {
          this.mapDialogConfig.bmap = { BMap, map }
          map.addEventListener('rightclick', rightclickHandle)
        })
      }
    }
  },
  methods: {
    toPage () {
      if (!this.toPageFlag) {
        this.$parent.queryCompanyDetail()
        this.$parent.updateEditStatus()
        return
      }
      _fn.toLocation({ path: '/recruit/enterpriseManage' }) // -> /user/123
    },
    // 建立地图
    initMap () {
      return new Promise((resolve, reject) => {
        MP(_var.ak).then(BMap => {
          const map = new BMap.Map('map-container', { enableMapClick: false })
          const point = new BMap.Point(116.331398, 39.897445)
          map.centerAndZoom(point, 17)
          map.enableScrollWheelZoom(true)
          this.getCurrentPosition(BMap, map)
          resolve({ BMap, map })
        })
      })
    },
    // ip定位
    getCurrentPosition (BMap, map) {
      const myCity = new BMap.LocalCity()
      myCity.get(r => {
        const { center } = r
        this.getAddressByRightClick(BMap, center)
        this.setMapMarker(BMap, map, center)
      })
    },
    // 根据坐标点获取地址
    getAddressByRightClick (BMap, point) {
      return new Promise((resolve, reject) => {
        const geoc = new BMap.Geocoder()
        geoc.getLocation(point, rs => {
          this.mapDialogConfig.address = rs.address
          resolve('')
        })
      })
    },
    // 设置标注
    setMapMarker (BMap, map, point) {
      map.clearOverlays()
      const SquareOverlay = setMapSquareOverlay(BMap)
      let marker = new SquareOverlay({
        center: point, // 中心坐标
        length: 40, // 容器宽高
        color: 'rgba(38, 51, 79, .6)', // 容器背景
        iconFontClassName: 'icondanxuan-xuanze' // 容器内图标
      })
      map.addOverlay(marker)
      map.panTo(point)
      marker = null
    },
    // 编辑企业亮点默认选中
    updateCompanyTags () {
      const companyTags = this.detailForm.companyTags
      const list = this.form.temp['companyTags'].data.slice()
      list.forEach(item => {
        companyTags.forEach(c => {
          if (item.value === c.value) {
            item.labelActive = true
          }
        })
      })
      this.form.temp['companyTags'].data = list
    },
    // 企业亮点标签
    labelClick (item) {
      item.labelActive = !item.labelActive
    },
    // logo
    avatarUploadSuccess (url) {
      this.form.ruleForm.logo = url
    },
    mapDialogEnter () {
      this.mapDialogConfig.visible = false
      this.form.ruleForm.detailAddress = this.mapDialogConfig.address
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          const {
            name,
            industryId,
            addresses,
            logo,
            introduce,
            contact,
            countryCode,
            mobile,
            companyTags,
            companyPics
          } = this.form.ruleForm
          this._api[this.id !== '0' ? 'recruitCompanyUpdate' : 'recruitCompanyAdd']({
            id: this.id !== '0' ? this.id : '',
            name,
            industryId: Number(industryId),
            addresses: addresses.map(item => ({ id: item })),
            logo,
            introduce,
            contact,
            countryCode,
            mobile,
            companyTags: companyTags.map(item => ({
              id: item.value,
              type: item.type
            })),
            companyPics
          }).then(res => {
            _fn.message(res.msg || '保存成功', { type: 'success' })
            this.toPage()
          })
        }
      })
    }
  }
}

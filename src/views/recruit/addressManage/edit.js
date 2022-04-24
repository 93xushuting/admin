import { MP } from '@/util/bmap.js'
import { setMapSquareOverlay } from '@/util/utils.js'
import formCheck from '@/util/formCheck'
export default {
  name: 'addressManageEdit',
  data () {
    return {
      formerId: '',
      formerCompanyId: '',
      id: '0',
      cascaderOptions: [],
      title: '',
      mapLoading: false,
      form: {
        name: 'form.ruleForm',
        labelWidth: '130px', // form 宽度
        formInline: true, // form  设置 inline 属性可以让表单域变为行内的表单域
        isShowLabel: true, // 是否显示label
        temp: {
          companyId: {
            label: '所属企业',
            isShow: true,
            formType: 'select',
            data: [],
            style: { width: '800px' },
            filterable: true
          },
          name: { label: '门店名称', isShow: true, formType: 'input', maxlength: 50, style: { width: '800px' } },
          address: {
            label: '地区',
            isShow: true,
            formType: 'custom',
            filterable: true,
            key: 'address',
            style: {
              width: '800px'
            }
          },
          details: { label: '详细地址', isShow: true, formType: 'input', style: { width: '800px' } },
          mapPiont: { label: '地图选点', isShow: true, formType: 'custom', key: 'mapPiont', style: { width: '800px' } }
        },
        ruleForm: {
          companyId: '',
          name: '',
          address: [],
          details: '',
          lat: '',
          lng: ''
        },
        rules: {
          name: formCheck.getRuleObj({
            message: '请输入门店名称'
          }),
          address: formCheck.getRuleObj({
            type: 'array',
            message: '请选择地址'
          })
        }
      },
      mapDetail: {
        address: '',
        surroundingPois: [],
        point: {
          lat: '',
          lng: ''
        }
      },
      searchPiontValue: '',
      searchPoiList: [],
      baiduMapData: null
    }
  },
  created: function () {
    this.id = this.$route.params.id
    this.$route.meta.name = this.id !== '0' ? '编辑地址' : '新增地址'
    this.title = this.$route.meta.name

    const requestHandle = async () => {
      await this.getEnterprise()
      await this.getPublicCombobox()
      await this.queryAddressDetail()
    }
    requestHandle()
  },
  computed: {
    mapDetailInfo () {
      return this.getMapDetailInfo(this.mapDetail)
    }
  },
  methods: {
    getEnterprise () {
      return new Promise((resolve, reject) => {
        _fn.getEnterprise(res => {
          this.form.temp.companyId.data = res
          resolve('getEnterprise')
        }, {}, true)
      })
    },
    getPublicCombobox () {
      return new Promise((resolve, reject) => {
        _fn.getPublicCombobox(res => {
          const { data } = res
          this.cascaderOptions = this.filterData(data)
          resolve('getPublicCombobox')
        }, { comboType: 7 })
      })
    },
    // 查询地址详情
    queryAddressDetail () {
      return new Promise((resolve, reject) => {
        const { id } = this
        if (id === '0') {
          const { query } = this.$route
          if (query.json) {
            const data = JSON.parse(query.json)
            this.setRuleForm({
              name: data.address.name,
              provinceId: Number(data.address.provinceId),
              cityId: Number(data.address.cityId),
              districtId: Number(data.address.districtId),
              companyId: data.company ? data.company.id : '',
              details: data.address.details,
              lat: data.address.lat,
              lng: data.address.lng
            })
          }
          resolve('queryAddressDetail')
          return
        }
        this._api.recruitAddressDetails({ id }).then(res => {
          const { query } = this.$route
          const { data } = res
          data.companyId = query.companyId
          this.formerId = query.id
          this.formerCompanyId = data.companyId
          console.log('我是获取到的值为什么不使用', data)
          this.setRuleForm(Object.assign(data, {
            provinceId: Number(data.provinceId),
            cityId: Number(data.cityId),
            districtId: Number(data.districtId)
          }))
          resolve('queryAddressDetail')
        })
      })
    },
    // -----
    getMapDetailInfo (mapDetail) {
      const { address, surroundingPois, point, addressComponents } = mapDetail
      const list = surroundingPois.filter((item, index) => !index)
      return {
        address: list.length ? list[0].address : address,
        // title: list.length ? list[0].title : address,
        // point: list.length ? list[0].point : point,
        // addressComponents: addressComponents,
        // address: address || list[0].address,
        title: list.length ? list[0].title : address,
        point: list.length ? list[0].point : point,
        addressComponents: addressComponents
      }
    },
    filterData (list) {
      function strReplace (node) {
        if (node.sub && node.sub.length) {
          node.sub.forEach(item => {
            strReplace(item)
          })
        } else {
          node.sub = null
        }
      }
      list.forEach(item => {
        strReplace(item)
      })
      return list
    },
    toPage () {
      this.$router.go(-1)
      // _fn.toLocation({ path: '/recruit/addressManage' }) // -> /user/123
    },
    setRuleForm (data) {
      const { provinceId, cityId, districtId } = data
      // 根据省市区id获取title
      const [provinceTitle, cityTitle, districtTitle] = this.addressTitleIdParseHandle(provinceId, cityId, districtId)
      // 
      const provinceTitleReg = new RegExp(provinceTitle, 'g')
      const cityTitleReg = new RegExp(cityTitle, 'g')
      const districtTitleReg = new RegExp(districtTitle, 'g')
      this.form.ruleForm = {
        companyId: data.companyId,
        name: data.name,
        address: [provinceId, cityId, districtId].filter(item => !!item),
        // details: data.details.replace(provinceTitleReg, '').replace(cityTitleReg, '').replace(districtTitleReg, ''),
        details: data.details,
        lat: data.lat,
        lng: data.lng
      }
      this.searchPiontValue = this.form.ruleForm.details
      // 更新地图
      this.$nextTick(() => {
        const { BMap, map } = this.baiduMapData
        const point = new BMap.Point(data.lng * 1, data.lat * 1)
        this.getAddressByRightClick(BMap, point).then(() => {
          // this.selectedMapPoint() // 暂时去掉
        })
        this.setMapMarker(BMap, map, point)
      })
    },
    addressTitleIdParseHandle (p, c, d) {
      const field = /^\d+$/g.test(p) ? 'id' : 'title'
      const setFeld = field === 'id' ? 'title' : 'id'
      let province = ''
      let city = ''
      let district = ''
      let provinceGroup = this.cascaderOptions.filter(item => {
        return field === 'id' ? (item[field] === p) : (!!p.match(item[field]))
      })
      if (provinceGroup.length) {
        const { sub } = provinceGroup[0]
        province = provinceGroup[0][setFeld]
        if (sub && sub.length) {
          const cityGroup = sub.filter(item => {
            return field === 'id' ? (item[field] === c) : (!!c.match(item[field]))
          })
          if (cityGroup.length) {
            const { sub } = cityGroup[0]
            city = cityGroup[0][setFeld]
            if (sub && sub.length) {
              const districtGroup = sub.filter(item => {
                return field === 'id' ? (item[field] === d) : (!!d.match(item[field]))
              })
              if (districtGroup.length) {
                district = districtGroup[0][setFeld]
              }
            }
          }
        }
      }
      return [province, city, district]
    },
    // 用户选择地址，输入详细地址，地图选点触发
    userSearchPiont (data) {
      let value = ''
      if (typeof data === 'object') {
        const [provinceId, cityId, districtId] = data
        const addressTitles = this.addressTitleIdParseHandle(provinceId, cityId, districtId)
        value = addressTitles.reduce((total, item, index, arr) => (total += item), '')
      } else {
        value = data
      }
      if (!value) {
        return
      }
      const { BMap, map } = this.baiduMapData
      this.getPointByAddress(BMap, map, value)
    },
    // 建立地图
    initMap (address) {
      return new Promise((resolve, reject) => {
        MP(_var.ak).then(BMap => {
          const map = new BMap.Map('allmap', { enableMapClick: false })
          const point = new BMap.Point(116.331398, 39.897445)
          map.centerAndZoom(point, 17)
          map.enableScrollWheelZoom(true)
          if (address) {
            this.getPointByAddress(BMap, map, address)
          } else {
            this.getCurrentPosition(BMap, map)
          }
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
    // 根据地址解析获得坐标
    getPointByAddress (BMap, map, value) {
      const { address } = this.form.ruleForm
      const [provinceId, cityId, districtId] = address
      const addressTitles = provinceId ? this.addressTitleIdParseHandle(provinceId, cityId, districtId) : []
      const myGeo = new BMap.Geocoder()
      console.log('我每次获取到的值是啥呀addressTitles', addressTitles, 'value', value)
      myGeo.getPoint(value, point => {
        if (point) {
          this.getAddressByRightClick(BMap, point)
          this.setMapMarker(BMap, map, point)
          this.form.ruleForm = Object.assign({}, this.form.ruleForm, {
            lat: point.lat + '',
            lng: point.lng + ''
          })
          // if (value) {
          //   this.userSearchPiont1(value)
          // }
        }
      }, addressTitles[1] ? addressTitles[1] + addressTitles[2] : value)
    },
    // 根据坐标点获取地址
    getAddressByRightClick (BMap, point) {
      return new Promise((resolve, reject) => {
        const geoc = new BMap.Geocoder()
        geoc.getLocation(point, rs => {
          this.mapDetail = rs
          console.log('我是返回的地址', rs)
          resolve(rs)
        })
        // this.userSearchPiont1(BMap)
      })
    },
    getAddressByRightClick1 (data) { // 用户输入详细地址，地图选点触发(特殊处理,根据坐标获取地址)
      const { BMap, map } = this.baiduMapData
      let that = this
      var local = new BMap.LocalSearch(map, {
        pageCapacity: 50,
        renderOptions: { map: map },
        onMarkersSet (array) {
          console.log('我是出现的marker', array)
          array.forEach((item, index) => {
            item.marker.addEventListener('click', function (e) {
              console.log('我是点击marker', e, item, this.getPosition(), index)
              that.getAddressByRightClick(BMap, item.point).then(rs => {
                that.mapDetail = {
                  address: item.address,
                  addressComponents: {
                    ...rs.addressComponents
                  },
                  business: item.title,
                  point: item.point,
                  surroundingPois: [
                    {
                      address: item.address,
                      title: item.title,
                      point: item.point,
                      addressComponents: {
                        ...rs.addressComponents
                      }
                    }
                  ]
                }
              })
            })
          })
        },
        onSearchComplete (res) {
          var pp = local.getResults()
          console.log('我是搜索POI', pp)
          that.searchPoiList = pp.Ir || pp.Hr
          if (pp) { // 暂时不加
            let item = that.searchPoiList[0]
            if (item) {
              that.getAddressByRightClick(BMap, item.point).then(rs => {
                that.mapDetail = {
                  address: item.address,
                  addressComponents: {
                    ...rs.addressComponents
                  },
                  business: item.title,
                  point: item.point,
                  surroundingPois: [
                    {
                      address: item.address,
                      title: item.title,
                      point: item.point,
                      addressComponents: {
                        ...rs.addressComponents
                      }
                    }
                  ]
                }
              })
            }
          }
        }
      })
      local.search(data)
    },
    // 设置标注
    setMapMarker (BMap, map, point) {
      map.clearOverlays()
      const SquareOverlay = setMapSquareOverlay(BMap)
      // const marker = new BMap.Marker(point)
      const marker = new SquareOverlay({
        center: point, // 中心坐标
        length: 40, // 容器宽高
        color: 'rgba(38, 51, 79, .6)', // 容器背景
        iconFontClassName: 'icondanxuan-xuanze' // 容器内图标
      })
      map.addOverlay(marker)
      map.panTo(point)
    },
    // 选点确定
    selectedMapPoint () {
      const { addressComponents, point, address } = this.getMapDetailInfo(this.mapDetail)
      const { province, city, district } = addressComponents
      this.form.ruleForm = Object.assign({}, this.form.ruleForm, {
        address: this.addressTitleIdParseHandle(province, city, district).filter(item => !!item),
        details: address,
        lat: point.lat + '',
        lng: point.lng + ''
      })
    },
    save () {
      this.$refs[this.form.name].validate((valid) => {
        if (valid) {
          const { id } = this
          const { companyId, name, address, details, lat, lng } = this.form.ruleForm
          const [provinceId, cityId, districtId] = address
          const addressTitles = this.addressTitleIdParseHandle(provinceId, cityId, districtId)
          const addressTitlesString = addressTitles.reduce((total, item, index, arr) => (total += item), '')
          this._api[id !== '0' ? 'recruitAddressUpdate' : 'recruitAddressAdd']({
            id: id === '0' ? '' : id,
            name,
            provinceId,
            cityId,
            districtId: districtId || '',
            details: addressTitlesString + details.replace(/.+?(省|市|自治区|行政区|自治州|县|区|街道)/g, ''),
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          }).then(res => {
            console.log(res)
            // 新增
            if (id === '0') {
              this.bindCompany(res, companyId)
              return
            }
            // 编辑
            this.bindCompany({
              data: {
                id: this.formerId,
                address: {
                  id: res.data.id
                }
              }
            }, companyId === this.formerCompanyId ? '' : companyId)
          })
        }
      })
    },
    // 绑定企业
    bindCompany (res, companyId) {
      if (!companyId) {
        _fn.message(res.msg || '保存成功', { type: 'success' })
        this.toPage()
        return
      }
      const { id, address } = res.data
      this._api.address_bind_company({
        id,
        addressId: address.id,
        companyId: companyId
      }).then(res => {
        _fn.message(res.msg || '保存成功', { type: 'success' })
        this.toPage()
      })
    },
    // 添加搜索服务
    addSearchService () {
      let that = this
      const { BMap, map } = this.baiduMapData
      const ac = new BMap.Autocomplete({
        input: this.$refs['base-input'].$el.getElementsByClassName('el-input__inner')[0],
        location: BMap
      })
      ac.addEventListener('onhighlight', (e) => {
        // console.log('onhighlight', e)
      })
      ac.addEventListener('onconfirm', (e) => {
        console.log('onconfirm', e.item)
        if (e.item) {
          let str = ''
          if (e.item.value.province) {
            str = str + e.item.value.province
          }
          if (e.item.value.city) {
            str = str + e.item.value.city
          }
          if (e.item.value.district) {
            str = str + e.item.value.district
          }
          str = str + e.item.value.business
          that.searchPiontValue = str
          // that.userSearchPiont(str)
          that.getAddressByRightClick1(str)
        }
      })
    }
  },
  mounted () {
    this.initMap().then(res => {
      this.baiduMapData = res
      const { BMap, map } = res
      const rightclickHandle = (e) => {
        const { point } = e
        console.log('我是右击事件', e)
        this.getAddressByRightClick(BMap, point)
        this.setMapMarker(BMap, map, point)
        this.$once('hook:beforeDestroy', function () {
          map.removeEventListener('rightclick', rightclickHandle)
        })
      }
      map.addEventListener('rightclick', rightclickHandle)
      this.addSearchService()
    })
  }
}

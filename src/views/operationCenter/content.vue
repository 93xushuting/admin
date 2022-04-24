<template>
  <!-- 内容广场 -->
  <zp-page :obj="obj" ref="page" class="content-wrapper">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`首页轮播`,value: 'start'}, {label:`职位分享卡片`,value: 'card'}]" />
    <template v-if="tagName === 'start'">
      <!-- 查询条件 -->
      <zp-condition slot="condition" :obj="obj">
        <!-- 小于三个元素时 -->
        <template slot="form">
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.name" name="name" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.status" name="status" :obj="obj.searchModel" />
          <zp-dynamicFormItem :formItem="obj.searchModel.temp.cityId" name="cityId" :obj="obj.searchModel" @change="changeCity" />
        </template>
        <template slot="btns"></template>
      </zp-condition>
      <!-- 加载表格数据 -->
      <el-row class="rows">
        <el-col v-if="_fn.checkBtn('banner/add')" :span="5" :offset="1">
          <div class="pics2" @click="toAdd">
            <div class="txt">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </el-col>
        <el-col :span="5" v-for="(item,index) in obj.tableObj.data" :key="index" :offset="1">
          <div :class="{
              pics: true,
              grayscale: item.status === 0
            }">
            <div class="picsContent">
              <div class="title">
                <i class="iconfont icondian"></i>
                {{item.name}}
              </div>
              <div class="time">更新时间：{{item.updatedTime}}</div>
              <div class="img"><img :src="item.url" width="100%" height="100%" /></div>
              <div class="btns">
                <zp-button v-if="_fn.checkBtn('banner/update')" type="text" @click="toEdit(item)">编辑</zp-button>
                <zp-button v-if="item.status === 1 && _fn.checkBtn('banner/updateSort')" type="text" @click="updateSort(item)">排序</zp-button>
                <zp-button type="text" @click="stop(item)" v-if="item.status === 1 && _fn.checkBtn('banner/updateStatus')">停用</zp-button>
                <zp-button type="text" @click="start(item)" v-if="item.status === 0 && _fn.checkBtn('banner/updateStatus')">启用</zp-button>
                <zp-button type="text" @click="getCode(item)" v-if="item.pageType === 3 && _fn.checkBtn('banner/updateStatus')">专属码</zp-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="pagination-wrap" :style="isIe ? `position:absolute;width: 100%;top:${reversedMessage || height}px` : ''">
        <zp-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="obj.tableObj.pager.pageNo" :page-size="obj.tableObj.pager.pageSize"
          :total="obj.tableObj.pager.pageTotal">
        </zp-pagination>
      </div>
    </template>
    <template v-if="tagName === 'card'">
      <div class="position-card-wrapper">
        <div class="position-card" v-for="(item, index) in cardList" :key="index">
          <div class="position-card-item"
            :style="{backgroundImage: item.file ? `url(${item.file})` : 'url(../../../static/image/position-default.png)' }">
            <div class="card-content">
              <div class="card-user-box">
                <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small"></el-avatar>
                 <!-- <img class="user-avatar" src="../../../static/image/logo.png" alt="">调试 -->
                 <span>此处显示微信昵称</span>
                </div>
              <p class="position-title">20k-25k<span>/月</span></p>
              <div class="position-name">
                <span>设计及项目管理</span>
              </div>
              <div>品牌名称</div>
              <div class="position-tag">
                <span>包吃</span>
                <span>年终奖</span>
                <span>五险一金</span>
              </div>
              <div class="position-company">
                <img src="../../../static/image/weihai-logo.png" alt="">
                <span>四川海底捞餐饮股份有限公司</span>
              </div>
              <div class="position-image">
                <img src="../../../static/image/logo.png" alt="">
              </div>
            </div>
          </div>
          <span class="image-upload" v-show="isShowEdit">
            <zp-upload uploadType="card" :formModel.sync="item.file" ref="picsList">
              <template slot="card">
                <span>{{item.file ? '点击替换' : '点击上传'}}</span>
              </template>
            </zp-upload>
          </span>
        </div>
      </div>
      <div class="editFooter">
        <zp-button type="primary" v-if="!isShowEdit" @click="isShowEdit = true">编 辑
        </zp-button>
        <zp-button @click="toSave" type="primary" v-if="isShowEdit">保 存
        </zp-button>
        <zp-button @click="toCancel" v-if="isShowEdit">取 消</zp-button>
      </div>
    </template>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" width="504px" />
    <!-- 调整排序 -->
    <zp-dynamicDialog slot="dialog" :obj="dialogAuth" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem :formItem="dialogAuth.temp.move" name="move" :obj="dialogAuth" key="move" />
      </template>
    </zp-dynamicDialog>
    <!-- 启用 -->
    <zp-dynamicDialog slot="dialog" :obj="dialogStart" ref="dialogForm">
      <template slot="form">
        <p class="startTip"><zp-icons />您是否确认启用<span style="color:#4a84ff;">{{ dialogStart.ruleForm.name }}</span>轮播图？启用后，职微你求职者小程序将同步上架展示轮播图</p>
        <zp-dynamicFormItem :formItem="dialogStart.temp.sort" name="sort" :obj="dialogStart" key="move" />
      </template>
    </zp-dynamicDialog>
    <!-- 查看 -->
    <zp-dynamicDialog slot="dialog" :obj="dialogCode" ref="dialogForm">
      <template slot="form">
        <el-form-item label="链接地址">
          <el-input v-model="dialogCode.ruleForm.channelUrl" style="width:440px;" />
          <el-button type="text" v-clipboard:copy="dialogCode.ruleForm.channelUrl" v-clipboard:success="copyUrl">复制链接</el-button>
        </el-form-item>
        <el-form-item label=" 专属码">
          <img :src="dialogCode.ruleForm.channelCode" width="153px" hieght="145px"><br />
          <i class="el-icon-download" style="color:#4a84ff"></i>
          <el-button type="text" @click="table_location_down(dialogCode.ruleForm)">立即下载</el-button>
        </el-form-item>
      </template>
    </zp-dynamicDialog>
  </zp-page>
</template>
<script>
import { formatDate, userDownLoadImage } from '@/util/utils'
export default {
  name: 'content',
  data () {
    var sortRequirement = (rule, value, callback) => { // 最大经验要求
      if (value === '') {
        return callback(new Error('请输入排序'))
      }
      if (!/^([1-9]\d{0,3}|10000)$/g.test(value)) {
        return callback(new Error('1 到 10000 之间的整数'))
      }
      callback()
    }
    return {
      tagName: 'start', // tabs 默认选中的值
      isShowEdit: false,
      cardList: [],
      dialogTip: {},
      statusSize: 0,
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'banner_pageList'
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '70px', // label宽度
            inline: true,
            temp: {
              name: {
                formType: 'input',
                label: '渠道名称',
                placeholder: '请输入标题',
                maxlength: 30,
                isShow: true,
                isShowLabel: true, // 不显示label
                'prefix-icon': 'el-icon-search'
              },
              status: {
                formType: 'select',
                label: '状态',
                data: _var.stateAll,
                isShow: true,
                clearable: false
              },
              cityId: {
                formType: 'select',
                label: '城市',
                placeholder: '请选择',
                data: [],
                isShow: true
              }
            },
            ruleForm: {
              name: '',
              status: '',
              cityId: ''
            }
          },
          tableObj: {
            data: [],
            fields: [],
            operation: {},
            btnList: [],
            pager: {
              pageNo: 1, // 第几页
              pageSize: 20, // 每页多少条
              pageTotal: 0 //  共多少条
            }
          }
        }
      }),
      dialogAuth: { // 排序
        title: '调整顺序',
        dialogFormCenter: false, // 所有内空居中显示
        dialogWidth: '504px',
        isShowLabel: true, // 是否显示label
        labelWidth: '80px', // label宽度
        show: false,
        temp: {
          move: { formType: 'input', label: '排序', isShow: true, style: { width: '250px' } }
        },
        ruleForm: { move: '' },
        rules: {
          move: [{ validator: sortRequirement, text: '请输入排序', required: true, trigger: 'blur' }]
        },
        callback: this.commitSort
      },
      dialogStart: { // 启用
        title: '启用轮播图',
        dialogFormCenter: false, // 所有内空居中显示
        dialogWidth: '504px',
        isShowLabel: true, // 是否显示label
        labelWidth: '80px', // label宽度
        show: false,
        temp: {
          sort: { formType: 'input', label: '排序', isShow: true, style: { width: '250px' } }
        },
        ruleForm: { name: '', sort: '' },
        rules: {
          sort: [{ validator: sortRequirement, text: '请输入排序', required: true, trigger: 'blur' }]
        },
        callback: this.commitStart
      },
      dialogCode: {
        title: '专属码',
        dialogFormCenter: false, // 所有内空居中显示
        dialogWidth: '800px',
        isShowLabel: true, // 是否显示label
        labelWidth: '80px', // label宽度
        show: false,
        isCancel: false,
        confirmText: '关闭',
        temp: {},
        ruleForm: {},
        callback: (params, fn) => {
          fn()
        }
      }
    }
  },
  computed: {
    isIe () {
      console.info('ActiveXObject isIe')
      return !!window.ActiveXObject || 'ActiveXObject' in window
    }
  },
  beforeRouteLeave (to, form, next) {
    if (!to.name.match(/(contentEdit)/g)) {
      this.$store.dispatch('keep_alive/setKeepAlive', {
        content: null
      })
    }
    next()
  },
  created () {
    const { keepAlive } = this.$store.state.keep_alive
    const { http, searchModel, tableObj } = this.obj
    const keepAliveRuleForm = keepAlive.content ? keepAlive.content.ruleForm : searchModel.ruleForm
    const keepAlivePager = keepAlive.content ? keepAlive.pager : {
      pageNo: 1
    }
    this.obj = Object.assign({}, this.obj, {
      http: {
        ...http
      },
      searchModel: {
        ...searchModel,
        ruleForm: { ...keepAliveRuleForm }
      },
      tableObj: {
        ...tableObj,
        pager: {
          ...tableObj.pager,
          ...keepAlivePager
        }
      }
    })
  },
  mounted () {
    this.getCardList()
    this._ossService.ossReady()
    const requestHandle = async () => {
      _fn.getPublicCombobox(res => {
        let allArr = [{ label: '全国', value: '0' }]
        let cityArr = res.map(item => {
          return {
            label: item.label,
            value: String(item.value)
          }
        })
        this.obj.searchModel.temp.cityId.data = allArr.concat(cityArr)
      }, { comboType: 9 }, true)
    }
    requestHandle()
  },
  methods: {
    async getCardList () {
      const { code, data } = await this._api.template_job_share_list()
      if (code === 0) {
        this.cardList = []
        data.forEach(item => {
          this.cardList.push({ file: item })
        })
      }
    },
    toCancel () {
      // this.$router.go(-1)
      this.isShowEdit = false
      this.getCardList()
    },
    async toSave () {
      let templateUrlList = this.cardList.map(item => item.file)
      let params = {
        templateUrlList: templateUrlList
      }
      const res = await this._api.template_job_share_add(params)
      if (res.code !== 0) {
        return this.notify(res.msg || '操作失败', error)
      }
      this.isShowEdit = false
    },
    toAdd () {
      let status = false
      // let num = 0
      // if (this.obj.searchModel.ruleForm.cityId === '0') { // 全国时数量最多为3个城市为6个
      //   if (this.statusSize >= 3) {
      //     status = true
      //     num = 3
      //   }
      // } else {
      //   if (this.statusSize >= 6) {
      //     status = true
      //     num = 6
      //   }
      // }
      if (status) {
        this.isAddShow('新增轮播图', `您当前启用的${num === 3 ? '全国' : '城市'}轮播图已达${num}个，新增的轮播图将默认为停用状态后可自行调整。`, '确定', () => {
          _fn.toLocation({
            name: 'contentEdit',
            params: {
              id: 0
            },
            query: { max: true }
          }) // -> /user/123
        }, 'el-icon-warning')
      } else {
        _fn.toLocation({ name: 'contentEdit', params: { id: 0 } }) // -> /user/123
      }
    },
    toEdit (item) {
      _fn.toLocation({ name: 'contentEdit', params: { id: item.id } }) // -> /user/123
    },
    updateSort (data) { // 排序
      this.dialogAuth.show = true
      this.$nextTick(() => {
        this.dialogAuth.ruleForm.move = data.sort
        this.dialogAuth.id = data.id
      })
    },
    loadAfter (res, fn) {
      const { tableObj, searchModel } = this.obj
      const { pager } = tableObj
      const { ruleForm } = searchModel
      this.$store.dispatch('keep_alive/setKeepAlive', {
        content: { ruleForm },
        pager: {
          pageNo: pager.pageNo,
          pageSize: pager.pageSize
        }
      })
      let size = 0
      let d = []
      if (res && res.list && res.list.length) {
        d = res.list.map(item => {
          try {
            let purl = JSON.parse(item.pictureUrl)
            if (purl && purl.length) {
              item.url = (purl && purl[0] && purl[0].url) || ''
            }
          } catch (e) {
            item.url = item.pictureUrl || ''
          }
          if (item.status === 1) {
            size = size + 1
          }
          return item
        })
      }
      this.statusSize = size
      this.obj.tableObj.data = d
      this.obj.tableObj.pager.pageTotal = res.total
    },
    sizeChange (val) {
      this.obj.tableObj.pager.pageSize = val
      this.pagerCallback(true)
    },
    currentChange (val) { // currentPage 改变时会触发
      this.obj.tableObj.pager.pageNo = val
      this.pagerCallback()
    },
    changeCity () {
      this.pagerCallback(true)
    },
    pagerCallback (flag) {
      if (flag) {
        this.obj.tableObj.pager.pageNo = 1
      }
      this.$refs.page.load()
      // let param = {
      //   pageReq: {
      //     page: this.obj.tableObj.pager.pageNo,
      //     size: this.obj.tableObj.pager.pageSize
      //   },
      //   queryParam: {}
      // }
      // Object.assign(param.queryParam, this.obj.searchModel.ruleForm || {})
      // this._api.banner_pageList(param).then((res) => {
      //   this.loadAfter(res.data)
      // })
    },
    stop (data) { // 停用
      this.isAddShow('停用轮播图', `您是否确认停用<span style="color:#4a84ff;"> ${data.name} </span>轮播图？停用后，职微你求职者小程序将同步下架轮播图不再展示。`, '', () => {
        console.info(11111)
        this._api.banner_updateStatus({ id: data.id, status: false }).then((res) => {
          this.notify(res.msg || '操作成功', 'success')
          this.dialogTip.show = false
          this.$refs.page.load()
        })
      })
    },
    start (data) { // 启用
      this.dialogStart.show = true
      this.$nextTick(() => {
        this.dialogStart.ruleForm.name = data.name
        this.dialogStart.ruleForm.sort = data.sort
        this.dialogStart.id = data.id
      })
      // let status = false
      // let num = 0
      // if (this.obj.searchModel.ruleForm.cityId === '0') {
      //   if (this.statusSize >= 3) {
      //     status = true
      //     num = 3
      //   }
      // } else {
      //   if (this.statusSize >= 6) {
      //     status = true
      //     num = 6
      //   }
      // }
      // if (status) {
      //   this.isAddShow('启用失败', `当前启用中的${num === 3 ? '全国' : '城市'}轮播图已达到${num}个，无法启用。`, '我知道了', () => {
      //     this.dialogTip.show = false
      //   }, 'el-icon-warning')
      // } else {
      //   this.isAddShow('启用轮播图', `您是否确认启用<span style="color:#4a84ff;"> ${data.name} </span>轮播图？启用后，职微你求职者小程序将同步上架展示轮播图，默认排序为1。`, '', () => {
      //     this.dialogTip.show = false
      //     this._api.banner_updateStatus({ id: data.id, status: true }).then((res) => {
      //       this.notify(res.msg || '操作成功', 'success')
      //       this.dialogTip.show = false
      //       this.$refs.page.load()
      //     })
      //   })
      // }
    },
    commitSort () { // 排序
      let id = this.dialogAuth.id
      let sort = this.dialogAuth.ruleForm.move
      this._api.banner_updateSort({ id, sort }).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialogAuth.show = false
        this.$refs.page.load()
      })
    },
    commitStart () { // 启用
      let param = {
        id: this.dialogStart.id,
        sort: this.dialogStart.ruleForm.sort,
        status: true
      }
      this._api.banner_updateStatus(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialogStart.show = false
        this.$refs.page.load()
      })
    },
    isAddShow (title = '', message = '', confirmText = '', fn, icon = '') {
      let self = this
      let dia = {
        icon,
        title: title,
        tbody: message,
        titleSve: true,
        show: true,
        confirmText: confirmText,
        isConfirm: _fn.isFunction(fn), // 是否显示取消按钮
        isCancel: confirmText !== '我知道了', // 是否显示取消按钮
        confirmCallback: fn
      }
      this.dialogTip = dia
    },
    getCode (item) {
      this.dialogCode.show = true
      this.$nextTick(() => {
        this._api.banner_getById({ id: item.id }).then((res) => {
          this.dialogCode.ruleForm = JSON.parse(JSON.stringify(res.data))
        })
      })
    },
    copyUrl () {
      this.$message({ message: '复制成功', type: 'success' })
    },
    table_location_down (item) {
      const fileName = item.name || '运营渠道名称.jpg'
      const url = this._ossService.downLoad(item.channelCode, fileName)
      userDownLoadImage(url, fileName)
    },
    resetAfter (tempSearch, callback) {
      const { searchModel, tableObj } = this.obj
      this.obj = Object.assign({}, this.obj, {
        searchModel: {
          ...searchModel,
          ruleForm: {
            name: '',
            status: '',
            cityId: ''
          }
        },
        tableObj: {
          ...tableObj,
          pager: {
            ...tableObj.pager,
            pageNo: 1
          }
        }
      })
      this.$nextTick(() => {
        callback()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content-wrapper{
  display: flex;
  flex-direction: column;
  overflow: initial;
  min-width: 1300px;
}
.rows{
  flex: auto;
  overflow: auto;
  margin: 0 20px;
  padding: 0 50px 0 0;
  background: #F7F8FA;
  border-radius: 4px;
  .pics2{
    width:100%;
    position: relative;
    .txt{
      background: #fff;
      border: 1px solid #DCDCDC;
      border-radius: 4px;
      height: 234px;
      margin-top: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        color: #DFDFDF;
        font-size: 80px;
        position: absolute;
      }
    }
  }
  .pics{
    margin-top: 30px;
    background: #fff;
    position: relative;
    height: 236px;
    display: flex;
    justify-content: center;
    .picsContent {
      width: 184px;
    }
    .img{
      width: 184px;
      height:98px;
    }
    .time{
      font-size: 12px;
      color: #69707F;
      margin: 12px 0 ;
    }
    .title{
      font-size: 16px;
      color: #26334F;
      padding-top: 20px;
      position: relative;
      i{
        color: #7AE8A8;
        font-size: 24px;
        position: absolute;
        left: -28px;
      }
    }
    .btns{
      
    }
  }
  .grayscale{
    filter: grayscale(100%);
  }
}
/deep/ .pagination-wrap {
  /*margin-top:5px;
  box-shadow: 0px -12px 10px -15px #ccc;*/
  height: 48px;
  border-top:1px solid #2e384d1a;
  &::before{
    clear:both;
  }
  .el-pagination {
    padding:7px 15px;
    float: right;
    span,button,.el-pager li{
      line-height: 34px;
      height: 34px;
    }
    .el-pager li:hover {
      color: #606266;
    }
    .number{
      font-weight: normal;
    }
  }
  .el-icon-arrow-left {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-right-color: #333;
    padding-left: 6px;
  }
  .el-icon-arrow-left:before, .el-icon-arrow-right:before {
    content: "";
  }
  .el-icon-arrow-right {
    font-weight: 800;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-left-color: #333;
    margin-left: 12px;
  }
}
// 新增职位卡片样式
.position-card-wrapper {
  height: 100%;
  margin: 20px 20px 70px 20px;
  padding: 50px;
  background: #F7F8FA;
  display: flex;
  overflow-x:auto ;
  .position-card {
    margin-right: 20px;
    text-align: center;
    min-height: 540px;
  }
  .position-card-item {
    text-align: left;
    width: 315px;
    height: 560px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    margin-bottom: 28px;
    background-color: #fff;
    box-shadow: 0px 10px 14px 0px rgba(77,83,98,0.06);
  }
  .card-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100px;
    width: 265px;
    height: 204px;
    box-sizing: border-box;
    font-size: 12px;
    .card-user-box{
        display:flex;
        align-items: center;
      .user-avatar{
         width: 28px;
         height: 28px;
         margin-right:8px;
         border-radius:50%;
      }
    }
    .position-title {
      font-size: 17px;
      font-weight: 600;
      margin: 5px 0 8px 0;
      color: #FE5C56;
      span {
        font-weight: 400;
        margin-left: 6px;
        font-size: 13px;
      }
    }
    > div {
      padding-bottom: 6px;
    }
    .position-name {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 600;
      padding-bottom:12px;
    }
    .position-tag {
      margin: 0px 0px 4px 0;
      > span {
        display: inline-block;
        padding: 0px 3px;
        color: #69707F;
        border-left: 1px solid #69707F;
      }
      > span:first-child {
        border: none;
      }
    }
    .position-company {
      display: flex;
      color: 333333;
      padding: 0;
      > img {
        width: 20px;
        height: 20px;
        margin-right: 6px;
        border-radius: 3px;
      }
    }
    .position-image {
      text-align: center;
      color: #888;
      > img {
        display: block;
        width: 74px;
        height: 70px;
        margin: 15px 0px 0px 170px;
        margin-bottom: 6px;
      }
      > p {
        font-size: 10px;
        margin: 0px;
        padding: 0px;
      }
    }
  }
  .image-upload {
    cursor: pointer;
    color: #4a84ff;
  }
}
/deep/ .dialogTable {
  .startTip {
    width: 370px;
    margin: 0 auto 10px;
    svg {
      float: left;
      margin-right: 10px;
    }
  }
}
</style>

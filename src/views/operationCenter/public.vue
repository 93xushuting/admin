<template>
  <!-- 公众号推送 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`职位邀请`,value: 'start'}]" />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" inline="true" style="margin: 20px 0 80px;">
      <el-form-item label="职位邀请" prop="pushSwitch">
        <el-switch v-model="ruleForm.pushSwitch" active-text="开" inactive-color="#ff4949" inactive-text="关" active-value="1" inactive-value="0" />
        &nbsp;&nbsp;职微你小程序求职者职位邀请<br />
        <el-radio-group v-model="ruleForm.osDefault" :disabled="ruleForm.pushSwitch ==='0'" @change="changeGroup">
          <el-radio :label="'0'">
            系统自动邀请
            <el-tooltip class="item" effect="dark" content="系统将根据用户的行为数据偏好匹配职位进行邀请" placement="top">
              <i class="el-icon-info" style="color: #8798AD;" />
            </el-tooltip>
          </el-radio>
          <el-radio :label="'1'">自定义设置</el-radio>
        </el-radio-group>
      </el-form-item><br />
      <el-form-item label="推送频率" prop="">
        <el-form-item prop="pushFrequencyOne">
          <el-select v-model="ruleForm.pushFrequencyOne" placeholder="请选择" style="width:130px" :disabled="ruleForm.pushSwitch ==='0'">
            <el-option v-for="item in pushFrequencyNumList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="pushFrequencySecond">
          <el-select v-model="ruleForm.pushFrequencySecond" placeholder="请选择" style="width:130px" :disabled="ruleForm.pushSwitch ==='0'">
            <el-option v-for="item in (ruleForm.pushFrequencyOne === '1'?pushFrequencySecondList:pushFrequencySecondList2)" :key="item.value"
              :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="pushFrequencyThird">
          <el-select v-model="ruleForm.pushFrequencyThird" :collapse-tags="true" multiple placeholder="请选择" style="width:164px"
            :disabled="ruleForm.pushSwitch ==='0'" v-if="ruleForm.pushFrequencyOne === '1'">
            <el-option v-for="item in pushFrequencyThirdList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="推送时间">
        <el-form-item prop="pushTime">
          <el-time-picker :disabled="ruleForm.pushSwitch ==='0'" v-model="ruleForm.pushTime"
            :picker-options="{selectableRange: '07:00:00 - 22:00:00'}" placeholder="推送时间" format="HH:mm" value-format="HH:mm" :clearable="false" />
        </el-form-item>
      </el-form-item><br />
      <el-form-item label="消息模版配置">
        <div class="settingTemp">
          <div class="title">{{obj.title || '提示'}}
            <el-button v-if="_fn.checkBtn('weChatOfficialPush/addWeChatMessageTemplates')" type="text" class="right el-icon-edit" @click="editTemp"
              :disabled="ruleForm.pushSwitch ==='0'">编辑
            </el-button>
          </div>
          <div class="subTitle">{{obj.greetings || ' -- ' }}</div>
          <div>招聘单位：<span class="col">{{obj.recruitmentUnit || ' -- '}}</span></div>
          <div>招聘岗位：<span class="col">{{obj.recruitmentStatus || ' -- '}}</span></div>
          <div>工作地点：<span class="col">{{obj.workPlace || ' -- '}}</span></div>
          <div>薪资待遇：<span class="col">{{obj.salary || ' -- '}}</span></div>
          <div class="more">详情 <i class="right el-icon-arrow-right" /></div>
        </div>
      </el-form-item><br />
      <el-form-item label="推送职位配置" prop="pushTime" v-if="ruleForm.osDefault === '1'">
        <el-button :disabled="ruleForm.pushSwitch ==='0'" type="text" @click="toEdit">编辑</el-button>
      </el-form-item><br />
      <el-form-item label=" " v-if="ruleForm.osDefault ==='1'">
        <div class="tableCountLabel" v-for="(item,index) in ruleForm.recommendPositionDTOSList" :key="index">{{item.positionName}}</div>
      </el-form-item>
    </el-form>
    <div class="editFooter">
      <!-- <zp-button @click="$router.go(-1)">取消</zp-button> -->
      <zp-button v-if="_fn.checkBtn('weChatOfficialPush/addWeChatOfficialMessageConfig')" @click="saveAll" class="zp-btn-primary">确定</zp-button>
    </div>
    <!-- 消息模版配置 -->
    <zp-dynamicDialog slot="dialog" :obj="dialog" ref="dialogForm">
      <template slot="form">
        <zp-dynamicFormItem :formItem="dialog.temp.title" name="title" :obj="dialog" :key="index" />
        <zp-dynamicFormItem :formItem="dialog.temp.greetings" name="greetings" :obj="dialog" :key="index" />
        <zp-dynamicFormItem :formItem="dialog.temp.recruitmentUnit" name="recruitmentUnit" :obj="dialog" :key="index" />
        <zp-dynamicFormItem :formItem="dialog.temp.recruitmentStatus" name="recruitmentStatus" :obj="dialog" :key="index" />
        <zp-dynamicFormItem :formItem="dialog.temp.workPlace" name="workPlace" :obj="dialog" :key="index" />
        <zp-dynamicFormItem :formItem="dialog.temp.salary" name="salary" :obj="dialog" :key="index" />
      </template>
    </zp-dynamicDialog>
  </zp-page>
</template>
<script>
export default {
  name: 'public',
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      params__: {},
      pushFrequencyNumList: [ // 推送频率1  1每周 2每天
        { value: '1', label: '每周' },
        { value: '2', label: '每天' }
      ],
      pushFrequencySecondList: [ // 推送频率2
        { value: '1', label: '1次' },
        { value: '2', label: '2次' },
        { value: '3', label: '3次' }
      ],
      pushFrequencySecondList2: [ // 推送频率2
        { value: '1', label: '1次' }
      ],
      pushFrequencyThirdList: [ // 推送频率3
        { value: '1', label: '周一' },
        { value: '2', label: '周二' },
        { value: '3', label: '周三' },
        { value: '4', label: '周四' },
        { value: '5', label: '周五' },
        { value: '6', label: '周六' },
        { value: '7', label: '周日' }
      ],
      obj: {
        greetings: '', // 招呼语
        recruitmentStatus: '', // 招聘岗位
        recruitmentUnit: '', // 招聘单位
        salary: '', // 当前用户id
        title: '', // 微信模板标题
        weChatOfficialMessageTemplateId: '', // 微信模板信息的ID
        workPlace: '' // 工作地点
      },
      ruleForm: {
        pushSwitch: '1', // 推送开关  0关,1开
        osDefault: '1', // 系统推荐/自定义 0系统默认 1自定义
        pushFrequencyNum: '1',
        pushFrequencyOne: '1', // 推送频率 一级 每周
        pushFrequencySecond: '1', // 推送频率 二级 1次 2次 3次
        pushFrequencyThird: ['1'], // 推送频率 三级 周一周二周三周四周五周六周日
        pushTime: '07:00', // 推送时间
        recommendPositionDTOSList: [ // 推送职位配置
          // { positionName: item.name, positionId: item.id }
        ]
      },
      rules: {
        pushFrequencyThird: [
          {
            required: true,
            message: '请选择'
          }
        ],
        pushTime: [
          {
            required: true,
            message: '请选择推送时间'
          }
        ]
      },
      dialog: {
        dialogFormCenter: true, // 所有内空居中显示
        dialogWidth: '1000px',
        isShowLabel: true, // 是否显示label
        labelWidth: '140px', // label宽度
        temp: {
          title: { formType: 'text', label: '招呼语', isShow: true },
          greetings: { type: 'textarea', label: '招呼语', isShow: true, limit: true, maxlength: 100, rows: 3 },
          recruitmentUnit: { label: '招聘单位', isShow: true, limit: true, maxlength: 20 },
          recruitmentStatus: { label: '招聘岗位', isShow: true, limit: true, maxlength: 20 },
          workPlace: { label: '工作地点', isShow: true, limit: true, maxlength: 20 },
          salary: { label: '薪资待遇', isShow: true, limit: true, maxlength: 20 }
        },
        ruleForm: {
          title: '',
          greetings: '', // 招呼语
          recruitmentUnit: '', // 招聘单位
          recruitmentStatus: '', // 招聘岗位
          workPlace: '', // 工作地点
          salary: '', // 薪资待遇
          weChatOfficialMessageTemplateId: '' // 微信模板信息的ID
        },
        rules: {
          greetings: [{ required: true, message: '请输入招呼语', trigger: 'change' }], // 招呼语
          recruitmentUnit: [{ required: true, message: '请输入招聘单位', trigger: 'change' }], // 招聘单位
          recruitmentStatus: [{ required: true, message: '请输入招聘岗位', trigger: 'change' }], // 招聘岗位
          workPlace: [{ required: true, message: '请输入工作地点', trigger: 'change' }], // 工作地点
          salary: [{ required: true, message: '请输入薪资待遇', trigger: 'change' }] // 薪资待遇
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      try {
        this.params__ = JSON.parse(localStorage.getItem('operationCenter_public_callback')) || {}
      } catch (e) {
        this.params__ = {}
      }
      this.getObj()
    })
  },
  methods: {
    getObj (val = '', pushSwitch) {
      if (this.params__.type__ === 'operationCenter_public_callback') {
        this.obj = this.params__.weChatOfficialMessageTemplatesVo || {}
        this.ruleForm = Object.assign(this.ruleForm, this.params__)
        localStorage.removeItem('operationCenter_public_callback')
      } else {
        let p = {}
        if (val === '0' || val === '1') {
          p.requestOsDefault = val
        }
        this._api.weChatOfficialPush_getWeChatOfficialMessageConfig(p).then((res) => {
          this.obj = (res.data && res.data.weChatOfficialMessageTemplatesVo) || {}
          this.ruleForm = Object.assign(this.ruleForm, {
            ...res.data,
            pushSwitch: pushSwitch || res.data.pushSwitch
          })
        })
      }
    },
    changeGroup (val) { // 0 系统默认 1 自定义
      this.getObj(val, this.ruleForm.pushSwitch)
      console.info(val)
    },
    editTemp () {
      this.dialog.title = '模板消息配置'
      this.dialog.show = true
      this.$nextTick(() => {
        this.dialog.ruleForm = _fn.extend({}, this.dialog.ruleForm, this.obj)
        console.info(this.dialog.ruleForm)
        this.dialog.callback = () => {
          let obj = _fn.copy(this.dialog.ruleForm)
          this._api.weChatOfficialPush_addWeChatMessageTemplates(obj).then((res) => {
            this.notify(res.msg || '操作成功', 'success')
            this.dialog.ruleForm = {}
            this.dialog.show = false
            this.getObj(this.ruleForm.osDefault, this.ruleForm.pushSwitch)
          })
        }
      })
    },
    goto (name, param, isFlag = true) {
      if (isFlag) {
        // this.$store.dispatch('keep_alive/setKeepAlive', { obj: this.obj, processId: this.processId })
        this.$store.dispatch('keep_alive/setKeepAlive', param)
      }
      _fn.toLocation({ name: name, params: param }) // -> /user/123
    },
    toEdit (item) {
      let p = _fn.copy(this.ruleForm)
      p.type__ = 'operationCenter_public'
      localStorage.setItem('operationCenter_public', JSON.stringify(p))
      this.goto('publicEdit', { id: 0 })
      // this.ruleForm.type__ = 'operationCenter_public'
      // this.goto('publicEdit', { id: encodeURI(JSON.stringify(this.ruleForm)) })
    },
    saveAll () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let obj = _fn.copy(this.ruleForm)
          if ((obj.recommendPositionDTOSList && obj.recommendPositionDTOSList.length) || obj.osDefault === '0') {
            this._api.weChatOfficialPush_addWeChatOfficialMessageConfig(obj).then((res) => {
              this.notify(res.msg || '操作成功', 'success')
              this.getObj()
            })
          } else {
            this.notify('请先选择推送职位配置')
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.settingTemp{
  width:350px;
  background: #FFFFFF;
  border: 1px solid #E9EAED;
  border-radius: 4px;
  padding: 16px 22px 0;
  font-size: 14px;
  line-height: 30px;
  color: #808080;
  .title{
    color: #26334F;
    position: relative;
    .right{
      position: absolute;
      right: 0;
    }
  }
  .subTitle{
    color: #E8A037;
    line-height: 19px;
    margin: 20px 0;
    /* &::after{
      content: '>';
      position: absolute;
    } */
  }
  .col{
    color: #26334F;
  }
  .more{
    border-top: 1px solid #E5E5E5;
    margin-top: 24px;
    line-height: 44px;
    position: relative;
    .right{
      position: absolute;
      right: 0;
      top: 16px;
    }
  }
}
.tableCountLabel{
    display: inline-block;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid rgba(46,56,77,.1);
    color: #2e384d;
    margin: 0 20px 5px 0;
    border-radius: 16px;
    cursor: pointer;
    background: #fff;
  }
</style>

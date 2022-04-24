<template>
  <zp-dynamicDialog slot="dialog" :obj="dialog" ref="dialogForm">
    <template slot="form">
      <div class="dialogContent" v-if="dialog.ruleForm.type === 0">
        <p>“{{ dialog.ruleForm.jobName }}”岗位有新简历投递，赶快去处理吧！</p>
        <zp-button type="text" @click="handle">去处理 ></zp-button>
      </div>
      <div class="dialogContent" v-if="dialog.ruleForm.type === 1">
        <p>即将有新面试开始，请提前准备好哦！</p>
        <span>面试岗位：{{ dialog.ruleForm.jobName }}</span>
        <span>面试时间：{{ dialog.ruleForm.interviewTime }}</span>
        <span>面试地址：{{ dialog.ruleForm.interviewAddress }}</span>
        <span>联系人：{{ dialog.ruleForm.contactName }}</span>
        <span>联系人电话：{{ dialog.ruleForm.phoneNumber }}</span>
        <span>注意事项：{{ dialog.ruleForm.remark }}</span>
        <zp-button type="text" @click="handle">查看候选人信息 ></zp-button>
      </div>
      <div class="dialogContent" v-if="dialog.ruleForm.type === 2">
        <p>即将有新同事入职，可以提前准备哦！</p>
        <span>入职岗位：{{ dialog.ruleForm.jobName }}</span>
        <span>入职员工：{{ dialog.ruleForm.enrollmentName }}</span>
        <span>入职时间：{{ dialog.ruleForm.enrollmentTime }}</span>
        <zp-button type="text" @click="handle">查看员工信息 ></zp-button>
      </div>
    </template>
  </zp-dynamicDialog>
</template>
<script>
import { callbackify } from 'util'
export default {
  name: 'customMailTips',
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      dialog: {
        show: false,
        dialogFormCenter: true, // 所有内空居中显示
        dialogWidth: '660px',
        sideDialog: false,
        name: 'dialog.ruleForm',
        isShowLabel: true, // 是否显示label
        labelWidth: '120px', // label宽度
        isCancel: false,
        titleSve: true,
        confirmText: '我知道了',
        temp: {},
        ruleForm: {},
        callback: () => { this.updateReadStatus('2') }
      }
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   console.info('userPsw', _store.state.user.obj.realName)
    // })
  },
  methods: {
    callbackCommit () {
      let param = this.dialog.ruleForm
      this._api.user_modify_pwd(param).then((res) => {
        this.notify(res.msg || '操作成功', 'success')
        this.dialog.show = false
        _fn.toLocation('/login')
      })
    },
    show (item) {
      console.log('opopopop', item)
      let title
      if (item.type === 0) {
        title = '新简历提醒'
      }
      if (item.type === 1) {
        title = '面试提醒'
      }
      if (item.type === 2) {
        title = '入职提醒'
      }
      this._api.stationMessage_getStationMessageInfo({ id: item.id }).then((res) => {
        this.dialog.show = true
        this.dialog.title = title
        this.dialog.ruleForm = res.data
      })
    },
    updateReadStatus (num) {
      let ids = []
      if (num === '2') {
        ids.push(this.dialog.ruleForm.id)
      } else {
        ids = this.tableSelectedData.filter(item => !item.readStatus).map(item => item.id)
      }
      let param = {
        type: ids.length ? 0 : 1,
        ids: ids
      }
      this._api.stationMessage_updateReadStatus(param).then(res => {
        this.dialog.show = false
        let callback = this.$parent['load']
        callback && callback()
      })
    },
    handle () {
      this.updateReadStatus('2')
      _fn.toLocation({ name: 'deliveryDetail', params: { id: this.dialog.ruleForm.jobApplicantId } })
    },
    clean () {
      this.dialog.ruleForm = {

      }
    }
  }
}
</script>
<style lang="less" scoped>
.iconyincangmima,.iconxianshimima{
  cursor: pointer;
}
.dialogContent {
  p {
    color: #26334F;
    line-height: 14px;
  }
  span {
    display: block;
    color: #69707F;
    line-height: 22px;
  }
}
</style>

<template>
  <!-- 招聘漏斗 -->
  <zp-page :obj="obj" ref="page">
    <zp-breadcrumb slot="breadcrumb" :obj="obj">
      <el-tooltip slot="btns" class="item" effect="dark" content="投递数据的转化分析" placement="right">
        <el-button icon="el-icon-warning-outline" type="text" style="color:#26334F;"></el-button>
      </el-tooltip>
    </zp-breadcrumb>
    <!-- 查询条件 -->
    <zp-condition slot="condition" :obj="obj" :isArrowDown="true" @onchangeToggle="onchangeToggle">
      <template slot="formFrist">
        <div style="display: inline-block;line-height: 32px;font-size:14px;">
          <i class="iconfont iconshaixuan" />
          <span>有 <span style="color:#409EFF;">{{searchCount}}</span> 个筛选条件</span>
        </div>
        <zp-select v-model="obj.searchModel.ruleForm.timeType" :data="_var.recruit_status" :clearable="false" class="infoForm-input" size="small" />
        <zp-datePick v-model="obj.searchModel.ruleForm.time" @change="searchModelChange('time')" type="daterange" prefixIcon="el-icon-time"
          startPlaceholder="开始时间" endPlaceholder="结束时间" rangeSeparator="至" :pickerOptions="pickerOptions" />
        <el-tooltip slot="btns" class="item" effect="dark" placement="top">
          <div slot="content">操作进度时间：按照招聘阶段状态实际发生量统计，即本周入职的不一定是本周面试的；<br />投递时间：按照投递数据垂直跟踪最新状态统计，即查看投递数据的最新状态转化；</div>
          <el-button size="mini" icon="el-icon-warning-outline" type="text" style="color:#26334F;margin: 0 12px;"></el-button>
        </el-tooltip>
      </template>
      <!-- 小于三个元素时 -->
      <template slot="form">
        <template v-for="(item,index) in obj.searchModel.temp">
          <zp-dynamicFormItem :formItem="item" :name="index" :obj="obj.searchModel" :key="index" @change="searchModelChange" />
        </template>
      </template>
      <template slot="btns">
        <el-form-item>
          <zp-button @click="toSaveCharts" icon="el-icon-download" v-if="isCharts">保存漏斗图</zp-button>
          <zp-button @click="toExportData" icon="el-icon-upload2" v-if="!isCharts">导出数据</zp-button>
        </el-form-item>
      </template>
    </zp-condition>
    <div style="padding: 0 20px  12px;line-height:32px;" slot="tableCount">
      <el-button-group>
        <el-button size="small" :type="isCharts?'primary':''" icon="iconfont iconloudou" @click="changeCharts(1)"></el-button>
        <el-button size="small" :type="!isCharts?'primary':''" icon="iconfont iconbaobiao" @click="changeCharts(0)"></el-button>
      </el-button-group>
      <el-radio-group v-model="obj.searchModel.ruleForm.calBasis" size="medium" style="float: right;" @change="changeRadio">
        <el-radio-button :label="1">按人数</el-radio-button>
        <el-radio-button :label="0">按投递数</el-radio-button>
      </el-radio-group>
    </div>
    <template v-if="isCharts">
      <div id="container"></div>
    </template>
    <template v-if="!isCharts">
      <!-- 加载表格数据 -->
      <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe>
        <template slot="customMode_createor" slot-scope="props">
          <el-table-column :label="props.customProps.label">
            <template slot-scope="scope">
              {{scope.row.createBy && scope.row.createBy.realName}}
            </template>
          </el-table-column>
        </template>
      </zp-dynamicTable>
    </template>
    <!-- 所有提示信息 -->
    <zp-tipDialog :obj="dialogTip" />
  </zp-page>
</template>
<script>
import html2canvas from 'html2canvas'
import { formatDate } from '@/util/utils'
export default {
  name: 'recruitReportIndex',
  data () {
    return {
      searchCount: 0, // 查询条件数量
      isCharts: true,
      tagName: 'start', // tabs 默认选中的值
      dialogTip: {},
      defaultDept: [],
      obj: new _baseData().call(this, () => {
        return {
          breadcrumb: {
            title: this.$route.meta.name || ''
          },
          http: {
            queryUrl: '',
            updateUrl: '',
            addUrl: '',
            delUrl: ''
          },
          searchModel: {
            isShowLabel: true, // 是否显示label
            labelWidth: '100px', // label宽度
            inline: true,
            temp: {
              companyIds: { formType: 'select', label: '企业', isShow: true, filterable: true, data: [], multiple: true, 'collapse-tags': true },
              jobIds: { formType: 'select', label: '职位', isShow: true, filterable: true, data: [], multiple: true, 'collapse-tags': true },
              departmentIds: { formType: 'select', label: '部门', isShow: true, filterable: true, data: [], multiple: true, 'collapse-tags': true },
              timeRequired: { formType: 'select', label: '工作性质', isShow: true, filterable: true, data: _var.workNature, multiple: true, 'collapse-tags': true },
              headUserIds: { formType: 'select', label: '职位负责人', isShow: true, filterable: true, data: [], multiple: true, 'collapse-tags': true },
              applicantCreateUserIds: { formType: 'select', label: '投递创建人', isShow: true, filterable: true, data: [], multiple: true, 'collapse-tags': true }
            },
            ruleForm: {
              timeType: 0,
              time: [],
              startTime: '',
              endTime: '',
              companyIds: [],
              jobIds: [],
              departmentIds: [],
              timeRequired: [],
              headUserIds: [],
              applicantCreateUserIds: [],
              calBasis: 1 // 报表类型 1:按人数，0：按投递数
            }
          },
          tableObj: {
            operation: {
              width: 130, // 每列列最小宽度
              // 全选
              selection: false,
              selection_width: 50,
              selection_fixed: true,
              // 序号
              index: true,
              index_width: 50,
              index_fixed: true,
              // 操作列  
              operation: false,
              operation_width: 140,
              operation_fixed: true
            },
            btnList: [],
            fields: [
              { key: 'name', label: '部门' },
              { key: 'description', label: '职位名称' },
              { key: 'description', label: '职位负责人' },
              { key: 'description', label: '投递人数' },
              { key: 'description', label: '通过初筛人数' },
              { key: 'description', label: '初筛率' },
              { key: 'description', label: '到面人数' },
              { key: 'description', label: '到面率' },
              { key: 'description', label: '通过面试人数' },
              { key: 'description', label: '过面率' },
              { key: 'description', label: '录用数' },
              { key: 'description', label: '录用率' },
              { key: 'description', label: '入职数' },
              { key: 'description', label: '入职率' }
            ]
          }
        }
      }),
      changeChartType: 1,
      chartOptsData: {
        x: [],
        y: [],
        percent: []
      },
      pickerOptions: {
        shortcuts: [
          { text: '昨日', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 1) } },
          { text: '今日', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 2) } },
          { text: '上周', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 3) } },
          { text: '本周', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 4) } },
          { text: '上月', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 5) } },
          { text: '本月', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 6) } },
          { text: '本季度', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 7) } },
          { text: '本年', onClick: (picker) => { _fn.setPickerOptionsTime.call(picker, 8) } }
        ]
      }
    }
  },
  created () {
    this.getUserDept()
  },
  mounted () {
    this.getChartsDom()
    this.requestHandle()
  },
  methods: {
    requestHandle: async function () {
      this.obj.searchModel.temp.companyIds.data = await _fn.commonBox('company_public_list') // 所属企业
      this.obj.searchModel.temp.departmentIds.data = await _fn.commonBox('dept_public_dept_list') // 部门
      this.obj.searchModel.temp.jobIds.data = await _fn.commonBox('job_public_position_list') // 职位
      this.obj.searchModel.temp.headUserIds.data = await _fn.commonBox('user_public_link_users', {}, false, { label: 'realName', value: 'id' }) // 职位负责人
      this.obj.searchModel.temp.applicantCreateUserIds.data = await _fn.commonBox('user_public_user_list', {}, false, { label: 'realName', value: 'id' }) // 投递创建人
      this.obj.searchModel.ruleForm.time = _fn.setPickerOptionsTime(4) // 默认设置本周
      this.searchModelChange('time')
      // 手动执行查询
      this.obj.http.queryUrl = 'report_form_public_echart'
      this.$refs.page.load()
    },
    getUserDept () { // // 当前用户所在部门
      this._api.report_form_public_default_dept({}).then((res) => {
        let d = (res && res.data) || []
        this.obj.searchModel.ruleForm.departmentIds = d
        this.defaultDept = d
      })
    },
    getCurTime (time) {
      var d = new Date(time)
      let mm = d.getMonth() + 1
      let dd = d.getDate()
      return (d.getFullYear() + '-' + (mm < 10 ? `0${mm}` : mm) + '-' + (dd < 10 ? `0${dd}` : dd)) // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds())
    },
    searchModelChange (type) {
      let count = 0
      let o = this.obj.searchModel.ruleForm
      if (type === 'time') {
        if (o.time) {
          o.startTime = this.getCurTime(o.time[0])
          o.endTime = this.getCurTime(o.time[1])
        } else {
          o.startTime = ''
          o.endTime = ''
        }
      }
      if (o.startTime && o.endTime) {
        count++
      }
      if (o.companyIds && o.companyIds.length) {
        count++
      }
      if (o.jobIds && o.jobIds.length) {
        count++
      }
      if (o.departmentIds && o.departmentIds.length) {
        count++
      }
      if (o.timeRequired && o.timeRequired.length) {
        count++
      }
      if (o.headUserIds && o.headUserIds.length) {
        count++
      }
      if (o.applicantCreateUserIds && o.applicantCreateUserIds.length) {
        count++
      }
      this.searchCount = count
    },
    loadBefor (params) {
      params.queryParam = this.obj.searchModel.ruleForm
      return params
    },
    loadAfter (data) {
      if (this.changeChartType === 1) {
        // console.info('loadAfter', data)
        // data.countData = ['1', '1', '1', '1', '1', '1', '1', '1', '1']
        // data.percent = ['', '100.00%', '100.00%', '100.00%', '100.00%', '100.00%', '100.00%', '100.00%', '100.00%']
        this.chartOptsData.x = (data.countData || []).reverse()
        this.chartOptsData.y = (data.showTitles || []).reverse()
        this.chartOptsData.percent = (data.percent || []).reverse()
        this.onchangeToggle()
        this.getChartsDom()
      } else { // 表格
        this.obj.tableObj.fields = data.showTitles || []
        this.obj.tableObj.data = (data.pageData && data.pageData.list) || []
        this.obj.tableObj.pager.pageTotal = (data && data.pageData && +data.pageData.total) || 0
      }
    },
    resetAfter (param, fn) {
      this.obj.searchModel.ruleForm = param
      this.obj.searchModel.ruleForm.time = _fn.setPickerOptionsTime(4) // 默认设置本周
      this.obj.searchModel.ruleForm.departmentIds = this.defaultDept
      this.searchModelChange('time')

      fn && fn()
    },
    // 保存漏斗图
    toSaveCharts () {
      html2canvas && html2canvas(document.querySelector('#container')).then(function (canvas) {
        var image = canvas.toDataURL('image/png')
        var a = document.createElement('a')
        a.download = '招聘漏斗' + formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss')
        a.href = image
        document.body.append(a)
        a.click()
      })
    },

    // 导出表格
    toExportData () {
      let param = {
        pageReq: {
          page: this.obj.tableObj.pager.pageNo,
          size: this.obj.tableObj.pager.pageSize
        },
        queryParam: this.obj.searchModel.ruleForm
      }
      _fn.downLoad('report_form_public_export', param, '招聘漏斗数据明细' + formatDate(new Date(Date.now()), 'yyyy-MM-dd HH：mm：ss'))
    },

    // 切换 按投递数/按人数
    changeRadio (v) {
      this.$refs.page.load()
    },

    // 切换 漏斗图/表格
    changeCharts (type) {
      this.isCharts = type
      if (type === 1) {
        this.obj.http.queryUrl = 'report_form_public_echart'
      } else {
        this.obj.http.queryUrl = 'report_form_public_table'
      }
      this.changeChartType = type
      this.$refs.page.load()
    },
    getChartsDom () {
      this.$nextTick(() => {
        if (echarts) {
          this.myChart = echarts.init(document.getElementById('container'))
          if (this.myChart) {
            let option = this.getOpts()
            // console.info(option, 'option', JSON.stringify(option))
            this.myChart.setOption(option, true)
            this.onresizeTable()
          }
        }
      })
    },
    onchangeToggle () { // 展开
      this.$nextTick(() => {
        console.info('this.myChart', this.myChart)
        let ele = document.getElementById('container')
        let h2 = window.innerHeight - (ele.offsetTop + 52 + 49 + 24) + 14
        ele.style.height = h2 + 'px'
        this.myChart && this.myChart.resize()
      })
    },
    // 监听窗口大小变化
    onresizeTable () {
      let fn = function () {
        this.myChart && this.myChart.resize()
      }.bind(this)
      window.removeEventListener('resize', fn, false)
      window.addEventListener('resize', fn, false)
    },
    getOpts () {
      const sleepTimeChart = {
        // 柱中百分比数值
        afterAsleepPercent: this.chartOptsData.x,
        max: Math.max.apply(null, this.chartOptsData.x)
      }
      let ops = {
        color: ['#4a84ff', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        title: {
          // text: '指标',
          left: '6%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          // feature: {
          //   dataView: { show: true, readOnly: false },
          //   restore: { show: true },
          //   saveAsImage: { show: true }
          // }
        },
        legend: {
          // data: ['2011年']
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'value',
          name: '人数',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: function (value, index) {
              if (sleepTimeChart.max > 1000) {
                return value / 1000 + 'k'
              }
              return value
            }
          }
        },
        yAxis: {
          name: '指标',
          type: 'category',
          data: this.chartOptsData.y,
          axisLabel: {
            padding: [0, 10, 0, 0]
          }
        },
        series: [
          {
            type: 'bar',
            data: sleepTimeChart.afterAsleepPercent,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
              formatter: (o) => {
                return this.chartOptsData.percent[o.dataIndex]
              }
            },
            // 标记点
            markPoint: {
              symbolSize: 0,
              label: {
                position: 'insideRight',
                textStyle: {
                  color: 'white'
                }
              },
              data: ((d) => {
                return d.map((i, index) => {
                  return { coord: [i, index], value: i }
                })
              })(sleepTimeChart.afterAsleepPercent)
            }
          }
        ]
      }
      delete ops.xAxis.maxInterval
      delete ops.xAxis.minInterval
      if (sleepTimeChart.max < 10) {
        ops.xAxis.maxInterval = 2
        ops.xAxis.minInterval = 1
      }
      return ops
    }
  }
}
</script>
<style lang="less" scoped>
#container{
  min-height: 300px;
  height:calc(100% - 200px);
  width: calc(100% - 24px);
  padding: 0 12px;
}
/deep/ .el-range-editor.el-input__inner{
  padding: 1px 10px;
}
/deep/.searchForm .el-form-item {
    margin-bottom: 10px !important;
}
/deep/ .searchForm .dasheds .searchForm-buttonPanel{
  margin-top: 0;
}
.item{
  /deep/.el-icon-warning-outline{
    font-size: 16px;
  }
}
/deep/.el-button--primary{
  color: #409EFF;
  background-color: #FFF;
  border-color: #409EFF !important;
}
/deep/.el-button-group .el-button--primary:first-child {
  border-right-color: #409EFF; 
}
/deep/.el-button-group>.el-button:not(:last-child){
  margin-right: 0;
}
/deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #409EFF;
    background-color:#FFF ;
    border-color: #409EFF;
}
</style>

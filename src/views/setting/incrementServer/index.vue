<template>
  <!-- 增值服务 -->
  <zp-page :obj="obj" ref="page">
    <zp-tabsCustom slot="tabs" v-model="tagName" :data="[{label:`背调方案`,value: 'start'}]" />
    <!-- 加载表格数据 -->
    <zp-dynamicTable slot="table" :obj="obj.tableObj" stripe style="margin-top: 10px;">
      <template slot="customMode_name" slot-scope="props">
        <el-table-column :label="props.customProps.label">
          <template slot-scope="scope">
            <span class="table_location" @click="toSee(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </template>
    </zp-dynamicTable>
  </zp-page>
</template>
<script>
export default {
  name: 'incrementServerIndex',
  data () {
    return {
      tagName: 'start', // tabs 默认选中的值
      obj: new _baseData().call(this, () => {
        return {
          http: {
            queryUrl: 'value_added_item_list'
          },
          searchModel: {
            ruleForm: {
              stageType: 5
            }
          },
          tableObj: {
            operation: {
              selection: false,
              operation_width: 50
            },
            btnList: [
              {
                text: '编辑',
                isShow: true,
                callback: this.toEdit
              }
            ],
            fields: [
              { key: 'name', label: '方案名称', customMode: true },
              { key: 'description', label: '方案说明' },
              {
                key: 'enabled',
                label: '状态',
                customMode: (row, column, cellValue, i) => _fn.getStateStr(row, column, cellValue, i)
              }
            ]
          }
        }
      })
    }
  },
  mounted () {

  },
  methods: {
    toPage (item, index, obj, type) {
      let param = ''
      if (type === 'see') {
        param = { id: (item && item.id) || '0', type: type }
      } else if (type === 'edit') {
        param = { id: (item && item.id), type: type }
      }
      _fn.toLocation({ name: 'incrementServerEdit', params: { id: encodeURI(JSON.stringify(param)) } }) // -> /user/123
    },
    toSee (item) {
      this.toPage(item, '', '', 'see')
    },
    toEdit (item, index, obj) {
      this.toPage(item, index, obj, 'edit')
    }
  }
}
</script>

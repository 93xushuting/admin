<template>
  <div class="element__body_info">
    <zp-bread :obj="breadObj" />
    <div class="contexts">
      <div class="choiceDetail_title">
        <div class="name">{{ detailInfo.contentTitle }}<span :class="detailInfo.contentStatus == 0 ? 'tags-gray' : 'tags'">{{ detailInfo.contentStatus == 0 ? "已下线" : "已上线" }}</span></div>
        <div class="context">
          <span>是否置顶：{{ detailInfo.stickyTop == 0 ? "否" : "是" }}</span>
          <span>创建人：{{ detailInfo.createBy.realName }}</span>
          <span>创建时间：{{ detailInfo.createTime }}</span>
        </div>
      </div>
      <div class="form-group_title">内容详情</div>
      <div class="form-group_info">
        <div class="form-group_item">
            <span>内容详情：</span>
            <div class="content-main" v-html="detailInfo.contentDetails"></div>
        </div>
        <div class="form-group_item">
            <span>内容封面：</span>
            <div class="img-main">
              <img :src="detailInfo.contentCoverUrl" alt="">
            </div>
        </div>
        <p>内容概要：<span>{{ detailInfo.contentSummary }}</span></p>
        <p>所在栏目：<span>{{ detailInfo.columnId.editionName }}</span></p>
        <p>内容属性：<span>{{ detailInfo.tagId.name }}</span></p>
      </div>
      <div class="editFooter">
        <zp-button class="zp-btn-primary" @click="toPage">返 回</zp-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      breadObj: {
        breadcrumb: {
          isShowBack: false,
          title: '用户管理'
        }
      },
      id: 0,
      detailInfo: {
        createBy: {},
        columnId: {},
        tagId: {}
      }
    }
  },
  created: function () {
    this.id = this.$route.params.id
    this.queryChoiceDetail()
  },
  methods: {
    queryChoiceDetail () {
      const { id } = this
      this._api.content_details({ id }).then(res => {
        const { data } = res
        this.detailInfo = data
      })
    },
    toPage () {
      this.$router.go(-1)
      // _fn.toLocation({ path: '/choice' }) // -> /user/123
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/style/color.less';
.contexts {
  overflow-y: auto;
  margin: 0 20px 60px;
}
.choiceDetail_title {
  height: 166px;
  padding: 40px 50px 0px;
  background: #f7f8fa;
  box-sizing: border-box;
  .name {
    font-size: 20px;
    color: #26334F;
    letter-spacing: 0;
    line-height: 20px;
    font-weight: 500;
    span {
      font-size: 14px;
      margin-left: 10px;
      line-height: 24px;
      padding: 0 10px;
      border-radius: 16px;
      color: #fff;
      display: inline-block;
      vertical-align: text-bottom;
    }
    .tags {
      background-color: #25BD99;
    }
    .tags-gray {
      color: gray;
      border: 1px solid gray;
    }
  }
  .context {
    font-size: 16px;
    color: #69707f;
    letter-spacing: 0;
    line-height: 24px;
    margin: 30px 0 0px;
    span {
      margin-right: 40px;
    }
  }
}
.form-group_title{
  font-size: 16px;
  color: @black2;
  line-height: 24px;
  padding-left: 14px;
  position: relative;
  margin: 20px 0px;
  span{
    font-size: 12px;
    color: #69707F;
    vertical-align: top;
    margin-left: 4px;
  }
  &::before{
    content: '';
    position: absolute;
    left: 0;
    width: 4px;
    height: 18px;
    background: @blue;
    border-radius: 2px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.form-group_info{
  color: @black2;
  padding-left: 10px;
  max-width: 1140px;
  p{
    font-size: 14px;
    margin-bottom: 20px;
  }
  span{
    color: #69707F;
  }
}
.form-group_item {
    margin-bottom: 20px;
    display: flex;
    font-size: 14px;
    span {
      color: @black2;
    }
    .content-main {
      width: 1010px;
      height: 212px;
      padding: 10px;
      background-color: #FAFAFA;
      overflow-y: auto;
    }
    .img-main {
      width: 258px;
      height: 162px;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
}
</style>

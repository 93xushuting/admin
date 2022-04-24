import globalVariable from '@/util/global_variable'
export default {
  // 页面消息列表
  stationMessage_getMessageList: '/stationMessage/public/getMessageList',
  // 消息列表
  stationMessage_getStationMessageList: '/stationMessage/public/getStationMessageList', // 分页查询
  stationMessage_getStationMessageInfo: '/stationMessage/public/getStationMessageInfo', // 详情
  stationMessage_updateReadStatus: '/stationMessage/public/updateReadStatus', // 标记已读
  // 消息设置
  stationMessage_getStationMessageSetList: '/stationMessage/getStationMessageSetList', // 分页查询
  stationMessage_updateTimeSet: '/stationMessage/public/updateTimeSet', // 时间设置
  stationMessage_updateForce: '/stationMessage/public/updateForce' // 强提醒设置
}

/**
 * @author gzy
 * @param url 请求路径
 * @param type 请求方式、默认PSOT(post,get,formData)
 */
export default {
  homePage_getReminderCount: '/homePage/getReminderCount', // 待办提醒数量查询
  homePage_queryStatistics: '/homePage/queryStatistics', // 查询统计
  homePage_queryChartData: '/homePage/queryChartData', // 折线图查询
  homePage_refresh: '/homePage/refresh', // 手工刷新待办提醒

  dash_board_public_indicator: '/dash_board/public/indicator', // 招聘简报
  dash_board_public_calendar: '/dash_board/public/calendar', // 日历
  dash_board_public_count_resume: '/dash_board/public/count/resume', // 查看人才库
  dash_board_public_count_unread_jobApplicant: '/dash_board/public/count/unread_jobApplicant' // 未查看新简历
}

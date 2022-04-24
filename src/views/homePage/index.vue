<template>
  <div class="homePage">
    <div id="Charts"></div>
  </div>
</template>
<script>
export default {
  name: 'homePage',
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById('Charts'))
      if (this.chart) {
        let option = this.getOpts()
        this.chart.setOption(option, true)
        this.onresizeTable()
      }
    },
    // 监听窗口大小变化
    onresizeTable () {
      let fn = function () {
        this.chart && this.chart.resize()
      }.bind(this)
      window.removeEventListener('resize', fn, false)
      window.addEventListener('resize', fn, false)
    },
    getOpts () {
      let indicator = [
        {
          text: '流量',
          max: 5000
        },
        {
          text: '通行能力',
          max: 5000
        },
        {
          text: '排队长度',
          max: 5000
        },
        {
          text: '饱和度',
          max: 5000
        },
        {
          text: '失衡系数',
          max: 5000
        },
        {
          text: '停车次数',
          max: 5000
        }
      ]
      let ops = {
        color: ['#4BFFFC', '#000', '#000'],
        legend: {
          orient: 'horizontal',
          icon: 'rectangle',
          data: ['实际', '标准'],
          top: '5%',
          itemWidth: 16,
          itemHeight: 5,
          itemGap: 21,
          textStyle: {
            fontSize: 12,
            color: ['#4BFFFC', '#000', '#000']
          }
        },
        tooltip: {
          formatter: '{b} : {c}'
        },
        radar: {
          name: {
            textStyle: {
              color: '#6887B3',
              fontSize: 12
            }
          },
          center: ['50%', '50%'],
          radius: '65%',
          indicator: indicator,
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(196, 187, 187, 0.54)', // 分隔线颜色
              width: 1 // 分隔线线宽
            }
          }
        },
        series: [
          {
            type: 'radar',
            symbolSize: 4,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            data: [
              {
                value: [4300, 4700, 3600, 3900, 3800, 2800],
                name: '实际',
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: '#0093FF'
                    }
                  }
                }
              },
              {
                value: [3200, 3000, 3400, 2000, 3900, 2000],
                name: '标准',
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: '#4BFFFC'
                    }
                  }
                }
              },
              {
                value: [5000, 5000, 5000, 5000, 5000, 5000],
                name: '',
                symbol: 'circle',
                symbolSize: 1,
                itemStyle: {
                  color: '#fff',
                  borderColor: '#fff',
                  borderWidth: 1,
                  opacity: 1
                },
                lineStyle: {
                  normal: {
                    color: '#000',
                    width: 2
                  }
                }
              }
            ]
          }
        ]
      }
      return ops
    }
  }
}
</script>
<style lang="less" scoped>
#Charts {
  min-height: 600px;
  height:calc(100% - 100px);
  width: calc(100% - 24px);
}
</style>

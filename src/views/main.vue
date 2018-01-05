<template>
  <div>
    <div id="main" style="width: 80%;height:550px;margin:0 auto" ref="myChart"></div>
  </div>
</template>

<script>
import moment from "moment"
import echarts from 'echarts'
export default {
  data() {
    function dataFormatter(obj) {
      var pList = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'];
      var newobj = {
        data: [],
        max: '',
        sum: ''
      }
      var max = 0;
      var sum = 0;
      for (var i = 0, l = obj.length; i < l; i++) {
        max = Math.max(max, obj[i]);
        sum += obj[i];
        newobj['data'][i] = {
          name: pList[i],
          value: obj[i]
        }
      }
      newobj['max'] = Math.floor(max / 100) * 100;
      newobj['sum'] = sum;

      return newobj;
    }

    

    var dataMap={}
    dataMap.dataGDP =[4315, 2150.76, 6018.28, 2324.8, 1940.94, 5458.22, 2348.54, 3637.2, 5741.03, 10606.85, 8003.67, 3519.72, 4467.55, 2450.48, 10275.5, 6035.48, 4212.82, 4151.54, 13502.42, 2523.73, 642.73, 2232.86, 4725.01, 1243.43, 2312.82, 162.04, 2253.39, 1232.03, 340.65, 377.16, 1612.6]


    dataMap.dataPI = 
      [82.44, 84.21, 956.84, 197.8, 374.69, 590.2, 446.17, 474.2, 79.68, 1110.44, 685.2, 783.66, 664.78, 535.98, 1390, 1288.36, 707, 847.25, 1015.08, 601.99, 222.89, 317.87, 1047.95, 281.1, 463.44, 39.75, 282.21, 215.51, 47.31, 52.95, 305]
    

    dataMap.dataSI = 
      [1249.99, 1069.08, 2911.69, 1134.31, 754.78, 2609.85, 943.49, 1843.6, 2622.45, 5604.49, 4090.48, 1337.04, 2036.97, 941.77, 5184.98, 2768.75, 1709.89, 1523.5, 6143.4, 846.89, 148.88, 958.87, 1733.38, 481.96, 934.88, 32.72, 1007.56, 501.69, 144.51, 153.06, 603.15]
    

    dataMap.dataTI =
      [2982.57, 997.47, 2149.75, 992.69, 811.47, 2258.17, 958.88, 1319.4, 3038.9, 3891.92, 3227.99, 1399.02, 1765.8, 972.73, 3700.52, 1978.37, 1795.93, 1780.79, 6343.94, 1074.85, 270.96, 956.12, 1943.68, 480.37, 914.5, 89.56, 963.62, 514.83, 148.83, 171.14, 704.5]
    

    dataMap.dataEstate = 
      [298.02, 73.04, 140.89, 65.83, 51.48, 130.94, 76.11, 118.7, 384.86, 371.09, 360.63, 139.18, 188.09, 125.27, 371.13, 199.31, 145.17, 165.29, 808.16, 82.83, 21.45, 90.48, 210.82, 53.49, 95.68, 3.42, 77.68, 41.52, 9.74, 13.46, 43.04]
    

    dataMap.dataFinancial = 
      [561.91, 76.86, 179.6, 124.1, 48.39, 137.18, 75.45, 31.6, 485.25, 368.86, 347.53, 81.85, 138.28, 76.51, 310.07, 158.77, 96.95, 92.43, 454.65, 35.86, 10.08, 134.52, 183.13, 41.45, 102.39, 2.81, 67.3, 42.08, 16.75, 21.45, 52.18]
    


    var option = {
      baseOption: {
        timeline: {
          // y: 0,
          axisType: 'category',
          // realtime: false,
          // loop: false,
          autoPlay: false,
          show: false,
          // currentIndex: 2,
          playInterval: 1000,
          // controlStyle: {
          //     position: 'left'
          // },
          data: [

          ],
          label: {
            formatter: function(s) {
              return (new Date(s)).getFullYear();
            }
          }
        },
        title: {
          subtext: '数据来自国家统计局'
        },
        tooltip: {
        },
        legend: {
          x: 'right',
          data: ['第一产业', '第二产业', '第三产业', 'GDP', '金融', '房地产'],
          selected: {
            'GDP': false, '金融': false, '房地产': false
          }
        },
        calculable: true,
        grid: {
          top: 80,
          bottom: 100,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                formatter: function(params) {
                  return params.value.replace('\n', '');
                }
              }
            }
          }
        },
        xAxis: [
          {
            'type': 'category',
            'axisLabel': { 'interval': 0 },
            'data': [
              '北京', '\n天津', '河北', '\n山西', '内蒙古', '\n辽宁', '吉林', '\n黑龙江',
              '上海', '\n江苏', '浙江', '\n安徽', '福建', '\n江西', '山东', '\n河南',
              '湖北', '\n湖南', '广东', '\n广西', '海南', '\n重庆', '四川', '\n贵州',
              '云南', '\n西藏', '陕西', '\n甘肃', '青海', '\n宁夏', '新疆'
            ],
            splitLine: { show: false }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'GDP（亿元）'
          }
        ],
        series: [
          { name: 'GDP', type: 'bar' },
          { name: '金融', type: 'bar' },
          { name: '房地产', type: 'bar' },
          { name: '第一产业', type: 'bar' },
          { name: '第二产业', type: 'bar' },
          { name: '第三产业', type: 'bar' },
          {
            name: 'GDP占比',
            type: 'pie',
            center: ['75%', '35%'],
            radius: '28%',
            z: 100
          }
        ]
      },
      options: [
        {
          title: { text: '2002全国宏观经济指标' },
          series: [
            { data: dataFormatter(dataMap.dataGDP)['data'] },
            { data: dataFormatter(dataMap.dataFinancial)['data'] },
            { data: dataFormatter(dataMap.dataEstate)['data'] },
            { data: dataFormatter(dataMap.dataPI)['data'] },
            { data: dataFormatter(dataMap.dataSI)['data'] },
            { data: dataFormatter(dataMap.dataTI)['data'] },
            {
              data: [
                { name: '第一产业', value: dataFormatter(dataMap.dataPI)['sum'] },
                { name: '第二产业', value: dataFormatter(dataMap.dataSI)['sum'] },
                { name: '第三产业', value: dataFormatter(dataMap.dataTI)['sum'] }
              ]
            }
          ]
        }
      ]
    };
    return {
      option,
      myChart: {},
    }
  },
  methods: {
    setEchart() {
      let dom = this.$refs.myChart;
      this.myChart = echarts.init(dom);
      this.myChart.setOption(this.option);
    },
  },
  created() {

  },
  mounted() {
    this.setEchart()
  },
}
</script>

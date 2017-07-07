// env.js
var wxCharts = require('../../utils/wxcharts-min.js')
// var echarts = require('../../utils/echarts.min.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalBandWidth:0,
    bandWidthUnit:'bps',
    allIndexes:[],
    topTabItems:['服务器','探针','分流平台','交换机'],
    currentTopItem:0,
    equipmentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var envId = options.id;
    var envName = this.getEnvNameById(envId);
    // wx.setNavigationBarTitle()
    wx.setNavigationBarTitle({
      title: envName,
    })
    this.getShownData();
    this.getAllIndexes();
    this.getEquipmentList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowWidth = 320;
    try{
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    }catch(e){
      console.error("get system info sync error!")
    }
    console.log(this.data);
    this.data.allIndexes.forEach(function(item){
      console.log(item);
      var ringChart = new wxCharts({
        animation: true,
        canvasId: item.canvasId,
        width:120,
        height:120,
        type: 'ring',
        title:{
          name:item.okNum+'/'+item.errNum,
          fontSize:13,
          offsetX:2
        },
        extra: {
          ringWidth: 10,
          pie: {
            offsetAngle: -45
          }
        },
        series: [{
          name: '正常',
          data: item.okNum,
          stroke: false
        }, {
          name: '故障',
          data: item.errNum,
          stroke: false
        }],
        disablePieStroke: true,
        dataLabel: false,
        legend: false,
      });
      ringChart.addEventListener('renderComplete', () => {
        console.log('renderComplete');
      });
      setTimeout(() => {
        ringChart.stopAnimation();
      }, 500);
    })
    this.drawTrafficLineChart(windowWidth);
    // this.drawTopology();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  redirectToServer: function(e){
    console.log(e);
    var serialNumber = e.currentTarget.dataset.equipment.serialNumber;
    wx.redirectTo({
      url: '/pages/equipment/server?serial_number='+serialNumber,
    })
  },

  getEnvNameById: function(id){
    var envMap = {
      0: '省网出口',
      1:'缓存出口',
      2: 'IDC出口',
      3: '省内出口',
      4: '城域网出口'
    }
    return envMap[id];
  },

  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },

  getShownData: function(){
    var that = this;
    var bandWidth = util.transformUnit(10000000);
    console.log(bandWidth);
    that.setData({
      totalBandWidth:bandWidth.val,
      bandWidthUnit:bandWidth.unit
    })
  },
  getAllIndexes: function(){
    var that = this;
    that.setData({
      allIndexes:[{
        id:0,
        canvasId:'linkRing',
        name:'链路数',
        okNum: 10,
        errNum: 2
      },{
          id: 1,
          canvasId: 'tmaRing',
          name: '探针数',
          okNum: 4,
          errNum: 1
      },{
          id: 2,
          canvasId: 'serverRing',
          name: '采集服务器数',
          okNum: 200,
          errNum: 10
      }]
    })
  },
  createSimulationData: function () {
    var categories = [];
    var upTraffic = [];
    var downTraffic = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      upTraffic.push(Math.random() * (20 - 10) + 10);
      downTraffic.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      upTraffic: upTraffic,
      downTraffic: downTraffic
    }
  },
  drawTrafficLineChart:function(width){
    var simulationData = this.createSimulationData();
    var lineChart = new wxCharts({
      animation: true,
      type:'line',
      canvasId: 'trafficLineChart',
      categories: simulationData.categories,
      background: '#f5f5f5',
      series: [{
        name: '上行流量',
        data: simulationData.upTraffic,
        format: function (val, name) {
          return val.toFixed(2) + 'Gbps';
        }
      }, {
        name: '下行流量',
        data: simulationData.downTraffic,
        format: function (val, name) {
          return val.toFixed(2) + 'Gbps';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return val+'Gbps';
        },
        min: 0
      },
      width: width-20,
      height: 200,
      legend: true,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        legendTextColor:'#7cb5ec',
        lineStyle: 'curve'
      }
    });
    console.log(lineChart);
  },

  drawTopology: function(){
    var myChart = echarts.init(document.getElementById('topology'));
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
  switchTab:function(e){
    this.setData({
      currentTopItem: e.currentTarget.dataset.idx
    });
    this.getEquipmentList();
  },
  getEquipmentList: function(){
    this.setData({
      equipmentList:[{
        serialNumber:'ABCDEFG',
        ip:'192.168.80.5',
        status:'ERR'
      },{
          serialNumber: 'fajkdsofa',
          ip: '192.168.80.32',
          status: 'OK'
      }]
    })
  }
})
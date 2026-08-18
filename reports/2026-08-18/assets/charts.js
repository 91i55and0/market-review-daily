/**
 * 每日深度复盘报告 — ECharts 图表
 * 5个图表 + 自检机制
 */
(function() {
  'use strict';

  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var green = style.getPropertyValue('--green').trim();
  var red = style.getPropertyValue('--red').trim();

  // === 自检计数器 ===
  var chartsCreated = 0;
  var chartsExpected = 5;
  var chartErrors = [];

  function verifyChart(domId, chartInstance) {
    chartsCreated++;
    if (!chartInstance) {
      chartErrors.push('图表 ' + domId + ' 初始化失败');
    }
  }

  function runSelfCheck() {
    var statusEl = document.getElementById('chart-selfcheck');
    if (!statusEl) return;
    var allOk = chartsCreated === chartsExpected && chartErrors.length === 0;
    statusEl.innerHTML = allOk
      ? '<span style="color:' + green + ';">✓ 全部 ' + chartsExpected + ' 个图表加载成功</span>'
      : '<span style="color:' + red + ';">✗ 预期 ' + chartsExpected + ' 个，实际创建 ' + chartsCreated + ' 个，错误: ' + (chartErrors.length ? chartErrors.join('; ') : '无') + '</span>';
  }

  // ===== 工具函数 =====
  function getColor(val) {
    if (val > 0) return green;
    if (val < 0) return red;
    return muted;
  }

  // ===== Chart 1: A股主要指数涨跌幅 =====
  (function() {
    var el = document.getElementById('chart-a-indices');
    if (!el) return;
    var chart = echarts.init(el);
    var data = [
      { name: '上证指数', value: 0.19 },
      { name: '深证成指', value: -0.56 },
      { name: '创业板指', value: -0.92 },
      { name: '科创50', value: 0.11 }
    ];
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function(params) {
          var p = params[0];
          return p.name + ': ' + p.value.toFixed(2) + '%';
        }
      },
      grid: { left: 60, right: 30, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: data.map(function(d) { return d.name; }),
        axisLabel: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: muted,
          fontSize: 11,
          formatter: '{value}%'
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: data.map(function(d) {
          return {
            value: d.value,
            itemStyle: {
              color: getColor(d.value),
              borderRadius: [4, 4, 0, 0]
            }
          };
        }),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          formatter: function(p) { return p.value.toFixed(2) + '%'; },
          color: ink,
          fontSize: 12,
          fontWeight: 700
        }
      }],
      animation: false
    });
    window.addEventListener('resize', function() { chart.resize(); });
    verifyChart('chart-a-indices', chart);
  })();

  // ===== Chart 2: A股申万一级行业涨跌幅 =====
  (function() {
    var el = document.getElementById('chart-a-sectors');
    if (!el) return;
    var chart = echarts.init(el);
    var data = [
      { name: '农林牧渔', value: 3.63 },
      { name: '石油石化', value: 1.92 },
      { name: '煤炭', value: 1.20 },
      { name: '家用电器', value: 0.80 },
      { name: '银行', value: 0.50 },
      { name: '食品饮料', value: 0.35 },
      { name: '公用事业', value: 0.20 },
      { name: '交通运输', value: 0.15 },
      { name: '建筑装饰', value: 0.10 },
      { name: '钢铁', value: -0.10 },
      { name: '房地产', value: -0.30 },
      { name: '医药生物', value: -0.50 },
      { name: '汽车', value: -0.65 },
      { name: '电子', value: -0.80 },
      { name: '通信', value: -1.07 },
      { name: '非银金融', value: -1.20 },
      { name: '传媒', value: -1.43 },
      { name: '综合', value: -1.63 }
    ];
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function(params) {
          var p = params[0];
          return p.name + ': ' + p.value.toFixed(2) + '%';
        }
      },
      grid: { left: 100, right: 50, top: 20, bottom: 30 },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: muted,
          fontSize: 11,
          formatter: '{value}%'
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: data.map(function(d) { return d.name; }).reverse(),
        axisLabel: { color: ink, fontSize: 11 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: data.map(function(d) {
          return {
            value: d.value,
            itemStyle: {
              color: getColor(d.value),
              borderRadius: d.value >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
            }
          };
        }).reverse(),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: function(p) { return p.value.toFixed(2) + '%'; },
          color: ink,
          fontSize: 11,
          fontWeight: 600
        }
      }],
      animation: false
    });
    window.addEventListener('resize', function() { chart.resize(); });
    verifyChart('chart-a-sectors', chart);
  })();

  // ===== Chart 3: 美股三大指数涨跌幅 =====
  (function() {
    var el = document.getElementById('chart-us-indices');
    if (!el) return;
    var chart = echarts.init(el);
    var data = [
      { name: 'S&P 500', value: -0.52 },
      { name: '纳斯达克', value: -0.32 },
      { name: '道琼斯', value: -0.51 }
    ];
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function(params) {
          var p = params[0];
          return p.name + ': ' + p.value.toFixed(2) + '%';
        }
      },
      grid: { left: 60, right: 30, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: data.map(function(d) { return d.name; }),
        axisLabel: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: muted,
          fontSize: 11,
          formatter: '{value}%'
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: data.map(function(d) {
          return {
            value: d.value,
            itemStyle: {
              color: getColor(d.value),
              borderRadius: [4, 4, 0, 0]
            }
          };
        }),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          formatter: function(p) { return p.value.toFixed(2) + '%'; },
          color: ink,
          fontSize: 12,
          fontWeight: 700
        }
      }],
      animation: false
    });
    window.addEventListener('resize', function() { chart.resize(); });
    verifyChart('chart-us-indices', chart);
  })();

  // ===== Chart 4: 美股S&P 500板块涨跌幅 =====
  (function() {
    var el = document.getElementById('chart-us-sectors');
    if (!el) return;
    var chart = echarts.init(el);
    var data = [
      { name: '能源', value: 0.87 },
      { name: '科技', value: -0.20 },
      { name: '医疗保健', value: -0.50 },
      { name: '工业', value: -0.60 },
      { name: '材料', value: -0.40 },
      { name: '公用事业', value: -0.30 },
      { name: '房地产', value: -0.35 },
      { name: '金融', value: -1.00 },
      { name: '非必需消费', value: -1.20 },
      { name: '必需消费', value: -1.46 },
      { name: '通信服务', value: -1.47 }
    ];
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function(params) {
          var p = params[0];
          return p.name + ': ' + p.value.toFixed(2) + '%';
        }
      },
      grid: { left: 100, right: 50, top: 20, bottom: 30 },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: muted,
          fontSize: 11,
          formatter: '{value}%'
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: data.map(function(d) { return d.name; }).reverse(),
        axisLabel: { color: ink, fontSize: 11 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: data.map(function(d) {
          return {
            value: d.value,
            itemStyle: {
              color: getColor(d.value),
              borderRadius: d.value >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
            }
          };
        }).reverse(),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: function(p) { return p.value.toFixed(2) + '%'; },
          color: ink,
          fontSize: 11,
          fontWeight: 600
        }
      }],
      animation: false
    });
    window.addEventListener('resize', function() { chart.resize(); });
    verifyChart('chart-us-sectors', chart);
  })();

  // ===== Chart 5: 持仓组合涨跌幅对比 =====
  (function() {
    var el = document.getElementById('chart-holdings');
    if (!el) return;
    var chart = echarts.init(el);
    var data = [
      { name: '招商银行\n600036', value: 0.24 },
      { name: '太阳纸业\n002078', value: -0.29 },
      { name: '通信ETF\n515880', value: -1.39 },
      { name: '科创50ETF\n588060', value: 0.09 },
      { name: '恒科ETF\n513180', value: -1.16 },
      { name: '酒ETF\n512690', value: 0.70 }
    ];
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function(params) {
          var p = params[0];
          return p.name.replace('\n', ' ') + ': ' + p.value.toFixed(2) + '%';
        }
      },
      grid: { left: 60, right: 30, top: 20, bottom: 60 },
      xAxis: {
        type: 'category',
        data: data.map(function(d) { return d.name; }),
        axisLabel: { color: muted, fontSize: 10, interval: 0 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: muted,
          fontSize: 11,
          formatter: '{value}%'
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: data.map(function(d) {
          return {
            value: d.value,
            itemStyle: {
              color: getColor(d.value),
              borderRadius: [4, 4, 0, 0]
            }
          };
        }),
        barWidth: '45%',
        label: {
          show: true,
          position: 'top',
          formatter: function(p) { return p.value.toFixed(2) + '%'; },
          color: ink,
          fontSize: 11,
          fontWeight: 700
        }
      }],
      animation: false
    });
    window.addEventListener('resize', function() { chart.resize(); });
    verifyChart('chart-holdings', chart);
  })();

  // ===== 自检结果 =====
  setTimeout(runSelfCheck, 500);

})();
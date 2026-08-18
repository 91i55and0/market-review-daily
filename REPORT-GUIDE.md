# 每日深度复盘报告 — 生成规范

> 本文档是 AI 生成每日报告的唯一规范。每次执行时**必须全文阅读**本文件，严格按此规范生成报告。

---

## 1. 执行流程

### 1.1 检查报告是否存在
```bash
python3 /workspace/market-review-daily/daily_infra.py check_exists
```
- 输出 `EXISTS=true` → **跳过生成**，直接运行 `daily_infra.py all`
- 输出 `EXISTS=false` → 继续以下流程

### 1.2 获取日期
```bash
python3 /workspace/market-review-daily/daily_infra.py setup
```
- 输出 `TODAY=YYYY-MM-DD` 和 `DIR=...`
- **使用该日期**作为报告日期

### 1.3 生成报告
- 输出文件: `reports/{TODAY}/market-review-{TODAY}.html`
- 同时创建以下目录（若不存在）:
  - `reports/{TODAY}/_shared/fonts/`
  - `reports/{TODAY}/_shared/js/`
  - `reports/{TODAY}/assets/`

### 1.4 收尾
```bash
python3 /workspace/market-review-daily/daily_infra.py all
```
- 清理7天前的旧报告
- 更新首页 index.html
- 推送到 GitHub

---

## 2. 报告结构（9大板块）

### 必须包含的9个板块，顺序固定：

| 序号 | 板块 | 说明 |
|------|------|------|
| 1 | 一句话总结 | 当日市场核心判断（1-2句） |
| 2 | A股大盘概览 | 四大指数+成交额+图1 |
| 3 | A股板块涨跌幅 | 申万一级行业涨跌榜+图2 |
| 4 | 美股大盘概览 | 三大指数+图3 |
| 5 | 美股板块涨跌幅 | S&P 500 11大板块+图4 |
| 6 | 宏观中美对比 | CPI/PMI/GDP/利率/就业 |
| 7 | 持仓分析 | 6只标的当日表现+图5 |
| 8 | 期权市场 | 50ETF IV + VIX |
| 9 | 综合评估 | 健康检查+风险清单+事件日历+7个深度洞察 |

---

## 3. 样式规范

### 3.1 字体
- 标题字体: `BricolageGrotesque` (Bold)
- 正文字体: `InstrumentSans` (Regular/Bold)
- 数字/代码字体: `JetBrainsMono`
- 字体文件路径: `./_shared/fonts/`（已存在，直接引用）

### 3.2 颜色变量
```css
:root {
  --bg: #0b0e14;          /* 页面背景 */
  --bg2: #131820;         /* 次级背景 */
  --ink: #e8edf5;         /* 主文字 */
  --muted: #7a8aa0;       /* 次要文字 */
  --rule: #1e2a3a;        /* 分割线 */
  --accent: #4fc3f7;      /* 强调色(青) */
  --accent2: #f06292;     /* 强调色2(粉) */
  --green: #66bb6a;       /* 上涨 */
  --red: #ef5350;         /* 下跌 */
  --yellow: #ffd54f;      /* 中性 */
  --orange: #ffa726;      /* 警告 */
  --card-bg: #151c28;     /* 卡片背景 */
  --card-border: #1e2d42; /* 卡片边框 */
  --radius: 12px;         /* 圆角 */
}
```

### 3.3 布局
- 最大宽度: **1100px**，居中
- 头部: 渐变背景 + 标题 + 日期徽章
- 卡片: 深色背景 + 圆角 + 阴影
- 大数字展示: 用 `<h1>` 或 `<h2>` 加粗显示

### 3.4 数据展示格式
- 涨跌幅: `+0.19%` (红色用绿色，负数用红色)
- 指数值: 精确到两位小数
- 成交额: 以"万亿元"为单位，保留两位小数
- PE: 保留两位小数

---

## 4. 图表规范（5个ECharts图表）

### 4.1 通用规则
- **渲染器**: 使用默认 canvas 渲染器 (`echarts.init(el)`，不加 `renderer: 'svg'`)
- 每个图表必须包含: 标题、tooltip、坐标轴标签
- 上涨用绿色，下跌用红色，中性用灰色
- 图表容器必须设置固定高度: `height: 400px`（图1-4），`height: 350px`（图5）

### 4.2 图表容器 HTML
```html
<div class="chart-container" style="height:400px;margin:16px 0;" id="chart-a-indices"></div>
```
每个图表容器必须有**唯一的 id**。

### 4.3 5个图表详情

| 图号 | ID | 类型 | 标题 | 数据维度 |
|------|-----|------|------|---------|
| 图1 | `chart-a-indices` | 柱状图 | A股主要指数涨跌幅（%） | 上证/深证/创业板/科创50 |
| 图2 | `chart-a-sectors` | 横向柱状图 | A股申万一级行业涨跌幅（%） | 申万行业（涨跌各列出前几） |
| 图3 | `chart-us-indices` | 柱状图 | 美股三大指数涨跌幅（%） | S&P 500/纳斯达克/道琼斯 |
| 图4 | `chart-us-sectors` | 横向柱状图 | 美股S&P 500板块涨跌幅（%） | 11大板块 |
| 图5 | `chart-holdings` | 柱状图 | 持仓组合当日涨跌幅（%） | 6只持仓标的 |

### 4.4 图表数据要求
- **必须**使用真实数据（通过 WebSearch 获取）
- 柱状图宽度: 50%-60%
- 数据标签显示在柱子上方/右侧
- 渐变色或纯色均可，涨跌颜色区分

### 4.5 charts.js 文件
- 图表 JS 代码写入 `assets/charts.js`
- 使用 IIFE 包裹，避免全局污染
- 包含自检机制（检查5个图表是否全部初始化成功）
- 所有图表关闭动画（`animation: false`）
- 包含 `window.addEventListener('resize', function() { chart.resize(); })`

---

## 5. 数据来源（必须搜索）

### 5.1 A股数据
- 指数: 上证指数、深证成指、创业板指、科创50
- 行业: 申万一级行业涨跌幅
- 成交额: 全市场成交额
- 搜索来源: 新浪财经、东方财富、证券时报

### 5.2 美股数据
- 指数: S&P 500、纳斯达克、道琼斯
- 板块: S&P 500 11大板块涨跌幅
- 搜索来源: Yahoo Finance、Swingfolio、MarketWatch

### 5.3 宏观数据
- 中国: CPI、PPI、PMI、GDP、LPR、失业率、国债收益率
- 美国: CPI、核心CPI、GDP、ISM PMI、非农就业、失业率、联邦基金利率、国债收益率
- 搜索来源: MacroView、国家统计局、美联储官网

### 5.4 持仓数据（6只标的）
- 招商银行 (600036) - 股价、涨跌幅、PE、52周高低
- 太阳纸业 (002078) - 同上
- 通信ETF (515880) - 同上
- 科创50ETF (588060) - 同上
- 恒科ETF (513180) - 同上
- 酒ETF (512690) - 同上
- 搜索来源: 证券时报、搜狐证券

### 5.5 期权数据
- 50ETF期权: 标的价、隐含波动率、历史波动率
- VIX: 收盘价、涨跌幅
- 搜索来源: 东方财富

### 5.6 数据时效性
- A股数据: 当天（TODAY）的收盘数据
- 美股数据: 前一个交易日（TODAY-1 或 TODAY）的收盘数据
- 宏观数据: 最新公布的数据（注明日期）
- 所有数据来源**必须在页面底部列出**

---

## 6. HTML 文件结构要求

### 6.1 head 部分
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<style>
  /* 完整的CSS样式，包括字体定义、变量、布局、卡片、响应式 */
</style>
```

### 6.2 body 部分
1. `header.hero` — 标题 + 日期
2. `.oneliner` — 一句话总结
3. `section#a-market` — A股大盘概览
4. `section#a-sectors` — A股板块
5. `section#us-market` — 美股大盘
6. `section#us-sectors` — 美股板块
7. `section#macro` — 宏观对比
8. `section#holdings` — 持仓分析
9. `section#options` — 期权市场
10. `section#assessment` — 综合评估
11. `section#sources` — 数据来源

### 6.3 脚本引入（放在 `</body>` 前）
```html
<script src="./_shared/js/echarts.min.js"></script>
<script src="assets/charts.js"></script>
```

---

## 7. 综合评估板块要求

### 7.1 市场健康检查
用红绿灯/图标表示状态:
- 市场广度（上涨/下跌比）
- 成交活跃度
- 资金流向
- 期权情绪

### 7.2 风险清单
列出 5-8 个当前主要风险，每项包含:
- 风险标题（加粗）
- 简要说明（一行）

### 7.3 事件日历
列出未来1-2周的重要事件，包含:
- 日期
- 事件名称
- 影响说明

### 7.4 深度洞察（"你没想到的"）
写 5-7 个深度洞察，每个包含:
- 关键数据点
- 逻辑链条分析
- 隐含的市场含义

---

## 8. 文件路径约定

| 文件 | 路径 |
|------|------|
| 报告HTML | `reports/{TODAY}/market-review-{TODAY}.html` |
| 图表JS | `reports/{TODAY}/assets/charts.js` |
| ECharts库 | `reports/{TODAY}/_shared/js/echarts.min.js` |
| 字体文件 | `reports/{TODAY}/_shared/fonts/*.ttf` |
| 首页 | `index.html` |
| 模板 | `report-template.html` |

**重要**: 所有路径使用**相对路径**，确保在 GitHub Pages 上可访问。

---

## 9. 自检机制

在 `charts.js` 末尾添加自检:
```javascript
setTimeout(function() {
  var statusEl = document.getElementById('chart-selfcheck');
  if (statusEl) {
    var allOk = (chartsCreated === chartsExpected && chartErrors.length === 0);
    statusEl.innerHTML = allOk ? '✓ 全部5个图表加载成功' : '✗ 图表异常: ' + chartErrors.join('; ');
  }
}, 500);
```

在 HTML 中添加:
```html
<div id="chart-selfcheck" style="text-align:center;padding:8px;color:var(--muted);font-size:0.85rem;"></div>
```

---

## 10. 质量检查清单

生成完成后，逐项确认:
- [ ] 报告文件是否写入正确路径 `reports/TODAY/market-review-TODAY.html`
- [ ] 是否包含全部9个板块
- [ ] 字体引用是否正确（./_shared/fonts/）
- [ ] 图表JS是否写入 `assets/charts.js`
- [ ] 5个图表容器ID是否正确
- [ ] ECharts 是否使用 canvas 渲染器（非 SVG）
- [ ] 图表数据是否为真实数据
- [ ] 数据来源是否在页面底部列出
- [ ] 所有相对路径是否以 `./` 开头
- [ ] 涨跌幅颜色是否正确（涨绿跌红）
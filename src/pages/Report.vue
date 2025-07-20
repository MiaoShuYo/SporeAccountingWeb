<script setup lang="ts">
import { ref, reactive, inject, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Response } from '../Interface/response'
import type { ReportRequest, ReportResponse } from '../Interface/report'
import { ReportTypeEnum } from '../Interface/report'
import * as echarts from 'echarts'

// 注入axios
const axios: any = inject('axios')

// 响应式数据
const loading = ref(false)
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 报表参数
const reportParams = reactive<ReportRequest>({
  reportType: ReportTypeEnum.Monthly,
  year: new Date().getFullYear(),
  month: undefined
})

// 报表数据
const reportData = ref<ReportResponse>({
  data: [],
  totalExpense: 0,
  totalIncome: 0,
  totalNetIncome: 0
})

// 计算属性：报表类型选项
const reportTypeOptions = computed(() => [
  { label: '月度报表', value: ReportTypeEnum.Monthly },
  { label: '季度报表', value: ReportTypeEnum.Quarterly },
  { label: '年度报表', value: ReportTypeEnum.Yearly }
])

// 计算属性：年份选项（当前年份前后5年）
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push({ label: `${i}年`, value: i })
  }
  return years
})

// 计算属性：月份选项
const monthOptions = computed(() => {
  const months = []
  for (let i = 1; i <= 12; i++) {
    months.push({ label: `${i}月`, value: i })
  }
  return months
})

// 获取报表数据
const getReportData = async () => {
  loading.value = true
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BASE_URL + '/api/Report/GetReport',
      reportParams,
      {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }
    )
    
    const result: Response<ReportResponse> = response.data
    if (result.statusCode === 200) {
      reportData.value = result.data
      renderChart()
    } else {
      ElMessage.error(result.errorMessage || '获取报表数据失败')
    }
  } catch (error: any) {
    console.error('获取报表数据失败:', error)
    ElMessage.error('获取报表数据失败')
  } finally {
    loading.value = false
  }
}

// 渲染图表
const renderChart = () => {
  if (!chartRef.value || !reportData.value.data.length) return
  
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  
  const chartData = reportData.value.data
  const timeLabels = chartData.map(item => item.timeLabel)
  const expenseData = chartData.map(item => item.expenseAmount)
  const incomeData = chartData.map(item => item.incomeAmount)
  const netIncomeData = chartData.map(item => item.netIncome)
  
  const option = {
    title: {
      text: getChartTitle(),
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        let result = `${params[0].name}<br/>`
        params.forEach((param: any) => {
          const color = param.color
          const value = param.value.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
          result += `${param.seriesName}: ¥${value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['支出', '收入', '净收入'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      axisLabel: {
        rotate: reportParams.reportType === ReportTypeEnum.Yearly ? 0 : 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value: number) {
          return '¥' + value.toLocaleString('zh-CN')
        }
      }
    },
    series: [
      {
        name: '支出',
        type: 'bar',
        data: expenseData,
        itemStyle: {
          color: '#ff6b6b'
        }
      },
      {
        name: '收入',
        type: 'bar',
        data: incomeData,
        itemStyle: {
          color: '#51cf66'
        }
      },
      {
        name: '净收入',
        type: 'line',
        data: netIncomeData,
        itemStyle: {
          color: '#339af0'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 8
      }
    ]
  }
  
  chartInstance.setOption(option)
}

// 获取图表标题
const getChartTitle = () => {
  const year = reportParams.year
  const month = reportParams.month
  
  switch (reportParams.reportType) {
    case ReportTypeEnum.Monthly:
      return month ? `${year}年${month}月月度报表` : `${year}年月度报表`
    case ReportTypeEnum.Quarterly:
      return `${year}年季度报表`
    case ReportTypeEnum.Yearly:
      return `${year}年年度报表`
    default:
      return '财务报表'
  }
}

// 查询报表
const queryReport = () => {
  getReportData()
}

// 重置参数
const resetParams = () => {
  reportParams.reportType = ReportTypeEnum.Monthly
  reportParams.year = new Date().getFullYear()
  reportParams.month = undefined
}

// 监听窗口大小变化，重新调整图表
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  return '¥' + amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 组件挂载时初始化
onMounted(() => {
  getReportData()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<template>
  <div class="report-container">
    <!-- 查询条件 -->
    <el-card class="query-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>查询条件</span>
        </div>
      </template>
      
      <el-form :model="reportParams" inline>
        <el-form-item label="报表类型">
          <el-select v-model="reportParams.reportType" placeholder="请选择报表类型" style="width: 150px">
            <el-option
              v-for="option in reportTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="年份">
          <el-select v-model="reportParams.year" placeholder="请选择年份" style="width: 120px">
            <el-option
              v-for="option in yearOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="月份" v-if="reportParams.reportType === ReportTypeEnum.Monthly">
          <el-select v-model="reportParams.month" placeholder="请选择月份" style="width: 120px" clearable>
            <el-option
              v-for="option in monthOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="queryReport" :loading="loading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetParams">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计概览 -->
    <el-card class="stats-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>统计概览</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-item expense">
            <div class="stat-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">总支出</div>
              <div class="stat-value">{{ formatAmount(reportData.totalExpense) }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item income">
            <div class="stat-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">总收入</div>
              <div class="stat-value">{{ formatAmount(reportData.totalIncome) }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item net-income">
            <div class="stat-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">净收入</div>
              <div class="stat-value" :class="{ 'negative': reportData.totalNetIncome < 0 }">
                {{ formatAmount(reportData.totalNetIncome) }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 图表展示 -->
    <el-card class="chart-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>图表分析</span>
        </div>
      </template>
      
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>详细数据</span>
        </div>
      </template>
      
      <el-table :data="reportData.data" stripe style="width: 100%">
        <el-table-column prop="timeLabel" label="时间" width="120" />
        <el-table-column prop="expenseAmount" label="支出金额" width="150">
          <template #default="scope">
            <span class="expense-text">{{ formatAmount(scope.row.expenseAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="incomeAmount" label="收入金额" width="150">
          <template #default="scope">
            <span class="income-text">{{ formatAmount(scope.row.incomeAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="netIncome" label="净收入" width="150">
          <template #default="scope">
            <span :class="scope.row.netIncome >= 0 ? 'income-text' : 'expense-text'">
              {{ formatAmount(scope.row.netIncome) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.report-container {
  padding: 20px;
}

.query-card,
.stats-card,
.chart-card,
.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 400px;
  width: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-item.expense {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.stat-item.income {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
}

.stat-item.net-income {
  background: linear-gradient(135deg, #339af0 0%, #228be6 100%);
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 15px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-value.negative {
  color: #ff6b6b;
}

.expense-text {
  color: #ff6b6b;
  font-weight: 500;
}

.income-text {
  color: #51cf66;
  font-weight: 500;
}

:deep(.el-card__header) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style> 
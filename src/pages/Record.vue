<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/accountBook'}">账本</el-breadcrumb-item>
    <el-breadcrumb-item><span style="font-weight: bold">记账</span></el-breadcrumb-item>
  </el-breadcrumb>
  
  <!-- 搜索功能区域 -->
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-text>类型筛选：</el-text>
        <el-select v-model="recordPage.type" placeholder="请选择类型" style="width: 65%">
          <el-option label="全部" value=""></el-option>
          <el-option label="支出" value="支出"></el-option>
          <el-option label="收入" value="收入"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-text>描述搜索：</el-text>
        <el-input placeholder="请输入描述关键词" v-model="recordPage.description" style="width: 65%"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="queryRecords">搜索</el-button>
        <el-button type="success" @click="openAddDialog">新增账目</el-button>
      </el-col>
    </el-row>
  </div>
  
  <div>
    <!-- 账目列表 -->
    <el-table :data="recordPageResponse.data" style="width: 100%">
      <el-table-column type="index" width="100" label="编号"></el-table-column>
      <el-table-column prop="date" label="日期" width="120"/>
      <el-table-column prop="type" label="类型" width="80"/>
      <el-table-column prop="amount" label="金额" width="100"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button link type="warning" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button link size="small" type="danger" @click="deleteRecord(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordPageResponse.rowCount" 
        style="margin-top: 20px">
    </el-pagination>
  </div>
  
  <!-- 新增/编辑弹窗 -->
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="60px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="支出" value="支出"></el-option>
          <el-option label="收入" value="收入"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input v-model.number="form.amount" type="number" min="0"/>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description"/>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, inject } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { AccountBook } from '../Interface/accountBook.ts'

const axios: any = inject('axios')
const route = useRoute()
const accountBookId = ref<string>(route.params.accountBookId as string)
const accountBookName = ref<string>('')

// 账目数据结构
interface RecordItem {
  id: string
  type: '支出' | '收入'
  amount: number
  description: string
  date: string
}

// 分页查询参数
interface RecordPage {
  pageSize: number
  pageNumber: number
  type: string
  description: string
}

// 分页响应数据
interface RecordPageResponse {
  data: RecordItem[]
  rowCount: number
  pageCount: number
}

// 搜索参数
const recordPage = ref<RecordPage>({
  pageSize: 10,
  pageNumber: 1,
  type: '',
  description: ''
})

// 分页响应数据
const recordPageResponse: RecordPageResponse = reactive({
  data: [],
  rowCount: 0,
  pageCount: 0
})

// 分页相关
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增账目')
const formRef = ref<FormInstance>()
const form = reactive<RecordItem>({
  id: '',
  type: '支出',
  amount: 0,
  description: '',
  date: ''
})
let editId: string | null = null

// 表单验证规则
const rules = reactive<FormRules>({
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ]
})

// 分页查询账目
const queryRecords = () => {
  recordPage.value.pageNumber = currentPage.value
  recordPage.value.pageSize = pageSize.value
  
  // 模拟API调用，实际项目中应该调用真实的后端接口
  // axios.post(import.meta.env.VITE_API_BASE_URL + '/api/Record/Query', recordPage.value, {
  //   headers: {
  //     Authorization: localStorage.getItem('token')
  //   }
  // }).then((res: any) => {
  //   const response = res.data
  //   if (response.statusCode === 200) {
  //     recordPageResponse.pageCount = response.data.pageCount
  //     recordPageResponse.rowCount = response.data.rowCount
  //     recordPageResponse.data = response.data.data
  //   } else {
  //     ElMessage.error(response.errorMessage)
  //   }
  // }).catch((err: any) => {
  //   ElMessage.error(err.message)
  // })
  
  // 模拟数据
  const mockData: RecordItem[] = [
    { id: '1', type: '支出', amount: 100, description: '买菜', date: '2024-06-01' },
    { id: '2', type: '收入', amount: 2000, description: '工资', date: '2024-06-02' },
    { id: '3', type: '支出', amount: 50, description: '公交费', date: '2024-06-03' },
    { id: '4', type: '收入', amount: 500, description: '兼职收入', date: '2024-06-04' },
    { id: '5', type: '支出', amount: 200, description: '购物', date: '2024-06-05' },
  ]
  
  // 模拟筛选逻辑
  let filteredData = mockData
  if (recordPage.value.type) {
    filteredData = filteredData.filter(item => item.type === recordPage.value.type)
  }
  if (recordPage.value.description) {
    filteredData = filteredData.filter(item => 
      item.description.includes(recordPage.value.description)
    )
  }
  
  // 模拟分页
  const start = (recordPage.value.pageNumber - 1) * recordPage.value.pageSize
  const end = start + recordPage.value.pageSize
  recordPageResponse.data = filteredData.slice(start, end)
  recordPageResponse.rowCount = filteredData.length
  recordPageResponse.pageCount = Math.ceil(filteredData.length / recordPage.value.pageSize)
}

// 分页事件处理
const handleSizeChange = (value: number) => {
  pageSize.value = value
  queryRecords()
}

const handleCurrentChange = (value: number) => {
  currentPage.value = value
  queryRecords()
}

// 删除账目
const deleteRecord = (id: string) => {
  ElMessageBox.confirm('此操作将永久删除该账目, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除操作
    recordPageResponse.data = recordPageResponse.data.filter(item => item.id !== id)
    recordPageResponse.rowCount--
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 打开新增弹窗
const openAddDialog = () => {
  dialogTitle.value = '新增账目'
  Object.assign(form, { id: '', type: '支出', amount: 0, description: '', date: '' })
  editId = null
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEditDialog = (row: RecordItem) => {
  dialogTitle.value = '编辑账目'
  Object.assign(form, row)
  editId = row.id
  dialogVisible.value = true
}

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate().then(() => {
    if (editId) {
      // 编辑
      const idx = recordPageResponse.data.findIndex(r => r.id === editId)
      if (idx !== -1) {
        recordPageResponse.data[idx] = { ...form, id: editId }
        ElMessage.success('编辑成功')
      }
    } else {
      // 新增
      const newRecord = { ...form, id: Date.now().toString() }
      recordPageResponse.data.unshift(newRecord)
      recordPageResponse.rowCount++
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  }).catch(() => {
    ElMessage.error('请检查输入项')
  })
}

// 获取账本名称
onMounted(async () => {
  // 这里假设有API可以通过ID获取账本详情
  // 这里只做演示，实际应调用后端接口
  // accountBookName.value = await fetchAccountBookName(accountBookId.value)
  accountBookName.value = '演示账本名称' // TODO: 替换为真实数据
  
  // 初始化查询
  queryRecords()
})
</script>

<style scoped>
.container {
  padding: 20px 0 0 0;
}
</style> 
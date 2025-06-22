<script setup lang="ts">
import {ref, onMounted, inject} from 'vue'
import type {AccountBook, CreateAccountBookRequest} from '../Interface/accountBook.ts'
import type {Response} from '../Interface/response.ts'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus, Edit, Delete, Setting} from '@element-plus/icons-vue'

const axios: any = inject('axios')

// 账本列表
const accountBooks = ref<AccountBook[]>([])
const loading = ref(false)

// 创建账本相关
const createDialogVisible = ref(false)
const createForm = ref<CreateAccountBookRequest>({
  name: '',
  description: '',
  coverImage: '',
  currency: 'CNY'
})

// 默认账本封面图片
const defaultCoverImage = '/src/assets/accountbook/ab.png';

// 获取账本列表
const getAccountBooks = async () => {
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟数据
    const mockData: AccountBook[] = [
      {
        id: '1',
        name: '日常开销',
        description: '记录日常生活中的各种支出',
        coverImage: '/src/assets/accountbook/ab.png',
        createTime: '2024-01-01',
        updateTime: '2024-01-15',
        isDefault: true,
        currency: 'CNY',
        balance: 1250.50
      },
      {
        id: '2',
        name: '投资理财',
        description: '股票、基金等投资记录',
        coverImage: '/src/assets/accountbook/ab.png',
        createTime: '2024-01-05',
        updateTime: '2024-01-20',
        isDefault: false,
        currency: 'CNY',
        balance: 50000.00
      },
      {
        id: '3',
        name: '旅行基金',
        description: '专门用于旅行的储蓄',
        coverImage: '/src/assets/accountbook/ab.png',
        createTime: '2024-01-10',
        updateTime: '2024-01-18',
        isDefault: false,
        currency: 'CNY',
        balance: 8000.00
      },
      {
        id: '4',
        name: '学习投资',
        description: '购买书籍、课程等学习支出',
        coverImage: '/src/assets/accountbook/ab.png',
        createTime: '2024-01-12',
        updateTime: '2024-01-22',
        isDefault: false,
        currency: 'CNY',
        balance: 1500.00
      },
      {
        id: '5',
        name: '应急资金',
        description: '紧急情况下的备用资金',
        coverImage: '/src/assets/accountbook/ab.png',
        createTime: '2024-01-15',
        updateTime: '2024-01-25',
        isDefault: false,
        currency: 'CNY',
        balance: 10000.00
      }
    ]

    accountBooks.value = mockData

    // 注释掉真实的API调用，使用模拟数据
    /*
    const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/AccountBook/GetAccountBooks', {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
    const result: Response<AccountBook[]> = response.data
    if (result.statusCode === 200) {
      accountBooks.value = result.data || []
    } else {
      ElMessage.error(result.errorMessage || '获取账本列表失败')
    }
    */
  } catch (error) {
    console.error('获取账本列表失败:', error)
    ElMessage.error('获取账本列表失败')
  } finally {
    loading.value = false
  }
}

// 创建账本
const createAccountBook = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 创建新的账本对象
    const newBook: AccountBook = {
      id: Date.now().toString(),
      name: createForm.value.name,
      description: createForm.value.description,
      coverImage: createForm.value.coverImage || defaultCoverImage,
      createTime: new Date().toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0],
      isDefault: accountBooks.value.length === 0, // 如果是第一个账本，设为默认
      currency: createForm.value.currency,
      balance: 0
    }

    // 添加到列表中
    accountBooks.value.push(newBook)

    ElMessage.success('创建账本成功')
    createDialogVisible.value = false

    // 重置表单
    createForm.value = {
      name: '',
      description: '',
      coverImage: '',
      currency: 'CNY'
    }

    // 注释掉真实的API调用
    /*
    const response = await axios.post(import.meta.env.VITE_API_BASE_URL + '/api/AccountBook/CreateAccountBook', 
      createForm.value, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }
    )
    const result: Response<boolean> = response.data
    if (result.statusCode === 200) {
      ElMessage.success('创建账本成功')
      createDialogVisible.value = false
      // 重置表单
      createForm.value = {
        name: '',
        description: '',
        coverImage: '',
        currency: 'CNY'
      }
      // 重新获取列表
      await getAccountBooks()
    } else {
      ElMessage.error(result.errorMessage || '创建账本失败')
    }
    */
  } catch (error) {
    console.error('创建账本失败:', error)
    ElMessage.error('创建账本失败')
  }
}

// 删除账本
const deleteAccountBook = async (id: string, name: string) => {
  try {
    await ElMessageBox.confirm(`确定要删除账本"${name}"吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300))

    // 从列表中移除
    const index = accountBooks.value.findIndex(book => book.id === id)
    if (index > -1) {
      accountBooks.value.splice(index, 1)
      ElMessage.success('删除账本成功')
    }

    // 注释掉真实的API调用
    /*
    const response = await axios.delete(import.meta.env.VITE_API_BASE_URL + `/api/AccountBook/DeleteAccountBook/${id}`, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
    const result: Response<boolean> = response.data
    if (result.statusCode === 200) {
      ElMessage.success('删除账本成功')
      await getAccountBooks()
    } else {
      ElMessage.error(result.errorMessage || '删除账本失败')
    }
    */
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除账本失败:', error)
      ElMessage.error('删除账本失败')
    }
  }
}

// 选择封面图片
const selectCoverImage = (image: string) => {
  createForm.value.coverImage = image
}

// 获取默认封面图片
const getDefaultCoverImage = () => {
  return defaultCoverImage
}

onMounted(() => {
  getAccountBooks()
})
</script>

<template>
  <div class="account-book-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>我的账本</h2>
      <el-button type="primary" @click="createDialogVisible = true" :icon="Plus">
        新建账本
      </el-button>
    </div>

    <!-- 账本列表 -->
    <div class="account-book-list" v-loading="loading">
      <el-row :gutter="20">
        <el-col
            v-for="(book, index) in accountBooks"
            :key="book.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
            class="book-item-col"
        >
          <div class="book-item">
            <div class="book-cover">
              <img
                  :src="book.coverImage || getDefaultCoverImage()"
                  :alt="book.name"
                  @error="$event.target.src = getDefaultCoverImage()"
              />
              <div class="book-overlay">
                <div class="book-actions">
                  <el-button
                      type="primary"
                      size="small"
                      circle
                      :icon="Edit"
                      title="编辑"
                  />
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      :icon="Delete"
                      title="删除"
                      @click="deleteAccountBook(book.id, book.name)"
                  />
                  <el-button
                      type="info"
                      size="small"
                      circle
                      :icon="Setting"
                      title="设置"
                  />
                </div>
              </div>
              <div v-if="book.isDefault" class="default-badge">
                默认
              </div>
            </div>
            <div class="book-info">
              <h3 class="book-name">{{ book.name }}</h3>
              <p class="book-description" v-if="book.description">{{ book.description }}</p>
              <div class="book-meta">
                <span class="book-currency">{{ book.currency }}</span>
                <span class="book-balance">{{ book.balance.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 空状态 -->
      <div v-if="!loading && accountBooks.length === 0" class="empty-state">
        <el-empty description="暂无账本，点击上方按钮创建第一个账本">
          <el-button type="primary" @click="createDialogVisible = true">创建账本</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 创建账本对话框 -->
    <el-dialog
        v-model="createDialogVisible"
        title="新建账本"
        width="600px"
        center
    >
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="账本名称" required>
          <el-input v-model="createForm.name" placeholder="请输入账本名称"/>
        </el-form-item>

        <el-form-item label="账本描述">
          <el-input
              v-model="createForm.description"
              type="textarea"
              placeholder="请输入账本描述（可选）"
              :rows="3"
          />
        </el-form-item>

        <el-form-item label="币种" required>
          <el-select v-model="createForm.currency" placeholder="请选择币种">
            <el-option label="人民币 (CNY)" value="CNY"/>
            <el-option label="美元 (USD)" value="USD"/>
            <el-option label="欧元 (EUR)" value="EUR"/>
            <el-option label="日元 (JPY)" value="JPY"/>
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片">
          <div class="cover-image-selector">
            <div
                class="cover-image-option"
                :class="{ active: createForm.coverImage === defaultCoverImage }"
                @click="selectCoverImage(defaultCoverImage)"
            >
              <img :src="defaultCoverImage" :alt="`默认封面`"/>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="createAccountBook">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.account-book-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.account-book-list {
  min-height: 400px;
}

.book-item-col {
  margin-bottom: 20px;
}

.book-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.book-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.book-cover {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-item:hover .book-cover img {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-item:hover .book-overlay {
  opacity: 1;
}

.book-actions {
  display: flex;
  gap: 8px;
}

.default-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #409eff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.book-info {
  padding: 16px;
}

.book-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-currency {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.book-balance {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.cover-image-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  max-height: 200px;
}

.cover-image-option {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.cover-image-option:hover {
  border-color: #409eff;
}

.cover-image-option.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.cover-image-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dialog-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .page-header h2 {
    text-align: center;
  }
}
</style> 
<template>
  <div class="cat-page">
    <el-card shadow="never">
      <div class="header">
        <el-input
            v-model="keyword"
            placeholder="搜索猫咪名称/颜色"
            clearable
            class="search-input"
            @keyup.enter="fetchCats"
            @clear="fetchCats"
        />
        <el-button type="primary" icon="Search" @click="fetchCats">搜索</el-button>
        <el-button type="success" icon="Plus" @click="onAdd">新增猫咪</el-button>
      </div>

      <!-- 错误提示 -->
      <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          closable
          @close="errorMessage = ''"
      />

      <el-table :data="catList" style="width: 100%" height="600" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名字" />
        <el-table-column prop="color" label="颜色" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="estimatedAge" label="估计年龄" width="100" />
        <el-table-column label="领养状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isAdopted ? 'success' : 'warning'">
              {{ row.isAdopted ? '已领养' : '未领养' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthStatus" label="健康状况" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next, sizes, total"
            :total="total"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            @current-change="fetchCats"
            @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 猫咪表单对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        @closed="resetForm"
    >
      <!-- 表单错误提示 -->
      <el-alert
          v-if="formErrorMessage"
          :title="formErrorMessage"
          type="error"
          show-icon
          closable
          @close="formErrorMessage = ''"
      />

      <el-form :model="formData" :rules="formRules" ref="catForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="猫咪名字" prop="name">
              <el-input v-model="formData.name" placeholder="请输入猫咪名字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毛色" prop="color">
              <el-input v-model="formData.color" placeholder="请输入毛色" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio label="公" />
                <el-radio label="母" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="估计年龄" prop="estimatedAge">
              <el-input v-model="formData.estimatedAge" placeholder="如：1岁、2个月" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="健康状况" prop="healthStatus">
              <el-select v-model="formData.healthStatus" placeholder="请选择健康状况">
                <el-option label="健康" value="健康" />
                <el-option label="良好" value="良好" />
                <el-option label="一般" value="一般" />
                <el-option label="需治疗" value="需治疗" />
                <el-option label="严重" value="严重" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动区域" prop="location">
              <el-input v-model="formData.location" placeholder="如：东区花园" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="发现日期" prop="discoveryDate">
          <el-date-picker
              v-model="formData.discoveryDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="性格特点" prop="personality">
          <el-input
              v-model="formData.personality"
              type="textarea"
              :rows="2"
              placeholder="如：温顺、胆小、活泼等"
          />
        </el-form-item>

        <el-form-item label="特殊需求" prop="specialNeeds">
          <el-input
              v-model="formData.specialNeeds"
              type="textarea"
              :rows="2"
              placeholder="如：需定期服药、特殊饮食等"
          />
        </el-form-item>

        <el-form-item label="描述信息" prop="description">
          <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入猫咪的详细描述"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否绝育" prop="sterilizationStatus">
              <el-switch
                  v-model="formData.sterilizationStatus"
                  :active-value="true"
                  :inactive-value="false"
              />
              <span class="switch-label">
                {{ formData.sterilizationStatus ? '已绝育' : '未绝育' }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否被领养" prop="isAdopted">
              <el-switch
                  v-model="formData.isAdopted"
                  :active-value="true"
                  :inactive-value="false"
              />
              <span class="switch-label">
                {{ formData.isAdopted ? '已领养' : '未领养' }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

// 配置API基础URL - 请替换为您的实际API地址
// 如果是本地开发，可以使用 'http://localhost:8080/api/cats'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/cats'

console.log('API Base URL:', API_BASE_URL)

// 搜索关键字
const keyword = ref('')

// 猫咪列表和分页
const catList = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const errorMessage = ref('')

// 对话框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('新增猫咪')
const isEditing = ref(false)
const formErrorMessage = ref('')
const submitting = ref(false)

// 表单数据 - 匹配后端Cat对象
const formData = ref({
  name: '',
  color: '',
  gender: '公',
  estimatedAge: '',
  healthStatus: '',
  location: '',
  description: '',
  discoveryDate: '',
  personality: '',
  specialNeeds: '',
  sterilizationStatus: false,
  isAdopted: false
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入猫咪名字', trigger: 'blur' }],
  color: [{ required: true, message: '请输入毛色', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  healthStatus: [{ required: true, message: '请选择健康状况', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动区域', trigger: 'blur' }]
}

const catForm = ref(null)

// 组件挂载时加载数据
onMounted(() => {
  fetchCats()
})

// 获取猫咪列表
async function fetchCats() {
  try {
    loading.value = true
    errorMessage.value = ''

    // 调用真实API
    const response = await axios.get('http://localhost:8080/api/cats')

    // 处理响应数据
    if (response.data) {
      // 确保所有布尔值被正确解析
      const cats = response.data.map(cat => ({
        ...cat,
        sterilizationStatus: cat.sterilizationStatus === true || cat.sterilizationStatus === 1,
        isAdopted: cat.isAdopted === true || cat.isAdopted === 1
      }))

      // 过滤搜索关键词
      if (keyword.value) {
        const kw = keyword.value.toLowerCase()
        catList.value = cats.filter(item =>
            (item.name && item.name.toLowerCase().includes(kw)) ||
            (item.color && item.color.toLowerCase().includes(kw))
        )
      } else {
        catList.value = cats
      }

      total.value = catList.value.length
    }

  } catch (error) {
    console.error('获取猫咪列表失败:', error)
    errorMessage.value = `获取猫咪列表失败: ${error.response?.data?.message || error.message || '未知错误'}`
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
function handleSizeChange(size) {
  pageSize.value = size
  fetchCats()
}

// 新增猫咪
function onAdd() {
  dialogTitle.value = '新增猫咪'
  isEditing.value = false
  formErrorMessage.value = ''
  dialogVisible.value = true
}

// 编辑猫咪
function onEdit(row) {
  dialogTitle.value = '编辑猫咪'
  isEditing.value = true
  formErrorMessage.value = ''

  // 复制数据到表单，确保日期格式正确
  formData.value = {
    ...row,
    discoveryDate: row.discoveryDate ? new Date(row.discoveryDate).toISOString().split('T')[0] : ''
  }

  dialogVisible.value = true
}

// 删除猫咪
async function onDelete(row) {
  try {
    await ElMessageBox.confirm(`确定要删除猫咪 "${row.name}" 吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用真实API
    await axios.delete(`${API_BASE_URL}/${row.id}`)

    // 重新加载数据
    await fetchCats()

    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(`删除失败: ${error.response?.data?.message || error.message || '未知错误'}`)
    }
  }
}

// 提交表单
async function submitForm() {
  try {
    formErrorMessage.value = ''
    submitting.value = true

    // 验证表单
    const valid = await catForm.value.validate()
    if (!valid) return

    // 准备API请求数据
    const payload = { ...formData.value }

    if (isEditing.value) {
      // 更新现有猫咪
      const response = await axios.put(API_BASE_URL, payload)
      if (response.data) {
        ElMessage.success('猫咪信息更新成功')
        dialogVisible.value = false
        await fetchCats()
      }
    } else {
      // 创建新猫咪
      const response = await axios.post(API_BASE_URL, payload)
      if (response.data) {
        ElMessage.success('猫咪添加成功')
        dialogVisible.value = false
        await fetchCats()
      }
    }

  } catch (error) {
    console.error('表单提交失败:', error)

    // 处理验证错误
    if (error.errors) {
      const firstError = Object.values(error.errors)[0][0]
      formErrorMessage.value = firstError.message || '表单验证失败'
      return
    }

    // 处理API错误
    formErrorMessage.value = `操作失败: ${error.response?.data?.message || error.message || '未知错误'}`
  } finally {
    submitting.value = false
  }
}

// 重置表单
function resetForm() {
  if (catForm.value) {
    catForm.value.resetFields()
  }
  formData.value = {
    name: '',
    color: '',
    gender: '公',
    estimatedAge: '',
    healthStatus: '',
    location: '',
    description: '',
    discoveryDate: '',
    personality: '',
    specialNeeds: '',
    sterilizationStatus: false,
    isAdopted: false
  }
  formErrorMessage.value = ''
}
</script>

<style scoped lang="scss">
.cat-page {
  .header {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .search-input {
    width: 260px;
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .switch-label {
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>
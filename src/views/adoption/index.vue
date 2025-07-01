<template>
  <div class="adopt-page">
    <el-card shadow="never">
      <div class="header">
        <el-select v-model="status" placeholder="审核状态" clearable style="width: 240px">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已拒绝" value="REJECTED" />
        </el-select>
        <el-button type="primary" icon="Search" @click="onSearch">筛选</el-button>
        <el-button type="success" icon="Plus" @click="openAddDialog" style="margin-left: 12px;">新增</el-button>
      </div>

      <!-------------------------表格---------------------->
      <el-table :data="pagedData" stripe>

        <el-table-column prop="id" label="申请ID" width="100" />
        <el-table-column prop="catId" label="猫咪ID" width="100" />
        <el-table-column prop="adopterName" label="领养人姓名" min-width="120" />
        <el-table-column prop="adopterPhone" label="领养人电话" min-width="140" />
        <el-table-column prop="status" label="状态" width="120" >
          <template #default="{ row }">
            <el-tag v-if="row.status === 'PENDING'" type="warning">
              <el-icon style="vertical-align: middle;"><Clock /></el-icon>
              待审核
            </el-tag>
            <el-tag v-else-if="row.status === 'APPROVED'" type="success">
              <el-icon style="vertical-align: middle;"><CircleCheck /></el-icon>
              已通过
            </el-tag>
            <el-tag v-else-if="row.status === 'REJECTED'" type="danger">
              <el-icon style="vertical-align: middle;"><CircleClose /></el-icon>
              已拒绝
            </el-tag>
            <span v-else>{{ row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING'" size="small" type="primary" @click="openEditDialog(row, 'audit')" style="margin-right: 8px;">去审核</el-button>
            <el-button v-if="row.status !== 'PENDING'" size="small" @click="openEditDialog(row, 'edit')" style="margin-right: 8px;">编辑</el-button>
            <el-button size="small" @click="openDetailDialog(row)">查看详情</el-button>

          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px;">
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredData.length"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 编辑/审核/新增弹窗 -->
    <el-dialog :title="editMode === 'audit' ? '审核申请' : '编辑申请'" v-model="showEditDialog" width="400px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="猫咪id">
          <el-input v-model="editForm.catId" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="猫咪昵称">
          <el-input v-model="editForm.name" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="领养人姓名">
          <el-input v-model="editForm.adopterName" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="领养人电话">
          <el-input v-model="editForm.adopterPhone" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="领养人地址">
          <el-input v-model="editForm.adopterAddress" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="领养人邮箱">
          <el-input v-model="editForm.adopterEmail" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="领养原因">
          <el-input v-model="editForm.adoptionReason" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="居住条件">
          <el-input v-model="editForm.livingCondition" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="养猫经验">
          <el-input v-model="editForm.experience" :disabled="editMode !== 'add'" />
        </el-form-item>
        <el-form-item label="状态">
          <template v-if="editMode === 'audit'">
            <el-tag>待审核</el-tag>
          </template>
          <template v-else>
            <el-select v-model="editForm.status" style="width: 100%">
              <el-option label="通过" value="APPROVED" />
              <el-option label="拒绝" value="REJECTED" />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="拒绝原因">
          <el-input v-model="editForm.rejectReason" :disabled="false" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.notes" :disabled="false" />
        </el-form-item>
      </el-form>
      <!-------------------------弹窗底部动态渲染---------------------->
      <template #footer>
        <div v-if="editMode === 'add'">
          <el-button type="primary" @click="onAddSubmit">提交</el-button>
          <el-button @click="showEditDialog = false">取消</el-button>
        </div>
        <div v-else-if="editMode === 'audit'">
          <el-button type="success" @click="onApprove">通过</el-button>
          <el-button type="danger" @click="onReject">拒绝</el-button>
          <el-button @click="showEditDialog = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="onSaveEdit">保存</el-button>
          <el-button @click="showEditDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="申请详情" v-model="showDetailDialog" width="500px" :show-close="true">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="申请ID">{{ detailRow.id ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="猫咪昵称">{{ detailRow.name ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="领养人姓名">{{ detailRow.adopterName ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="领养人电话">{{ detailRow.adopterPhone ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="领养人地址">{{ detailRow.adopterAddress ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="领养人邮箱">{{ detailRow.adopterEmail ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="领养原因">{{ detailRow.adoptionReason ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="居住条件">{{ detailRow.livingCondition ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="养猫经验">{{ detailRow.experience ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailRow.status === 'PENDING'">待审核</el-tag>
          <el-tag v-else-if="detailRow.status === 'APPROVED'" type="success">已通过</el-tag>
          <el-tag v-else-if="detailRow.status === 'REJECTED'" type="danger">已拒绝</el-tag>
          <el-tag v-else-if="detailRow.status === 'COMPLETED'" type="info">已完成</el-tag>
          <span v-else>{{ detailRow.status ?? '--' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="拒绝原因">{{ detailRow.rejectReason ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detailRow.applicationTime ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{ detailRow.approvalTime ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="领养时间">{{ detailRow.adoptionTime ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="审批人">{{ detailRow.approvedBy ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailRow.notes ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailRow.createTime ?? '--' }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailRow.updateTime ?? '--' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Clock, CircleCheck, CircleClose} from '@element-plus/icons-vue'

const status = ref('')
const tableData = ref([]) // 初始为空


// 获取数据
const fetchAdoptions = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/adoptions')
    tableData.value = res.data // 假设后端返回的是数组
  } catch (e) {
    // 错误处理
    console.error('获取领养申请失败', e)
  }
}
onMounted(() => {
  fetchAdoptions()
})
//筛选+分页
const currentPage = ref(1)
const pageSize = ref(10) // 每页条数

const filteredData = computed(() => {
  if (!status.value) return tableData.value
  return tableData.value.filter(item => item.status === status.value)
})
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

function handlePageChange(page) {
  currentPage.value = page
}
function indexMethod(index) {
  return (currentPage.value - 1) * pageSize.value + index + 1
}//处理递增序号

//------------------------------------------- 弹窗相关------------------------------------------------
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const editMode = ref('edit') // 'edit' or 'audit' or 'add'
const editForm = ref({
  id: null,                   // 申请ID
  catId: null,               // 猫咪ID
  adopterName: '',          // 领养人姓名
  adopterPhone: '',         // 领养人电话
  adopterAddress: '',        // 领养人地址
  adopterEmail: '',         // 领养人邮箱
  adoptionReason: '',       // 领养原因
  livingCondition: '',      // 居住条件
  experience: '',           // 养猫经验
  status: 'PENDING',        // 状态（PENDING/APPROVED/REJECTED/COMPLETED）
  rejectReason: '',         // 拒绝原因
  notes: '',                // 备注
  applicationTime: null,    // 申请时间
  approvalTime: null,       // 审批时间
  adoptionTime: null,       // 领养时间
  approvedBy: null,         // 审批人
  createTime: null,         // 创建时间
  updateTime: null          // 更新时间
})
const detailRow = ref({})

function openEditDialog(row, mode) {
  editForm.value = { ...row }
  editMode.value = mode
  showEditDialog.value = true
}
function openDetailDialog(row) {
  detailRow.value = { ...row }
  showDetailDialog.value = true
}

async function onApprove() {
  try {
    const updated = { ...editForm.value, status: 'APPROVED' }
    await axios.put(`http://localhost:8080/api/adoptions/${editForm.value.id}`, updated)
    const idx = tableData.value.findIndex(item => item.id === editForm.value.id)
    if (idx !== -1) {
      tableData.value[idx].status = 'APPROVED'
    }
    showEditDialog.value = false
  } catch (e) {
    console.error('审核通过失败', e)
  }
}
async function onReject() {
  try {
    const updated = { ...editForm.value, status: 'REJECTED' }
    await axios.put(`http://localhost:8080/api/adoptions/${editForm.value.id}`, updated)
    const idx = tableData.value.findIndex(item => item.id === editForm.value.id)
    if (idx !== -1) {
      tableData.value[idx].status = 'REJECTED'
    }
    showEditDialog.value = false
  } catch (e) {
    console.error('审核拒绝失败', e)
  }
}
async function onSaveEdit() {
  try {
    await axios.put(`http://localhost:8080/api/adoptions/${editForm.value.id}`, editForm.value)
    // 更新本地数据
    const idx = tableData.value.findIndex(item => item.id === editForm.value.id)
    if (idx !== -1) {
      tableData.value[idx] = { ...editForm.value }
    }
    showEditDialog.value = false
  } catch (e) {
    // 错误处理
    console.error('保存失败', e)
  }
}
function onSearch() {
  // 此处可扩展为后端请求
}

function openAddDialog() {
  editForm.value = {
    id: null,
    catId: '',
    adopterName: '',
    adopterPhone: '',
    adopterAddress: '',
    adopterEmail: '',
    adoptionReason: '',
    livingCondition: '',
    experience: '',
    status: 'PENDING',
    rejectReason: '',
    notes: '',
    applicationTime: null,
    approvalTime: null,
    adoptionTime: null,
    approvedBy: null,
    createTime: null,
    updateTime: null
  }
  editMode.value = 'add'
  showEditDialog.value = true
}


async function onAddSubmit() {
  try {
    // 这里假设后端返回新记录
    const res = await axios.post('http://localhost:8080/api/adoptions', editForm.value)
    tableData.value.push(res.data) // 或者重新 fetchAdoptions()
    showEditDialog.value = false
  } catch (e) {
    console.error('新增失败', e)
  }
}
</script>

<style scoped lang="scss">
.adopt-page {
  .header {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }
  ::v-deep .el-table th,
  ::v-deep .el-table td {
    text-align: center !important;
  }
  .el-card {
    padding: 24px;
  }
}
</style>

<template>
  <div class="medical-record-page">
    <el-card shadow="never" class="table-card">
      <div class="header-bar">
        <el-select v-model="healthStatus" placeholder="健康状态" clearable style="width: 180px;">
          <el-option label="全部" value="" />
          <el-option label="良好" value="良好" />
          <el-option label="一般" value="一般" />
          <el-option label="较差" value="较差" />
          <el-option label="危急" value="危急" />
        </el-select>
        <el-button type="primary" icon="Search" @click="onSearch">筛选</el-button>
        <el-button type="success" icon="Plus" @click="onAdd" style="margin-left: 12px;">新增</el-button>
      </div>

      <el-table :data="pagedData" stripe style="margin-top: 16px;">
        <el-table-column
            label="序号"
            type="index"
            width="60"
            :index="indexMethod"
        />
        <el-table-column prop="catId" label="猫咪ID" width="100" />
        <el-table-column prop="diagnosis" label="诊断" min-width="120" />
        <el-table-column prop="medication" label="用药" min-width="120" />
        <el-table-column prop="updateTime" label="日期" min-width="120" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" @click="onDetail(row)">查看详情</el-button>
            <el-button size="small" @click="onEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          style="margin-top: 16px; text-align: right"
          background
          layout="prev, pager, next, jumper, ->, total"
          :total="total"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          @size-change="val => { pageSize.value = val; currentPage.value = 1 }"
          @current-change="val => { currentPage.value = val }"
      />
    </el-card>
<!---------------------------------------------------------------------------------------->
    <!--查看详情与删除弹窗-->
    <el-dialog v-model="detailDialogVisible" width="600px" :close-on-click-modal="false">
      <el-descriptions v-if="editMode === 'detail' || editMode === 'delete'" :column="2" border>
        <el-descriptions-item label="记录ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="猫咪ID">{{ detailData.catId }}</el-descriptions-item>
        <el-descriptions-item label="兽医姓名"  >{{ detailData.vetName }}</el-descriptions-item>
        <el-descriptions-item label="医院名称">{{ detailData.vetHospital }}</el-descriptions-item>
        <el-descriptions-item label="诊断">{{ detailData.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="治疗方案">{{ detailData.treatment }}</el-descriptions-item>
        <el-descriptions-item label="用药">{{ detailData.medication }}</el-descriptions-item>
        <el-descriptions-item label="花费">{{ detailData.cost }}</el-descriptions-item>
        <el-descriptions-item label="健康状况">{{ detailData.healthStatus }}</el-descriptions-item>
        <el-descriptions-item label="是否紧急">{{ detailData.isEmergency ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="症状">{{ detailData.symptoms }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailData.notes }}</el-descriptions-item>
        <el-descriptions-item label="照片">
          <el-image v-if="detailData.photoUrl" :src="detailData.photoUrl" style="width: 80px; height: 80px;" />
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="记录时间">{{ detailData.recordTime }}</el-descriptions-item>
        <el-descriptions-item label="下次复查">{{ detailData.nextCheckTime }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime }}</el-descriptions-item>
      </el-descriptions>

      <!--更新与新增弹窗-->
      <el-form v-else :model="detailData" label-width="100px" ref="medicalRecordForm" style="margin-top: 20px;">
        <el-form-item label="猫咪ID" prop="catId">
          <el-input v-model="detailData.catId" type="number" />
        </el-form-item>
        <el-form-item label="诊断" prop="diagnosis">
          <el-input v-model="detailData.diagnosis" />
        </el-form-item>
        <el-form-item label="用药" prop="medication">
          <el-input v-model="detailData.medication" />
        </el-form-item>
        <el-form-item label="兽医姓名" prop="vetName">
          <el-input v-model="detailData.vetName" />
        </el-form-item>
        <el-form-item label="医院名称" prop="vetHospital">
          <el-input v-model="detailData.vetHospital" />
        </el-form-item>
        <el-form-item label="治疗方案" prop="treatment">
          <el-input type="textarea" v-model="detailData.treatment" />
        </el-form-item>
        <el-form-item label="花费" prop="cost">
          <el-input-number v-model="detailData.cost" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="健康状况" prop="healthStatus">
          <el-select v-model="detailData.healthStatus" placeholder="请选择健康状态">
            <el-option label="良好" value="良好" />
            <el-option label="一般" value="一般" />
            <el-option label="较差" value="较差" />
            <el-option label="危急" value="危急" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否紧急" prop="isEmergency">
          <el-switch v-model="detailData.isEmergency" />
        </el-form-item>
        <el-form-item label="症状" prop="symptoms">
          <el-input type="textarea" v-model="detailData.symptoms" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input type="textarea" v-model="detailData.notes" />
        </el-form-item>
        <el-form-item label="照片URL" prop="photoUrl">
          <el-input v-model="detailData.photoUrl" />
        </el-form-item>
        <el-form-item label="下次复查" prop="nextCheckTime">
          <el-date-picker v-model="detailData.nextCheckTime" type="datetime" placeholder="选择日期时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button v-if="editMode === 'delete'" type="danger" @click="handleDelete">删除</el-button>
        <el-button v-if="editMode === 'delete' || editMode === 'detail'" @click="detailDialogVisible = false">关闭</el-button>
        <el-button v-if="editMode === 'add'" type="primary" @click="handleSave">保存</el-button>
        <el-button v-if="editMode === 'update'" type="primary" @click="handleUpdate">保存</el-button>
        <el-button v-if="editMode === 'add' || editMode === 'update'" @click="detailDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const tableData = ref([])
const healthStatus = ref('')
const detailDialogVisible = ref(false)
const detailData = ref({})
const editMode = ref('detail') //'detail','add','delete','update'
//获取数据
const fetchMedicalRecords = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/medical-records')
    tableData.value = res.data
  } catch (e) {
    console.error('获取治疗记录失败', e)
  }
}
onMounted(fetchMedicalRecords)

//分页
const currentPage = ref(1)
const pageSize = ref(6) // 每页条数
const total = computed(() => filteredData.value.length)

const filteredData = computed(() => {
  if (!healthStatus.value) return tableData.value
  return tableData.value.filter(item => item.healthStatus === healthStatus.value)
})
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
}) //翻页后的数据
function handlePageChange(page) {
  currentPage.value = page
} //处理调整页面数

function indexMethod(index) {
  return (currentPage.value - 1) * pageSize.value + index + 1
}//处理递增序号

//------------------------------弹窗相关------------------------------------

async function onDetail(row) {
  editMode.value = 'detail'
  await fetchDetail(row.id)
}

async function onEdit(row) { /* 打开编辑弹窗 */
  editMode.value = 'update'
  await fetchDetail(row.id)
}

async function onDelete(row) {
  editMode.value='delete'
  await fetchDetail(row.id)
}

//------------------------------------------------------------------
async function fetchDetail(id) {
  try {
    const res = await axios.get(`http://localhost:8080/api/medical-records/${id}`)
    detailData.value = res.data
    detailDialogVisible.value = true
  } catch (e) {
    console.error('获取详情失败', e)
  }
}
async function handleSave() {
  try {

    await axios.post('http://localhost:8080/api/medical-records', detailData.value)
    // 重新获取最新数据
    await fetchMedicalRecords()
    detailDialogVisible.value = false
  } catch (e) {
    console.error('新增失败', e)
  }
  editMode.value = 'add'
  detailDialogVisible.value = false
}
async function handleUpdate() {
  try {
    // 这里假设后端返回新记录
    await axios.put(`http://localhost:8080/api/medical-records/${detailData.value.id}`, detailData.value)
    // 更新后刷新整个表格，而不是 push
    await fetchMedicalRecords()
    detailDialogVisible.value = false
  } catch (e) {
    console.error('更新失败', e)
  }
}
async function handleDelete() {
  try {
    await axios.delete(`http://localhost:8080/api/medical-records/${detailData.value.id}`)
    detailDialogVisible.value = false
    // 刷新表格
    await fetchMedicalRecords()
  } catch (e) {
    console.error('删除失败', e)
  }
}
function onAdd(){
  detailData.value={
    catId: '',
    diagnosis: '',
    medication: '',
    vetHospital: '',
    vetName: '',
    treatment: '',
    cost: 0,
    healthStatus: '',
    isEmergency: false,
    symptoms: '',
    notes: '',
    photoUrl: '',
    nextCheckTime: ''
  }
  detailDialogVisible.value = true
  editMode.value = 'add';
}
</script>

<style scoped>

.medical-record-page {
  .header-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
  }

  .table-card {
    padding: 15px;
    text-align: center !important;
  }
  ::v-deep .el-table th,
  ::v-deep .el-table td {
    text-align: center !important;
  }

}
</style>

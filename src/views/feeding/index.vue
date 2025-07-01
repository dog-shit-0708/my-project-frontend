<template>
  <div class="feeding-management">
    <div class="header-bar">
      <button class="add-btn" @click="showAddForm">+ 添加记录</button>
      <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索猫咪ID或喂食人..."
          @input="handleSearch"
          class="search-input"
      />
    </div>
    <div class="table-card">
      <table class="feeding-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>猫咪ID</th>
          <th>喂食人</th>
          <th>联系方式</th>
          <th>食物类型</th>
          <th>数量(g)</th>
          <th>地点</th>
          <th>喂食时间</th>
          <th>天气</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="feeding in feedings" :key="feeding.id">
          <td>{{ feeding.id }}</td>
          <td>{{ feeding.catId }}</td>
          <td>{{ feeding.feederName }}</td>
          <td>{{ feeding.feederPhone }}</td>
          <td>{{ feeding.foodType}}</td>
          <td>{{ feeding.foodAmount }}</td>
          <td>{{ feeding.location }}</td>
          <td>{{ formatDateTime(feeding.feedingTime) }}</td>
          <td>{{ feeding.weather }}</td>
          <td>
            <button class="edit-btn" @click="editFeeding(feeding)">编辑</button>
            <button class="delete-btn" @click="deleteFeeding(feeding.id)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <FeedingForm
        v-if="showForm"
        :currentFeeding="currentFeeding"
        :isEditing="isEditing"
        @submit="handleSubmit"
        @cancel="hideForm"
    />
  </div>
</template>

<script>
import FeedingForm from '@/components/FeedingForm.vue';
import feedingApi from '@/api/feeding';

export default {
  components: {
    FeedingForm
  },
  data() {
    return {
      feedings: [],
      searchQuery: '',
      showForm: false,
      isEditing: false,
      currentFeeding: this.getDefaultFeeding(),
      isSubmitting: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.feedings.length / this.pageSize);
    },
    pagedFeedings() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.feedings.slice(start, start + this.pageSize);
    }
  },
  created() {
    this.fetchFeedings();
  },
  methods: {
    async fetchFeedings() {
      try {
        const response = await feedingApi.getAllFeedings();
        this.feedings = response.data;
      } catch (error) {
        console.error('获取喂养记录失败:', error);
      }
    },

    async handleSearch() {
      if (!this.searchQuery.trim()) {
        this.fetchFeedings();
        return;
      }

      try {
        // 尝试按猫咪ID搜索
        if (!isNaN(this.searchQuery)) {
          const response = await feedingApi.getFeedingsByCatId(parseInt(this.searchQuery));
          this.feedings = response.data;
        } else {
          // 按喂食人搜索
          const response = await feedingApi.getFeedingsByFeederName(this.searchQuery);
          this.feedings = response.data;
        }
      } catch (error) {
        console.error('搜索失败:', error);
      }
    },

    showAddForm() {
      this.currentFeeding = this.getDefaultFeeding();
      this.isEditing = false;
      this.showForm = true;
    },

    editFeeding(feeding) {
      this.currentFeeding = {
        id: feeding.id || feeding.ID || feeding.Id || feeding._id,
        catId: feeding.catId || feeding.cat_id,
        feederName: feeding.feederName || feeding.feeder_name,
        feederPhone: feeding.feederPhone || feeding.feeder_phone,
        foodType: feeding.foodType || feeding.food_type,
        foodAmount: feeding.foodAmount || feeding.food_amount,
        location: feeding.location,
        feedingTime: feeding.feedingTime || feeding.feeding_time,
        weather: feeding.weather,
        notes: feeding.notes,
        photoUrl: feeding.photoUrl || feeding.photo_url
      };
      this.isEditing = true;
      this.showForm = true;
    },

    hideForm() {
      this.showForm = false;
    },

    async handleSubmit(feeding) {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        const formatDateToYMDTHMS = (dateStr) => {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return null;
          return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}T${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`;
        };
        const dataToSend = {
          catId: feeding.catId ? parseInt(feeding.catId) : undefined,
          feederName: feeding.feederName,
          feederPhone: feeding.feederPhone,
          foodType: feeding.foodType,
          foodAmount: feeding.foodAmount ? parseFloat(feeding.foodAmount) : undefined,
          location: feeding.location,
          feedingTime: formatDateToYMDTHMS(feeding.feedingTime),
          weather: feeding.weather,
          notes: feeding.notes,
          photoUrl: feeding.photoUrl
        };
        if (this.isEditing) {
          if (!feeding.id || isNaN(Number(feeding.id)) || Number(feeding.id) <= 0) {
            alert('编辑时缺少ID，无法保存');
            this.isSubmitting = false;
            return;
          }
          await feedingApi.updateFeeding(feeding.id, dataToSend);
        } else {
          await feedingApi.addFeeding(dataToSend);
        }
        this.fetchFeedings();
        this.hideForm();
      } catch (error) {
        console.error('保存失败:', error.response?.data || error.message);
        alert(`保存失败: ${error.response?.data?.message || error.message}`);
      } finally {
        this.isSubmitting = false;
      }
    },

    async deleteFeeding(id) {
      if (confirm('确定要删除这条喂养记录吗？')) {
        try {
          await feedingApi.deleteFeeding(id);
          this.fetchFeedings();
        } catch (error) {
          console.error('删除喂养记录失败:', error);
        }
      }
    },

    formatDateTime(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      return date.toLocaleString();
    },

    getDefaultFeeding() {
      return {
        id: null,
        catId: '',
        feederName: '',
        feederPhone: '',
        foodType: '猫粮',
        foodAmount: '',
        location: '',
        feedingTime: new Date().toISOString(),
        weather: '晴',
        notes: '',
        photoUrl: ''
      };
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    }
  }
};
</script>

<style scoped>
.feeding-management {
  padding: 24px;
  background: #f8f9fb;
  min-height: 100vh;
}

.header-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background-color: #45a049;
}

.search-input {
  padding: 8px 12px;
  width: 260px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
}

.table-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 18px 18px 8px 18px;
  margin-top: 10px;
}

.feeding-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.feeding-table th, .feeding-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: left;
}

.feeding-table th {
  background: #f7f7fa;
  font-weight: 600;
}

.feeding-table tr:nth-child(even) {
  background: #fafbfc;
}

.edit-btn {
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 14px;
  margin-right: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: #1976d2;
}
.delete-btn {
  background: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #c0392b;
}
</style>
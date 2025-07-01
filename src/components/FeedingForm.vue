<template>
  <div class="form-modal">
    <div class="form-content">
      <h2>{{ isEditing ? '编辑喂养记录' : '添加喂养记录' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>猫咪ID:</label>
          <input type="number" v-model="formData.catId" required>
        </div>

        <div class="form-group">
          <label>喂食人:</label>
          <input type="text" v-model="formData.feederName" required>
        </div>

        <div class="form-group">
          <label>联系方式:</label>
          <input type="text" v-model="formData.feederPhone">
        </div>

        <div class="form-group">
          <label>食物类型:</label>
          <select v-model="formData.foodType">
            <option value="猫粮">猫粮</option>
            <option value="干粮">干粮</option>
            <option value="湿粮">湿粮</option>
            <option value="罐头">罐头</option>
            <option value="零食">零食</option>
          </select>
        </div>

        <div class="form-group">
          <label>数量(g):</label>
          <input type="number" step="0.1" v-model="formData.foodAmount" required>
        </div>

        <div class="form-group">
          <label>地点:</label>
          <input type="text" v-model="formData.location" required>
        </div>

        <div class="form-group">
          <label>喂食时间:</label>
          <input type="datetime-local" v-model="formattedFeedingTime" required>
        </div>

        <div class="form-group">
          <label>天气:</label>
          <select v-model="formData.weather">
            <option value="晴">晴</option>
            <option value="阴">阴</option>
            <option value="雨">雨</option>
            <option value="雪">雪</option>
            <option value="雾">雾</option>
          </select>
        </div>

        <div class="form-group">
          <label>备注:</label>
          <textarea v-model="formData.notes"></textarea>
        </div>

        <div class="form-group">
          <label>照片URL:</label>
          <input type="text" v-model="formData.photoUrl">
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">{{ isEditing ? '更新' : '添加' }}</button>
          <button type="button" @click="cancel" class="cancel-btn">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentFeeding: {
      type: Object,
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: { ...this.currentFeeding }
    };
  },
  computed: {
    formattedFeedingTime: {
      get() {
        if (!this.formData.feedingTime) return '';
        const date = new Date(this.formData.feedingTime);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 16);
      },
      set(value) {
        this.formData.feedingTime = value ? new Date(value).toISOString() : null;
      }
    }
  },
  watch: {
    currentFeeding(newVal) {
      this.formData = { ...newVal };
    }
  },
  methods: {
    handleSubmit() {
      console.log('formData', this.formData);
      this.$emit('submit', { ...this.formData });
    },
    cancel() {
      this.$emit('cancel');
    },
    formatDateToYMDHMS(dateStr) {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    }
  }
};
</script>

<style scoped>
.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  margin-top: 0;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style>
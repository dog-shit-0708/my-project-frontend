<template>
  <div class="home-container">


    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <i class="fas fa-cat cat-decoration"></i>
        <i class="fas fa-paw cat-paws"></i>
        <h1 class="welcome-title">欢迎来到务克毛毛流浪猫信息管理系统</h1>
        <p class="welcome-subtitle">
          我们致力于为流浪猫提供更好的关爱与管理，这里记录了猫咪档案、喂养、领养和健康信息，
          让我们共同为流浪猫创造一个温暖的家。
        </p>
        <el-button type="warning" size="large" round class="add-cat-btn" @click="navigateTo('/cat')">
          <i class="fas fa-plus"></i> 添加新猫咪档案
        </el-button>
      </div>

      <!-- 功能卡片区 -->
      <h2 class="section-title">系统功能导航</h2>

      <div class="features-section">
        <div
            class="feature-card"
            @click="navigateTo('/cat')"
            :style="{ '--delay': 1 }"
        >
          <div class="card-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <h3 class="card-title">猫咪档案</h3>
          <p class="card-description">
            查看和管理所有猫咪的详细信息，包括照片、品种、年龄、个性等。
          </p>
          <el-button type="warning" plain round>查看详情</el-button>
        </div>

        <div
            class="feature-card"
            @click="navigateTo('/feeding')"
            :style="{ '--delay': 2 }"
        >
          <div class="card-icon">
            <i class="fas fa-bowl-food"></i>
          </div>
          <h3 class="card-title">喂养记录</h3>
          <p class="card-description">
            记录每只猫咪的喂养情况，包括食物类型、时间和负责人。
          </p>
          <el-button type="warning" plain round>查看详情</el-button>
        </div>

        <div
            class="feature-card"
            @click="navigateTo('/adoption')"
            :style="{ '--delay': 3 }"
        >
          <div class="card-icon">
            <i class="fas fa-house"></i>
          </div>
          <h3 class="card-title">领养信息</h3>
          <p class="card-description">
            查看待领养猫咪信息和领养申请记录，帮助猫咪找到温暖的家。
          </p>
          <el-button type="warning" plain round>查看详情</el-button>
        </div>

        <div
            class="feature-card"
            @click="navigateTo('/medical_record')"
            :style="{ '--delay': 4 }"
        >
          <div class="card-icon">
            <i class="fas fa-heartbeat"></i>
          </div>
          <h3 class="card-title">健康管理</h3>
          <p class="card-description">
            记录猫咪的健康状况、疫苗接种、疾病治疗等医疗信息。
          </p>
          <el-button type="warning" plain round>查看详情</el-button>
        </div>
      </div>

      <!-- 猫咪展示区 -->
      <h2 class="section-title">待领养猫咪</h2>
      <div class="cats-section">
        <div class="cats-grid">
          <div
              class="cat-card"
              v-for="cat in cats"
              :key="cat.id"
          >
            <div class="cat-tag">待领养</div>
            <img :src="cat.image" class="cat-image" alt="猫咪照片">
            <div class="cat-info">
              <h3 class="cat-name">{{ cat.name }}</h3>
              <div class="cat-details">
                <span>{{ cat.gender }} · {{ cat.age }}</span>
                <span>{{ cat.breed }}</span>
              </div>
              <el-button type="warning" plain round class="adopt-btn" @click="navigateTo('/adoption')">
                领养我
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部统计信息 -->
    <div class="footer">
      <p>我们正在帮助 {{ totalCats }} 只流浪猫寻找温暖的家</p>
      <div class="stats">
        <div
            class="stat-item"
            v-for="(stat, index) in stats"
            :key="stat.label"
            :style="{ '--delay': index + 1 }"
        >
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import '@/views/home/home.scss';
export default {
  name: 'HomeView',
  components: {
    ElButton
  },
  setup() {
    const router = useRouter();

    // 导航函数 - 使用Vue Router进行跳转
    const navigateTo = (path) => {
      const sectionNames = {
        '/cat': '猫咪档案',
        '/feeding': '喂养记录',
        '/adoption': '领养信息',
        '/medical_record': '健康管理'
      };

      ElMessage.success(`正在跳转到${sectionNames[path] || path}页面`);
      router.push(path);
    };

    // 猫咪数据
    const cats = ref([
      { id: 1, name: '小白', gender: '公', age: '6个月', breed: '中华田园猫', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 2, name: '橘宝', gender: '公', age: '1岁', breed: '橘猫', image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 3, name: '小花', gender: '母', age: '8个月', breed: '三花猫', image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 4, name: '煤球', gender: '公', age: '1.5岁', breed: '黑猫', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 5, name: '奶茶', gender: '母', age: '1岁', breed: '布偶猫', image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 6, name: '豆包', gender: '公', age: '9个月', breed: '英短', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
    ]);

    // 统计数据
    const totalCats = ref(42);
    const stats = ref([
      { label: '已领养', value: 28 },
      { label: '本周喂养', value: 126 },
      { label: '健康记录', value: 75 },
      { label: '志愿者', value: 18 }
    ]);

    return {
      navigateTo,
      cats,
      totalCats,
      stats
    };
  }
}
</script>


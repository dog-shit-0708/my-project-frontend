<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside" v-scrollbar>
      <!-- LOGO 区域 -->
      <div class="logo">
        <img class="logo-img" :src="logo" alt="logo" />
        <span v-if="!isCollapse" class="logo-text">务克毛毛</span>
      </div>

      <!-- 菜单 -->
      <el-menu
        router
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="transparent"
        text-color="#333"
        active-text-color="#333"
        class="side-menu"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span v-if="!isCollapse">
            <router-link to="/home">首页</router-link>
          </span>
        </el-menu-item>
        <el-menu-item index="/cat">
          <el-icon><MenuIcon /></el-icon>
          <span v-if="!isCollapse">
          <router-link to="/cat">猫咪档案</router-link>
          </span>
        </el-menu-item>
        <el-menu-item index="/feeding">
          <el-icon><KnifeFork /></el-icon>
          <span v-if="!isCollapse">
          <router-link to="/feeding">喂养记录</router-link>
            </span>
        </el-menu-item>
        <el-menu-item index="/adoption">
          <el-icon><User /></el-icon>
          <span v-if="!isCollapse">
          <router-link to="/adoption">领养信息</router-link>
          </span>
        </el-menu-item>
        <el-menu-item index="/medical_record">
          <el-icon><Warning /></el-icon>
          <span v-if="!isCollapse">
          <router-link to="/medical_record">健康管理</router-link>
          </span>
        </el-menu-item>
      </el-menu>

      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon>
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <!-- 顶部栏 -->
      <el-header class="layout-header">
        <div class="search-box">
          <el-input v-model="keyword" size="small" placeholder="搜索..." prefix-icon="Search" />
        </div>
        <div class="header-title">
          <span class="system-title">务克毛毛猫咪信息管理系统</span>
          <span class="system-subtitle">—— 用心守护每一只猫咪</span>
        </div>
      </el-header>

      <!-- 业务内容 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import logo from '@/assets/logoo.jpg'
import logoMini from '@/assets/logoo.jpg'
import {
  House,
  Menu as MenuIcon,
  KnifeFork,
  User,
  Warning,
  Fold,
  Expand,
  Bell,
  Setting,
  MoreFilled
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)
const keyword = ref('')
const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;

  .layout-aside {
    background: #fde6a4; /* 左侧整体淡黄色背景 */
    display: flex;
    padding-top: 20px;
    flex-direction: column;
    border-radius: 12px; /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 阴影 */
    margin: 8px; /* 让圆角和阴影可见 */

    .logo {

      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      .logo-img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        object-fit: cover;
      }
      .logo-text {
        font-size: 20px;
        font-weight: 600;
        color: #5c3a1e; /* 深咖啡色，与淡黄背景更搭 */
        letter-spacing: 2px;
      }
    }

    .collapse-btn {

      margin-top: auto;
      text-align: center;
      padding: 10px 0;
      cursor: pointer;
      color: #999;
      &:hover {
        color: #333;
      }
    }

    .side-menu {
      border-right: none;
      padding-top: 20px;

      .el-menu-item {
        height: 48px;
        line-height: 48px;
        border-radius: 8px;
        margin: 4px 8px;
        transition: all 0.2s ease;
        &.is-active {
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          color: #d48a00;
          font-weight: 600;
        }
        &:hover, &:focus {
          background: #fffbe6 !important;
          color: #d48a00 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        &:hover a,
        &:hover span,
        &:hover .router-link-active,
        &:hover .router-link-exact-active {
          background: none !important;
          color: #d48a00 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        span {
          display: flex;
          align-items: center;
          height: 100%;
          background: none !important;
          box-shadow: none !important;
          color: inherit !important;
          router-link {
            color: inherit !important;
            text-decoration: none;
            background: none !important;
            padding: 0;
            margin: 0;
            font: inherit;
            box-shadow: none !important;
            outline: none !important;
            &:hover, &:active, &:focus {
              color: #d48a00;
              text-decoration: none;
              background: none !important;
              box-shadow: none !important;
              outline: none !important;
            }
          }
        }
      }

      /* 折叠状态下让图标水平居中 */
      &.el-menu--collapse {
        .el-menu-item {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
      }
    }
  }

  .layout-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    position: relative;

    .search-box {
      position: absolute;
      left: 20px;
      width: 200px;
    }

    .header-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: none;
      margin: 0 auto;
      .system-title {
        font-size: 20px;
        font-weight: 600;
        color: #d48a00;
        letter-spacing: 2px;
      }
      .system-subtitle {
        font-size: 13px;
        color: #999;
        margin-top: 2px;
      }
    }
  }

  .layout-main {
    padding: 15px;
    background: #f5f7fb;
    min-height: calc(100vh - 64px);
  }
}

/* 覆盖 el-menu-item 内 router-link 的激活/聚焦/选中样式 */
.side-menu .el-menu-item,
.side-menu .el-menu-item.is-active,
.side-menu .el-menu-item:focus,
.side-menu .el-menu-item:active,
.side-menu .el-menu-item.router-link-active,
.side-menu .el-menu-item.router-link-exact-active,
.side-menu .el-menu-item span,
.side-menu .el-menu-item span:focus,
.side-menu .el-menu-item span:active,
.side-menu .el-menu-item span .router-link-active,
.side-menu .el-menu-item span .router-link-exact-active,
.side-menu .el-menu-item a,
.side-menu .el-menu-item a:focus,
.side-menu .el-menu-item a:active,
.side-menu .el-menu-item a.router-link-active,
.side-menu .el-menu-item a.router-link-exact-active {
  background: none !important;
  color: inherit !important;
  box-shadow: none !important;
  outline: none !important;
}

.side-menu .el-menu-item.is-active {
  background: #fff !important;
  color: #d48a00 !important;
  font-weight: 600;
  box-shadow: none !important;
  outline: none !important;
}

.side-menu .el-menu-item.is-active:hover,
.side-menu .el-menu-item.is-active:focus {
  background: #fff !important;
  color: #d48a00 !important;
}

.side-menu .el-menu-item:hover a,
.side-menu .el-menu-item:hover span,
.side-menu .el-menu-item:hover .router-link-active,
.side-menu .el-menu-item:hover .router-link-exact-active {
  background: none !important;
  color: #d48a00 !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>

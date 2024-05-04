<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="logout-button">
          <el-icon>
            <EditPen/>
          </el-icon>
          <p>修改密码</p>
        </div>
        <div class="logout-button" @click="logout">
          <el-icon>
            <SwitchButton/>
          </el-icon>
          <p>退出</p>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="220px" class="aside">
          <el-col :span="50" class="aside-content">
            <el-menu
                class="vertical-menu"
                default-active="2"
                @open="handleOpen"
                @close="handleClose"
            >
              <!-- Class and Student Management -->
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <location/>
                  </el-icon>
                  <span>班级学员管理</span>
                </template>
                <el-menu-item index="1-1" @click="transferTo('classManage')">班级管理</el-menu-item>
                <el-menu-item index="1-2" @click="transferTo('studentManage')">学员管理</el-menu-item>
              </el-sub-menu>
              <!-- System Information Management -->
              <el-sub-menu index="2">
                <template #title>
                  <el-icon>
                    <icon-menu/>
                  </el-icon>
                  <span>系统信息管理</span>
                </template>
                <el-menu-item index="2-1" @click="transferTo('departmentManage')">部门管理</el-menu-item>
                <el-menu-item index="2-2" @click="transferTo('workersManage')">员工管理</el-menu-item>
              </el-sub-menu>
              <!-- Data Statistics Management -->
              <el-sub-menu index="3">
                <template #title>
                  <el-icon>
                    <Document/>
                  </el-icon>
                  <span>数据统计管理</span>
                </template>
                <el-menu-item index="3-1" @click="transferTo('empData')">员工信息统计</el-menu-item>
                <el-menu-item index="3-2" @click="transferTo('studentData')">学员信息统计</el-menu-item>
              </el-sub-menu>
              <!-- Course and Academic Affairs Management -->
              <el-sub-menu index="4">
                <template #title>
                  <el-icon>
                    <Setting/>
                  </el-icon>
                  <span>课程教务管理</span>
                </template>
                <el-menu-item index="4-1" @click="transferTo('courseManage')">课程管理</el-menu-item>
                <el-menu-item index="4-2" @click="transferTo('courseArrange')">课程安排</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main class="main-content">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  SwitchButton,
  EditPen
} from '@element-plus/icons-vue'
import {RouterLink, RouterView} from 'vue-router'
import {useRouter} from 'vue-router';

const router = useRouter();
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

function transferTo(name) {
  router.push(name);
}

function logout() {
  localStorage.removeItem('token');
  router.push("/");
}
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.container {
  flex: 1;
}

.header {
  display: flex;
  box-shadow: 2px 0px 5px 0px rgba(0, 0, 0, 0.2);
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(135deg, #4db7b7 0%, #0797ba 100%);
}

.logout-button {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 15px;
}

.logout-button p {
  margin: 5px;
}

.logout-button:hover {
  color: #409EFF;
}

.aside {
  background-color: #fff;
  box-shadow: 2px 0px 5px 0px rgba(0, 0, 0, 0.2);
}

.vertical-menu {
  font-size: 1.3rem;
}

.main-content {
  flex: 1;
}

</style>

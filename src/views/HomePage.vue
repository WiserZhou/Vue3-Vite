<template>
  <el-container class="common-layout">
    <el-header class="header">
      <div class="button">
        <el-icon>
          <EditPen/>
        </el-icon>
        <span>修改密码</span>
      </div>
      <div class="button" @click="logout">
        <el-icon>
          <SwitchButton/>
        </el-icon>
        <span>退出登录</span>
      </div>
    </el-header>
    <el-container class="container">
      <el-aside width="200px" class="aside">
        <el-col class="aside-content">
          <el-menu
              class="vertical-menu"
              default-active="1"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <user-filled></user-filled>
                </el-icon>
                <span>班级学员管理</span>
              </template>
              <el-menu-item index="1-1" @click="transferTo('/classManage')">班级管理</el-menu-item>
              <el-menu-item index="1-2" @click="transferTo('/studentManage')">学员管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Tools></Tools>
                </el-icon>
                <span>系统信息管理</span>
              </template>
              <el-menu-item index="2-1" @click="transferTo('/departmentManage')">部门管理</el-menu-item>
              <el-menu-item index="2-2" @click="transferTo('/employeeManage')">员工管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <TrendCharts></TrendCharts>
                </el-icon>
                <span>数据统计管理</span>
              </template>
              <el-menu-item index="3-1" @click="transferTo('/empInfoManage')">员工信息统计</el-menu-item>
              <el-menu-item index="3-2" @click="transferTo('/stuInfoManage')">学员信息统计</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon>
                  <Management></Management>
                </el-icon>
                <span>课程教务管理</span>
              </template>
              <el-menu-item index="4-1" @click="transferTo('/curriculumManage')">课程管理</el-menu-item>
              <el-menu-item index="4-2" @click="transferTo('/curriculumArrange')">课程安排</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main class="main-content">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {
  UserFilled,
  Tools,
  TrendCharts,
  Management,
  SwitchButton,
  EditPen
} from '@element-plus/icons-vue'
import {RouterView} from 'vue-router'
import {useRouter} from 'vue-router';

const router = useRouter();

function transferTo(path) {
  router.push(path);
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

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(135deg, #4db7b7 0%, #0797ba 100%);
}

.button {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 15px;
}


.button:hover {
  color: #0b6acc;
}

.aside {
  background-color: rgba(217, 232, 229, 0.2);
}

.vertical-menu {
  font-size: 1.3rem;
}

.main-content {
  flex: 1;
}

.button p {
  margin: 30px;
}


</style>

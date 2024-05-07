<template>
  <!-- 删除确认框 -->
  <el-dialog
      v-model="dialogVisible"
      width="500"
  >
    <ContentHeader content="删除部门"></ContentHeader>
    <div class="info-message">您确定要删除该部门吗 ?</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmDelete()">
          确定
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 表格弹出框 -->
  <el-dialog v-model="dialogFormVisible" width="500">
    <ContentHeader :content="dialogContent"></ContentHeader>
    <div class="info-message" style="display: flex;font-size: 14px;align-items: center;">
      <span style="width: 100px;">* 部门名称</span>

      <el-input v-model="name" placeholder="请输入部门名称，长度为2-10位" clearable/>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <div class="wholeWrapper">
    <ContentHeader content="部门管理"></ContentHeader>
    <!-- 新增按钮 -->
    <el-button type="primary" @click="handleAdd" style="margin-top: 20px;">+ 新增部门</el-button>
    <div class="info-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" :fit="true">
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column property="name" label="部门名称" align="center"/>
        <el-table-column property="updateTime" label="最后操作时间" :formatter="dateFormatter" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script setup>
import ContentHeader from '../../components/ContentHeader.vue';
import {ElMessage} from 'element-plus'
import {reactive, ref} from 'vue'
import apiAxios from '@/api/ApiAxios.js';
import moment from 'moment';
// 用于记录当前打开对话框的id
const temp_id = ref(0);
// 日期格式化显示
const dateFormatter = (row) => {
  const updateTime = row.updateTime;
  const date = moment(updateTime);
  return date.format("YYYY-MM-DD HH:mm:ss");
}
// 这里是获取表格数据部分
const tableData = ref([]);

function getDeptList() {
  apiAxios({
    url: '/depts',
    method: 'get',
  }).then(res => {
    console.log(res.data);
    tableData.value = res.data.data;
  }).catch(err => {
    console.log(err.message);
  })
}

getDeptList();
// 确认删除框部分
const dialogVisible = ref(false)


// 弹出框部分
// 用于标记dialog处于新增还是修改状态
const state = 0; //0表示新增，1表示修改
const dialogContent = ref("新增部门");
// 新增/修改部门名称
const name = ref("");
// 设置弹出框是否可见以及内部输入框的width
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

// 对按钮的处理
function handleSave() {
  if (!(name.value.length >= 2 && name.value.length <= 10)) {
    ElMessage.error('请输入长度为2-10位的名称！');
  } else {
    let data;
    let method;
    if (dialogContent.value == "新增部门") {
      method = 'post';
      data = {
        name: name.value
      }
    } else if (dialogContent.value == "编辑部门") {
      method = 'put';
      data = {
        id: temp_id.value,
        name: name.value
      }
    }
    apiAxios({
      url: '/depts',
      method: method,
      data: data,
    }).then(res => {
      console.log(res.data);
      if (res.data.code) {
        dialogFormVisible.value = false;
        ElMessage({
          message: '保存成功！',
          type: 'success',
        })
        getDeptList();
      } else {
        ElMessage.error(res.data.msg);
      }
    }).catch(err => {
      console.log(err.message);
    })
  }
}

// 新增部门按钮
function handleAdd() {
  name.value = "";
  dialogContent.value = "新增部门";
  dialogFormVisible.value = true;
}

// 编辑部门按钮
const handleEdit = (index, row) => {
  console.log(index, row)
  temp_id.value = row.id;
  name.value = row.name;
  dialogContent.value = "编辑部门";
  dialogFormVisible.value = true;
}
const handleDelete = (index, row) => {
  console.log(index, row)
  temp_id.value = row.id;
  dialogVisible.value = true;
}

function confirmDelete() {
  apiAxios({
    url: '/depts/' + temp_id.value,
    method: 'delete',
  }).then(res => {
    console.log(res.data);
    if (res.data.code) {
      ElMessage({
        message: "删除成功!",
        type: 'success'
      })
      dialogVisible.value = false;
      getDeptList();
    }
  })
}
</script>

<style scoped>
.wholeWrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.info-message {
  font-size: 18px;
  margin: 20px 20px 10px;
}

.query {
  height: 60px;
}

.demo-form-inline {
  display: flex;
  padding-top: 20px;
}

.demo-form-inline .el-input {
  --el-input-width: 100px;
}

.demo-form-inline .el-select {
  --el-select-width: 100px;
}

.info-table {
  margin-top: 20px;
}


</style>
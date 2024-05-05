<template>
  <ContentHeader content="班级管理"></ContentHeader>

  <div class="queryForm">
    <el-form :inline="true" :model="formQuery" class="demo-form-inline">
      <el-form-item label="班级名称">
        <el-input v-model="formQuery.name" placeholder="请输入班级名称" style="width: 180px;"/>
      </el-form-item>
      <el-form-item label="课程时间">
        <el-date-picker
            v-model="formQuery.period"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-value="[new Date(), new Date()]"
            value-format="YYYY-MM-DD"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>

    </el-form>
  </div>

  <el-button type="primary" @click="handleAdd">新增班级</el-button>

  <div class="tableInfo">
    <el-table :data="tableData" :fit="true">

      <el-table-column type="index" label="序号" width="100" align="center">
        <template #default="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column property="name" label="班级名称" align="center"/>
      <el-table-column property="classroom" label="班级教室" align="center"/>
      <el-table-column property="startTime" label="开课时间" align="center"/>
      <el-table-column property="endTime" label="结课时间" align="center"/>
      <el-table-column property="teacher" label="班主任" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>

  <el-dialog v-model="isFormDialogVisible" width="500">

    <ContentHeader :content="dialogContent"></ContentHeader>

    <el-form :model="form" style="margin-top: 15px;" ref="ruleFormRef" :rules="rules">
      <el-form-item label="班级名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" placeholder="请输入班级名称，如：2024第01期10班" style="width: 280px;"/>
      </el-form-item>
      <el-form-item label="班级教室" :label-width="formLabelWidth" prop="classroom">
        <el-input v-model="form.classroom" placeholder="请填写班级教室" style="width: 280px;"/>
      </el-form-item>
      <el-form-item label="开课时间" :label-width="formLabelWidth" prop="startTime">
        <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="请选择开课时间"
            size="default"
            style="width: 280px;"
            value-format="YYYY-MM-DD"/>
      </el-form-item>
      <el-form-item label="结课时间" :label-width="formLabelWidth" prop="endTime">
        <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="请选择结课时间"
            size="default"
            style="width: 280px;"
            value-format="YYYY-MM-DD"/>
      </el-form-item>
      <el-form-item label="班主任" :label-width="formLabelWidth" prop="teacherId">
        <el-select
            v-model="form.teacherId"
            filterable
            clearable
            placeholder="请选择"
            style="width: 280px;">
          <el-option
              v-for="item in empOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="isFormDialogVisible = false">取消</el-button>
      </div>
    </template>

  </el-dialog>

  <el-dialog v-model="dialogVisible" width="500">

    <ContentHeader content="删除班级"></ContentHeader>

    <div class="info-message">确定要删除该班级吗？</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmDelete">
          确定
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>

  </el-dialog>

  <el-pagination class="foot-pagination"
                 v-model:current-page="currentPage"
                 v-model:page-size="pageSize"
                 :page-sizes="[10, 20, 50, 100]"
                 layout="slot, sizes, prev, pager, next, jumper"
                 :total="total"
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange">
    <template #default>
      <span class="el-pagination__total">共{{ total }}条数据</span>
    </template>
    <template #jumper>
      <span>前往{{ jumper }}页</span>
    </template>
  </el-pagination>

</template>

<script setup>
import ContentHeader from '../../components/ContentHeader.vue';
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue'
import apiAxios from '@/api/ApiAxios.js';

function validateName(rule, value) {
  const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  if (!pattern.test(value) && value !== "") {
    return Promise.reject('输入只能包含汉字、数字和字母！');
  } else {
    return Promise.resolve();
  }
}

const ruleFormRef = ref()

const rules = reactive({
  name: [
    {required: true, message: '请输入班级名称', trigger: 'blur'},
    {min: 4, max: 30, message: '班级名称长度应为4-30', trigger: 'blur'},
    {validator: validateName, trigger: 'blur'}
  ],
  classroom: [
    {min: 1, max: 20, message: '教室长度应为1-20', trigger: 'blur'},
    {validator: validateName, trigger: 'blur'}
  ],
  startTime: [
    {type: 'date', required: true, message: '请选择开课时间', trigger: 'change'},
    {validator: validateStartTime, trigger: 'change'}
  ],
  endTime: [
    {type: 'date', required: true, message: '请选择结课时间', trigger: 'change'},
    {validator: validateEndTime, trigger: 'change'}
  ],
  teacherId: [
    {required: true, message: '请选择班主任', trigger: 'change'}
  ]
})

function validateStartTime(rule, value, callback) {
  const endTime = form.value.endTime;
  if (value && endTime && value >= endTime) {
    callback(new Error('开课时间应早于结课时间'));
  } else {
    callback();
  }
}

function validateEndTime(rule, value, callback) {
  const startTime = form.value.startTime; // 获取开始时间
  if (value && startTime && value <= startTime) {
    callback(new Error('结课时间应晚于开课时间'));
  } else {
    callback();
  }
}

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(1);
const dialogVisible = ref(false)
const dialogContent = ref("新增班级");
const form = ref({});
const isFormDialogVisible = ref(false)
const formLabelWidth = '140px'
let empOptions = [];
let empMap = {};

function getEmpList() {
  apiAxios({
    url: '/emps/all',
    method: 'get',
  }).then(res => {
    console.log(res.data);
    let temp_data = res.data.data;
    temp_data.forEach(x => {
      empOptions.push({
        label: x.name,
        value: x.id
      });
      empMap[x.id] = x.name;
    })
  }).catch(err => {
    console.log(err.message);
  })
}

getEmpList();

const formQuery = reactive({
  name: "",
  period: [null, null]
})

const tableData = ref([]);

function getClassList() {
  if (formQuery.period == null) {
    formQuery.period = [null, null];
  }
  let params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    name: formQuery.name,
    begin: formQuery.period[0],
    end: formQuery.period[1],
  }
  console.log(params);
  apiAxios({
    url: '/class',
    method: 'get',
    params
  }).then(res => {
    console.log(res.data);
    tableData.value = res.data.data.rows;
    tableData.value.forEach(x => {
      x.teacher = empMap[x.teacherId];
    });
    total.value = res.data.data.total;
  }).catch(err => {
    console.log(err.message);
  })
}

getClassList();

const onSubmit = () => {
  getClassList();
}

// 对按钮的处理
async function handleSave(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      let method = '';
      if (dialogContent.value === "新增班级") {
        method = 'post';
      } else if (dialogContent.value === "修改班级") {
        method = 'put';
      }
      console.log(form.value);
      apiAxios({
        url: "/class",
        method: method,
        data: form.value,
      }).then(res => {
        console.log(res.data);
        if (res.data.code) {
          isFormDialogVisible.value = false;
          ElMessage({
            message: '保存成功！',
            type: 'success',
          })
          getClassList();
        } else {
          ElMessage.error(res.data.msg);
        }
      }).catch(err => {
        console.log(err.message);
      })
    } else {
      console.log('error submit!', fields)
    }
  })

}

function handleAdd() {
  form.value = {
    "id": null,
    "name": "",
    "classroom": "",
    "startTime": null,
    "endTime": null,
    "teacherId": null
  }
  dialogContent.value = "新增班级";
  isFormDialogVisible.value = true;
}

const handleEdit = (index, row) => {
  console.log(index, row)
  apiAxios({
    url: "/class/" + row.id,
    method: 'get',
  }).then(res => {
    console.log(res.data);
    form.value = res.data.data;
  }).catch(err => {
    console.log(err.message);
  })
  dialogContent.value = "修改班级";
  isFormDialogVisible.value = true;
}
const temp_id = ref(0);
const handleDelete = (index, row) => {
  console.log(index, row)
  temp_id.value = row.id;
  dialogVisible.value = true;
}

function confirmDelete() {
  apiAxios({
    url: "/class/" + temp_id.value,
    method: "delete",
  }).then(res => {
    console.log(res.data);
    if (res.data.code) {
      ElMessage({
        message: '删除成功！',
        type: 'success',
      })
      getClassList();
      dialogVisible.value = false;
    } else {
      ElMessage.error(res.data.msg);
    }
  })
}

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  getClassList();
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  getClassList();
}

</script>

<style scoped>
.demo-form-inline {
  --el-input-width: 100px;
}

.demo-form-inline {
  --el-select-width: 100px;
}

.info-message {
  font-size: 18px;
  margin: 20px 20px 10px;
}

.queryForm {
  height: 60px;
}

.demo-form-inline {
  display: flex;
  padding-top: 20px;
}

.tableInfo {
  margin-top: 20px;
}

.foot-pagination {
  position: absolute;
  bottom: 5px;
  right: 10px;
}
</style>
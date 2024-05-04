<template>
  <!-- 学员违纪处理框 -->
  <el-dialog
      v-model="indisciplineDialogVisible"
      width="500"
  >
    <ContentHeader content="学员违纪处理"></ContentHeader>
    <div>
      <el-form style="margin-top: 15px;">
        <el-form-item label="违纪扣分" :label-width="formLabelWidth">
          <el-input v-model="points" style="width: 280px;" @input="handleChange"/>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlePoints">
          确定
        </el-button>
        <el-button @click="indisciplineDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 批量删除确认框 -->
  <el-dialog
      v-model="dialogBatchVisible"
      width="500"
  >
    <ContentHeader content="批量删除学员"></ContentHeader>
    <div class="info-message">您确定要批量删除这些学员的信息吗 ?</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmDelete(1)">
          确定
        </el-button>
        <el-button @click="dialogBatchVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 删除确认框 -->
  <el-dialog
      v-model="dialogVisible"
      width="500"
  >
    <ContentHeader content="删除学员"></ContentHeader>
    <div class="info-message">您确定要删除该学员的信息吗 ?</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmDelete(0)">
          确定
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>

      </div>
    </template>
  </el-dialog>
  <!-- 表格弹出框 -->
  <el-dialog v-model="dialogFormVisible" width="500">
    <ContentHeader :content="dialogContent"></ContentHeader>
    <el-form :model="form" style="margin-top: 15px;" ref="ruleFormRef" :rules="rules">
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" style="width: 280px;"/>
      </el-form-item>
      <el-form-item label="学号" :label-width="formLabelWidth" prop="stuId">
        <el-input v-model="form.stuId" placeholder="请输入学号" style="width: 280px;"/>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
        <el-select
            v-model="form.gender"
            filterable
            clearable
            placeholder="请选择"
            style="width: 280px;"
        >
          <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth" prop="telephone">
        <el-input v-model="form.telephone" placeholder="请输入手机号" style="width: 280px;"/>
      </el-form-item>
      <el-form-item label="最高学历" :label-width="formLabelWidth">
        <el-select
            v-model="form.education"
            filterable
            clearable
            placeholder="请选择"
            style="width: 280px;"
        >
          <el-option
              v-for="item in educationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级" :label-width="formLabelWidth" prop="classId">
        <el-select
            v-model="form.classId"
            filterable
            clearable
            placeholder="请选择"
            style="width: 280px;"
        >
          <el-option
              v-for="item in classOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <div class="wholeWrapper">
    <ContentHeader content="学员管理"></ContentHeader>

    <div class="query">
      <!-- 查询表单 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="学员姓名">
          <el-input v-model="formInline.name" placeholder="请输入学员姓名" style="width: 150px;" clearable/>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="formInline.stuId" placeholder="请输入学号" style="width: 150px;" clearable/>
        </el-form-item>
        <el-form-item label="最高学历">
          <el-select
              v-model="formInline.education"
              filterable
              clearable
              placeholder="请选择"
              style="width: 280px;"
          >
            <el-option
                v-for="item in educationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级">
          <el-select
              v-model="formInline.classId"
              filterable
              clearable
              placeholder="请选择"
              style="width: 280px;"
          >
            <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增按钮 -->
    <el-button type="primary" @click="handleAdd">+ 添加学员</el-button>
    <el-button type="primary" @click="handleBatchDel">- 批量删除</el-button>

    <div class="info-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%;height: calc(100vh - 300px);" :fit="true"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column property="name" label="姓名" align="center"/>
        <el-table-column property="stuId" label="学号" align="center"/>
        <el-table-column property="class" label="班级" align="center"/>
        <el-table-column property="genderName" label="性别" align="center"/>
        <el-table-column property="telephone" label="手机号" align="center"/>
        <el-table-column property="education" label="最高学历" align="center"/>
        <el-table-column property="indisciplineTime" label="违纪次数" align="center"/>
        <el-table-column property="indisciplinePoints" label="违纪扣分" align="center"/>
        <el-table-column property="updateTime" label="最后操作时间" :formatter="dateFormatter" align="center"/>
        <el-table-column label="操作" align="center" width="250">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="warning" @click="handleIndiscipline(scope.$index, scope.row)">违纪</el-button>
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

    <!-- 翻页器 -->
    <div class="foot-pagination">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="slot, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
        <template #default>
          <span class="el-pagination__total">共{{ total }}条数据</span>
        </template>
        <template #jumper>
          <span>前往{{ jumper }}页</span>
        </template>
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import ContentHeader from '../../components/ContentHeader.vue';
import baseAxios from '@/api/baseAxios';
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import moment from 'moment';

// 校验规则
function validateId(rule, value) {
  // 使用正则表达式验证用户名是否只包含数字和字母
  const pattern = /^[A-Za-z0-9]+$/;
  if (!pattern.test(value)) {
    return Promise.reject('用户名只能包含数字和字母');
  } else {
    return Promise.resolve();
  }
}

function validateName(rule, value) {
  // 使用正则表达式验证姓名是否只包含汉字
  const pattern = /^[\u4e00-\u9fa5]+$/;
  if (!pattern.test(value)) {
    return Promise.reject('姓名只能包含汉字');
  } else {
    return Promise.resolve();
  }
}

function validateInput(rule, value) {
  // 使用正则表达式验证输入是否只包含数字
  const pattern = /^[0-9]+$/;
  if (!pattern.test(value)) {
    return Promise.reject('输入只能包含数字');
  } else {
    return Promise.resolve();
  }
}

const ruleFormRef = ref()
const rules = reactive({
  name: [
    {required: true, message: '请输入学员姓名', trigger: 'blur'},
    {min: 2, max: 10, message: '姓名长度应为2-10', trigger: 'blur'},
    {validator: validateName, trigger: 'blur'}
  ],
  stuId: [
    {required: true, message: '请输入学号', trigger: 'blur'},
    {min: 10, max: 10, message: '学号应为10位', trigger: 'blur'},
    {validator: validateId, trigger: 'blur'}
  ],
  gender: [
    {required: true, message: '请选择性别', trigger: 'change'},
  ],
  telephone: [
    {required: true, message: '请输入手机号', trigger: 'blue'},
    {min: 11, max: 11, message: '手机号非法，应为11位', trigger: 'blur'},
    {validator: validateInput, trigger: 'blur'}
  ],
  classId: [
    {required: true, message: '请选择所属班级', trigger: 'change'},
  ],
})
// 日期格式化显示
const dateFormatter = (row) => {
  const updateTime = row.updateTime;
  const date = moment(updateTime);
  return date.format("YYYY-MM-DD HH:mm:ss");
}
// 翻页器变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(1);
// 选项变量们
let genderOptions = [
  {
    label: "男",
    value: 1,
  },
  {
    label: "女",
    value: 2,
  }
];
let genderMap = {
  1: "男",
  2: "女"
};
let educationOptions = [
  {
    label: "初中",
    value: 1,
  },
  {
    label: "高中",
    value: 2,
  },
  {
    label: "大专",
    value: 3,
  },
  {
    label: "本科",
    value: 4,
  },
  {
    label: "硕士",
    value: 5,
  },
  {
    label: "博士",
    value: 6,
  },
];
// 学员违纪处理部分
const indisciplineDialogVisible = ref(false);
const points = ref(0);
const points_id = ref(null);

function handlePoints() {
  baseAxios({
    url: '/student/points',
    method: 'put',
    data: {
      id: points_id.value,
      points: points.value
    }
  }).then(res => {
    if (res.data.code) {
      ElMessage({
        message: "处理成功",
        type: "success"
      })
      indisciplineDialogVisible.value = false;
      getStudentList();
    }
  })
}

const handleChange = (value) => {
  if (!/^[0-9]*$/.test(value)) {
    ElMessage.error("请输入数字！");
    points.value = value.replace(/[^0-9]/g, '');
  } else {
    if (parseInt(value) > 100) {
      ElMessage.error("处分不能大于100！");
      points.value = "100";
    }
  }
}
// 班级下拉框选项
let classOptions = ref([]);
let classMap = {};

function getClassList() {
  baseAxios({
    url: '/class/all',
    method: 'get',
  }).then(res => {
    console.log(res.data);
    let temp_data = res.data.data;
    temp_data.forEach(x => {
      classOptions.value.push({
        label: x.name,
        value: x.id
      });
      classMap[x.id] = x.name;
    })
  }).catch(err => {
    console.log(err.message);
  })
  console.log(classMap);
  console.log(classOptions.value)
}

getClassList();
// 这里是查询表单部分
const formInline = reactive({
  name: "",
  stuId: "",
  education: null,
  classId: null,
})
// 这里是获取班级表格数据部分
const tableData = ref([]);

function getStudentList() {
  let params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    name: formInline.name,
    stuId: formInline.stuId,
    education: formInline.education,
    classId: formInline.classId
  }
  console.log(params);
  baseAxios({
    url: '/student',
    method: 'get',
    params
  }).then(res => {
    console.log(res.data);
    tableData.value = res.data.data.rows;
    tableData.value.forEach(x => {
      x.class = classMap[x.classId];
      x.genderName = genderMap[x.gender];

    });
    total.value = res.data.data.total;
  }).catch(err => {
    console.log(err.message);
  })
}

getStudentList();

// 批量删除框部分
const dialogBatchVisible = ref(false)
// 确认删除框部分
const dialogVisible = ref(false)


// 弹出框部分
// 用于标记dialog处于新增还是修改状态
const state = 0; //0表示新增，1表示修改
const dialogContent = ref("添加学员");
// 新增/修改表格内信息
// const form = reactive({
//     name: "张三",
//     stuId: "A220505001",
//     class: "2024第01期10班",
//     gender: "男",
//     telephone: "1880909xxx",
//     education: "本科",
//     indisciplineTime: 1,
//     indisciplinePoints: 5,
//     updateTime: "2022-08-01 12:00:00",
// })
const form = ref({});
// 设置弹出框是否可见以及内部输入框的width
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

// 对按钮的处理
async function handleSave(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      let method = '';
      if (dialogContent.value == "添加学员") {
        method = 'post';
      } else if (dialogContent.value == "编辑学员") {
        method = 'put';
      }
      console.log(form.value);
      baseAxios({
        url: "/student",
        method: method,
        data: form.value,
      }).then(res => {
        console.log(res.data);
        if (res.data.code) {
          dialogFormVisible.value = false;
          ElMessage({
            message: '保存成功！',
            type: 'success',
          })
          getStudentList();
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


const onSubmit = () => {
  console.log('submit!')
  getStudentList();
}

// 添加学员按钮
function handleAdd() {
  form.value = {
    name: "",
    stuId: "",
    class: null,
    gender: null,
    telephone: "",
    education: null,
  }
  dialogContent.value = "添加学员";
  dialogFormVisible.value = true;
}

// 批量删除按钮
function handleBatchDel() {
  dialogBatchVisible.value = true;
}

// 处理多选 用于批量删除
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}
const handleEdit = (index, row) => {
  console.log(index, row)
  baseAxios({
    url: "/student/" + row.id,
    method: 'get',
  }).then(res => {
    console.log(res.data);
    form.value = res.data.data;
  }).catch(err => {
    console.log(err.message);
  })
  dialogContent.value = "编辑学员";
  dialogFormVisible.value = true;
}
const temp_id = ref(0);
const handleDelete = (index, row) => {
  console.log(index, row)
  temp_id.value = row.id;
  dialogVisible.value = true;
}

function confirmDelete(type) {
  // type为0说明是单个，为1说明是多个。
  let ids = "";
  if (type) {
    multipleSelection.value.forEach(x => {
      console.log(x.id);
      if (ids == "") ids = x.id;
      else ids += "," + x.id;
    })
  } else {
    ids = temp_id.value;
  }
  baseAxios({
    url: "/student/" + ids,
    method: "delete",
  }).then(res => {
    console.log(res.data);
    if (res.data.code) {
      ElMessage({
        message: '删除成功！',
        type: 'success',
      })
      getStudentList();
      dialogVisible.value = false;
      dialogBatchVisible.value = false;
    }
  })
}

const handleIndiscipline = (index, row) => {
  console.log(index, row)
  points.value = 0;
  points_id.value = row.id;
  indisciplineDialogVisible.value = true;
}
// 翻页器
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  getStudentList();
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  getStudentList();
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


.foot-pagination {
  position: absolute;
  bottom: 5px;
  right: 10px;
}
</style>
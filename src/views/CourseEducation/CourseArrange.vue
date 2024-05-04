<template>
    <!-- 批量删除确认框 -->
    <el-dialog
        v-model="dialogBatchVisible"
        width="500"
    >
        <ContentHeader content="批量删除课程"></ContentHeader>
        <div class="info-message">您确定要批量删除这些信息吗 ? 如果删除,相应的课程也将删除。</div>
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
        <ContentHeader content="删除课程"></ContentHeader>
        <div class="info-message">您确定要删除该信息吗 ? 如果删除,相应的课程也将删除。</div>
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
        <ContentHeader content="编辑"></ContentHeader>
        <el-form :model="form" style="margin-top: 15px;" ref="ruleFormRef" :rules="rules">
            <el-form-item label="* 课程代码" :label-width="formLabelWidth">
                <el-input v-model="form.courseNo" placeholder="请输入课程代码" :disabled="true" style="width: 280px;"/>
            </el-form-item>
            <el-form-item label="* 课程名称" :label-width="formLabelWidth">
                <el-input v-model="form.courseName" placeholder="请输入课程名称" :disabled="true" style="width: 280px;"/>
            </el-form-item>
            <el-form-item label="授课教师" :label-width="formLabelWidth" >
                <el-select
                    v-model="form.teachersId"
                    filterable
                    clearable
                    multiple
                    placeholder="请选择"
                    style="width: 280px;"
                    @change="test()"
                >
                    <el-option
                    v-for="item in empOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
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
        <ContentHeader content="课程安排"></ContentHeader>

        <div class="query">
            <!-- 查询表单 -->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="课程名称">
                    <el-input v-model="formInline.name" placeholder="请输入课程名称" style="width: 150px;" clearable />
                </el-form-item>
                <el-form-item label="是否已安排授课教师">
                    <el-select
                    v-model="formInline.arranged"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width: 280px;"
                    >
                        <el-option
                        v-for="item in arrangedOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="授课教师">
                    <el-select
                    v-model="formInline.teacher"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width: 280px;"
                    >
                        <el-option
                        v-for="item in empOptions"
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
        <el-button type="primary" @click="handleBatchDel">- 批量删除</el-button>

        <div class="info-table">
            <!-- 表格 -->
            <el-table :data="tableData" style="width: 100%;height: calc(100vh - 300px);" :fit="true"  @selection-change="handleSelectionChange" >
                <el-table-column type="selection" width="55"  align="center"/>
                <el-table-column property="courseNo" label="课程代码" align="center"/>
                <el-table-column property="courseName" label="课程名称" align="center"/>
                <el-table-column property="teachers" label="授课教师"  align="center"/>
                <el-table-column label="操作"  align="center" width="250">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
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
import apiAxios from '@/api/ApiAxios.js';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import moment from 'moment';

// 翻页器变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(1);
// 选项变量们
let arrangedOptions = [
    {
        label: "是",
        value: 1,
    },
    {
        label: "否",
        value: 0,
    }
];
// 授课教师下拉框选项
let empOptions = ref([]);
let empMap = {};
function getEmpList(){
    apiAxios({
        url: '/emps/all',
        method: 'get',
    }).then(res => {
        console.log(res.data);
        let temp_data = res.data.data;
        temp_data.forEach(x => {
            empOptions.value.push({
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
// 课程违纪处理部分
const indisciplineDialogVisible = ref(false);
const points = ref(0);
const points_id = ref(null);

const handleChange = (value) => {
    if (!/^[0-9]*$/.test(value)) {
        ElMessage.error("请输入数字！");
        points.value = value.replace(/[^0-9]/g, '');
    }
}

// 这里是查询表单部分
const formInline = reactive({
    name: "",
    arranged: null,
    teacher: null,
})
// 这里是获取课程表格数据部分
const tableData = ref([]);
function getCourseList(){
    let params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        name: formInline.name,
        arranged: formInline.arranged,
        teacher: formInline.teacher
    }
    console.log(params);
    apiAxios({
        url: '/courseArrange',
        method: 'get',
        params
    }).then(res => {
        console.log(res.data);
        if(res.data.code){
            tableData.value = res.data.data.rows;
            tableData.value.forEach(x => {
                console.log(x.teacherIds);
                if(x.teacherIds != null){
                    x.teachersId = x.teacherIds.split(",").map(Number);
                    x.teachers = [];
                    x.teachersId.forEach(y => {
                        console.log(typeof(y));
                        x.teachers.push(empMap[y]);
                    })
                    console.log(x.teachers);
                } else {
                    x.teachers = [];
                }
            });
            total.value = res.data.data.total;
        } else {
            ElMessage.error(res.data.msg);
        }

    }).catch(err => {
        console.log(err.message);
    })
}
getCourseList();

// 批量删除框部分
const dialogBatchVisible = ref(false)
// 确认删除框部分
const dialogVisible = ref(false)


// 弹出框部分
    // 用于标记dialog处于新增还是修改状态
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
function test(){
    console.log(form.value.teachersId);
}
    // 设置弹出框是否可见以及内部输入框的width
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
    // 对按钮的处理
function handleSave(){
    console.log(form.value);
    apiAxios({
        url: "/courseArrange",
        method: 'post',
        data: {
            courseId: form.value.courseId,
            teachersId: form.value.teachersId
        }
    }).then(res => {
        console.log(res.data);
        if(res.data.code){
            dialogFormVisible.value = false;
            ElMessage({
                message: '保存成功！',
                type: 'success',
            })
            getCourseList();
        } else {
            ElMessage.error(res.data.msg);
        }
    }).catch(err => {
        console.log(err.message);
    })
}


const onSubmit = () => {
  console.log('submit!')
  getCourseList();
}

// 批量删除按钮
function handleBatchDel(){
    dialogBatchVisible.value = true;
}

    // 处理多选 用于批量删除
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}
const handleEdit = (index, row) => {
    console.log(index, row)
    form.value = row;
    dialogFormVisible.value = true;
}
const temp_id = ref(0);
const handleDelete = (index, row) => {
    console.log(index, row)
    temp_id.value = row.id;
    dialogVisible.value = true;
}
function confirmDelete(type){
    // type为0说明是单个，为1说明是多个。
    let ids = "";
    if(type){
        multipleSelection.value.forEach(x => {
            console.log(x.courseId);
            if(ids == "") ids = x.courseId;
            else ids += "," + x.courseId;
        })
    }else{
        ids = temp_id.value;
    }
    apiAxios({
        url: "/course/" + ids,
        method: "delete",
    }).then(res => {
        console.log(res.data);
        if(res.data.code){
            ElMessage({
                message: '删除成功！',
                type: 'success',
            })
            getCourseList();
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
  getCourseList();
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
    getCourseList();
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
import {createRouter, createWebHistory} from 'vue-router';
import SignUpView from '@/views/SignUpView.vue';
import HomePage from '@/views/HomePage.vue';
import ClassManage from '@/views/ClassMemberManage/ClassManage.vue';
import StudentManage from '@/views/ClassMemberManage/StudentManage.vue';
import DepartmentManage from '@/views/SystemInfoManage/DepartmentManage.vue';
import WorkersManage from '@/views/SystemInfoManage/WorkersManage.vue';
import EmpData from '@/views/DataStatistics/EmpData.vue';
import StudentData from '@/views/DataStatistics/StudentData.vue';
import CourseManage from '@/views/CourseEducation/CourseManage.vue';
import CourseArrange from '@/views/CourseEducation/CourseArrange.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: SignUpView
        },
        {
            path: '/homePage',
            name: 'homePage',
            component: HomePage,
            children: [
                {
                    path: '/classManage',
                    name: 'classManage',
                    component: ClassManage,
                },
                {
                    path: '/studentManage',
                    name: 'studentManage',
                    component: StudentManage,
                },
                {
                    path: '/departmentManage',
                    name: 'departmentManage',
                    component: DepartmentManage,
                },
                {
                    path: '/workersManage',
                    name: 'workersManage',
                    component: WorkersManage,
                },
                {
                    path: '/empData',
                    name: 'empData',
                    component: EmpData,
                },
                {
                    path: '/studentData',
                    name: 'studentData',
                    component: StudentData,
                },
                {
                    path: '/courseManage',
                    name: 'courseManage',
                    component: CourseManage,
                },
                {
                    path: '/courseArrange',
                    name: 'courseArrange',
                    component: CourseArrange,
                }
            ]
        },
    ]
})

export default router

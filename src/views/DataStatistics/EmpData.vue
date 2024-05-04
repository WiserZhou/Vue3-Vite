<template>
    <div class="emp-data-wrapper">
        <div id="genderCount" ></div>
        <div id="jobCount"></div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import baseAxios from '@/api/baseAxios';
import { onMounted, ref } from 'vue';
let echart = echarts;
// 初始化genderchart
async function initGenderChart() {
    let label = [];
    let data = [];
    try{
        const res = await baseAxios({
            url: "/emps/genderCount",
            method: 'get'
        })
        for(let key in res.data.data){
            console.log(key);
            label.push(key);
            data.push({
                value: res.data.data[key],
                name: key
            })
        }
    } catch (err){
        console.log(err);
    }

    let genderChart = echart.init(document.getElementById("genderCount"));
    let option = {
        title: {
            text: '员工性别统计',
            x: 'center',
            textStyle: {
                fontSize: 30
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            x: 'center',
            top: 50,
            data: label
        },
        series: [
            {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            labelLine: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold',
                }
            },
            data: data
            }
        ]
    };
    genderChart.setOption(option);
    window.onresize = function() {
        genderChart.resize();
    };
}
// 初始化jobcount
async function initJobChart() {
    let label = [];
    let data = [];
    try{
        const res = await baseAxios({
            url: "/emps/jobCount",
            method: 'get'
        })
        for(let key in res.data.data){
            label.push(key);
            data.push( res.data.data[key]);
        }
    } catch (err){
        console.log(err);
    }
    let jobChart = echart.init(document.getElementById("jobCount"));
    let option = {
        title: {
            text: '员工职位统计',
            x: 'center',
            textStyle: {
                fontSize: 30
            }
        },
        tooltip: {
            trigger: 'item'
        },
        // label:{
        //     show: true,
        //     position: 'top',
        // },
        xAxis: {
            data: label,
        },
        yAxis: {},
        series: [
            {
            type: 'bar',
            data: data
            }
        ]
    };
    jobChart.setOption(option);
    window.onresize = function() {
        jobChart.resize();
    };
}
onMounted(() => {

    initGenderChart();
    initJobChart();
})
</script>

<style scoped>
.emp-data-wrapper{
    display: flex;
    margin-top: 3rem;
}
#genderCount {
    width: 600px;
    height: 600px;
}
#jobCount {
    width: 800px;
    height: 600px;
}
</style>
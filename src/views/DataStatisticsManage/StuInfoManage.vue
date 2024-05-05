<template>
    <div class="emp-data-wrapper">
        <div id="genderCount" ></div>
        <div id="educationCount"></div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import apiAxios from '@/api/ApiAxios.js';
import { onMounted, ref } from 'vue';
let echart = echarts;
// 初始化genderchart
async function initGenderChart() {
    let label = [];
    let data = [];
    try{
        const res = await apiAxios({
            url: "/student/genderCount",
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
            text: '学员性别统计',
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
// 初始化educationcount
async function initeducationChart() {
    let label = [];
    let data = [];
    try{
        const res = await apiAxios({
            url: "/student/educationCount",
            method: 'get'
        })
        for(let key in res.data.data){
            label.push(key);
            data.push( res.data.data[key]);
        }
    } catch (err){
        console.log(err);
    }
    let educationChart = echart.init(document.getElementById("educationCount"));
    let option = {
        title: {
            text: '学员最高学历统计',
            x: 'center',
            textStyle: {
                fontSize: 30
            }
        },
        tooltip: {
            trigger: 'item'
        },
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
    educationChart.setOption(option);
    window.onresize = function() {
        educationChart.resize();
    };
}
onMounted(() => {

    initGenderChart();
    initeducationChart();
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
#educationCount {
    width: 800px;
    height: 600px;
}
</style>
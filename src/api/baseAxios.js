import axios from 'axios';
import { useRouter } from 'vue-router';
export default function baseAxios(axiosConfig) {
    const router = useRouter();
    const service = axios.create({
        baseURL: 'http://127.0.0.1:8080',
        timeout: 10000,
    });
    // 请求拦截器
    service.interceptors.request.use(
        (config) => {
            // 在请求发送之前做一些处理
            // 从本地存储或其他地方获取 JWT 令牌
            const token = localStorage.getItem('token');

            // 如果存在 JWT 令牌，则将其添加到请求头中
            if (token) {
                config.headers['token'] = token;
            }

            return config;
        },
        (error) => {
            // 对请求错误做些什么
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    service.interceptors.response.use(
        (response) => {
            // 在响应数据之前做一些处理
            console.log(response);
            if (response.status && response.data && response.data.code === 0 && response.data.msg === "NOT_LOGIN") {
                // 如果返回的状态码为 0，并且消息为 "NOT_LOGIN"，表示未登录或登录状态失效，进行重定向到登录页面
                router.push("/"); 
            }
            return response;
        },
        (error) => {
            // 对响应错误做些什么

            return Promise.reject(error);
        }
    );

    return service(axiosConfig);
}
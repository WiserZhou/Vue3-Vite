import axios from 'axios';
import {useRouter} from 'vue-router';

export default function apiAxios(axiosConfig) {
    const router = useRouter();
    const service = axios.create({
        baseURL: 'http://127.0.0.1:8080',
        timeout: 10000,
    });
    service.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['token'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    service.interceptors.response.use(
        (response) => {
            console.log(response);
            if (response.status && response.data && response.data.code === 0 && response.data.msg === "NOT_LOGIN") {
                router.push("/");
            }
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return service(axiosConfig);
}
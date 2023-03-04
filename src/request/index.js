import axios from "axios"
// import store from "@/store"
import Toast from "../utils/Toast";
import { useUserStore } from "../store/user";

const creditApi = axios.create({
    // baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_REQUEST_URL : process.env.VUE_APP_BASE_API, // baseURL这里单词要特别注意一下
    baseURL: "/api",
    // baseURL: "/addscore",
    timeout: 20000,
    // timeout: 10000,
});
// 调用接口的拦截器进行一些处理
creditApi.interceptors.request.use(config => {
    const { token } = useUserStore()
    if (token) {
        config.headers["Authorization"] = token
    }
    return config
})
//获取后端给我们的数据做一个响应后拦截操作
creditApi.interceptors.response.use(res => {
    console.log(res);
    if (res.status == 200) {
        const { code } = res.data
        if (code == 200) {
            return res.data.data
        } else if (code == 300) {
            Toast("warning", res.data.msg);
            return Promise.reject(res)
        } else {
            console.log(res.data.code);
            Toast("error", res.data.msg);
            return Promise.reject(res)
        }
    } else {
        Toast("error", "网络错误");
        return Promise.reject({ data: { msg: "网络错误" } })
    }
})
export { creditApi }   

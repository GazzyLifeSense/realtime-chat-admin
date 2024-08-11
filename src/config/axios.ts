import axios from 'axios'
import NProgress from './nprogress';
import { ElMessage, ElNotification } from 'element-plus';

const service = axios.create()
// request拦截器设置
service.interceptors.request.use(
    (config) => {
      // 开启进度条
      NProgress.start();
      return config
    },
    (error) =>{
      ElMessage.error("请检查网络~")
      Promise.reject(error)
    }
  )
// response拦截器
service.interceptors.response.use(
    (response) =>{
        // 关闭进度条
        NProgress.done()
        return response.data;
    },
    (error) => {
        ElMessage.error("请检查网络~")
        Promise.reject(error)
    }
)

export default service
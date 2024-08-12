import axios from 'axios'
import NProgress from './nprogress';
import { ElMessage } from 'element-plus';
import { GlobalStore } from '@/stores';

const service = axios.create()
// request拦截器设置
service.interceptors.request.use(
    (config: any) => {
      // 开启进度条
      const globalStore = GlobalStore()

      // 预览账号功能限制
      if(globalStore.token != 'admin' && config.method == 'post') {
        ElMessage.error({ message: '预览账号不支持发起POST请求~'})
        return false
      }

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
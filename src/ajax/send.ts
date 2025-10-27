// src/assets/ajax/send.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { userToken } from '@/assets/store/userToken';
import { adminToken } from '@/assets/store/adminToken';
import D from "@/assets/ts/newMessageDialog";
import router from '@/router' // 根据实际路径调整

// 检测是否为移动设备
const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
// 根据设备类型设置 baseURL
const getBaseURL = (): string => {
  if (isMobile()) {
    // 移动端 baseURL
    return 'http://100.82.84.45:8081/';
  } else {
    // PC端 baseURL
    return 'http://localhost:8081/';
  }
};
// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 处理 token 和其他通用配置
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 添加认证 token
    const token:string | null = userToken().token;
    const tokenName:string = userToken().tokenName;


    if (token && config.headers) {
      //这里配置token
     // config.headers['Authorization'] = `Bearer ${token}`;
      config.headers[tokenName] = token;
    }

    //添加管理员token
    const admin_Token:string | null = adminToken().token;
    const adminTokenName:string = adminToken().tokenName;

    if (admin_Token && config.headers) {
      //这里配置token
     // config.headers['Authorization'] = `Bearer ${token}`;
      config.headers[adminTokenName] = admin_Token;
    }


    // 2. 添加其他通用请求头
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Accept'] = 'application/json';

    // 3. 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理响应和错误
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;

    if(!data) return D.error('服务器返回数据格式异常');
    // 根据后端约定的响应结构处理
    if (data.code === 200) {
      return data.data; // 返回实际数据
    } else {
      //特殊token错误处理 500，401错误处理
      if(data.code === 500){
        D.error('用户登录已过期，请重新登录');
        //后端错误处理
        if(data.msg.includes('admin')){
          adminToken().clearToken();
          //跳转登录页面
          router.push({path: '/admin/loging'});
        }

        if(data.msg.includes('user')){
          userToken().clearToken();
          //跳转登录页面
          router.push({path: '/loging'});
        }

      }
      return Promise.reject(new Error(data.msg || '请求失败'));
    }
  },
  (error) => {
    const { response } = error;
    // 处理 HTTP 错误状态码
    if (response) {
      switch (response.status) {
        case 401:
          // 未授权，清除 token 并跳转登录
          localStorage.removeItem('access_token');
          sessionStorage.removeItem('access_token');
          // 可以在这里添加路由跳转逻辑
          console.warn('登录已过期，请重新登录');
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`连接错误: ${response.status}`);
      }
    } else {
      // 网络错误
      console.error('网络连接异常');
    }
    return Promise.reject(error);
  }
);

// 封装常用的请求方法
export const http = {
  get<T>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, { params, ...config });
  },
  // 修改 post 方法定义
  post<T = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config);
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config);
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config);
  },

  // 文件上传
  upload<T>(url: string, formData: FormData): Promise<T> {
    return request.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // 下载文件
  download(url: string, filename: string): void {
    request({
      url,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }
};

export default request;

// // GET 请求
// http.get('/users', { page: 1, size: 10 });

// // POST 请求
// http.post('/users', { name: 'John', email: 'john@example.com' });

// // PUT 请求
// http.put('/users/1', { name: 'John Updated' });

// // DELETE 请求
// http.delete('/users/1');

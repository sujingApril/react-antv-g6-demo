import axios, { AxiosRequestConfig } from 'axios';

export const getHeaders: any = () => {
  // const { getItem } = localStorage;
  // TODO: 对应项目实际header配置
  return {
    // 'sc-id': `web-${uuidv4()}`,
    'scf-source': 'AHHX_WEB',
    'Cache-Control': 'no-cache',
    'saas-source': 'SAAS_ADMIN',
    'x-forwarded-host': '127.0.0.1',
    'saas-token': '1'
  };
};

/**
 * 类文件对象转json
 * @param blob Blob 类文件对象
 * @returns 
 */
const blobToJson = (blob: Blob): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        resolve(jsonData);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsText(blob);
  });
};


const request = axios.create({});

/**
 * 请求拦截功能配置
 * 1. 统一添加请求头headers
 */
request.interceptors.request.use(
  (config) => {
    config.headers = { ...getHeaders(), ...config.headers };
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error);
    Promise.reject(error);
    return;
  },
);

/** 
  * 相应拦截功能配置
  * 1. 统一处理后端报错码code
  * 2. 统一处理特殊的状态码，如用户未登录/登陆过期
  * 3. 统一出http状态码异常情况
  * 4. 返回后端data数据
  */
request.interceptors.response.use(
  async (response) => {
    let res = response.data || {};
    //  1. 二进制流文件无须处理，直接返回
    if (res instanceof Blob) {
      if (res.type === 'application/json') {
        // 尝试将json转换，如果json存在code，message则认为这是后端的报错信息，否则认为下载的是json文件
        const json = await blobToJson(res);
        if (!(json.code && json.message)) {
          return response;
        }
        res = json;
      } else {
        return response;
      }
    }
    // 2. 仅返回成功的数据
    return res.data;
  },
  async (error) => {
    const { response } = error;
    let data = response.data || {};
    if (response?.status === 401) {
      //登陆过期
    }
    // 2. 处理文件流
    if (data instanceof Blob && data.type?.includes('application/json')) {
      const json = await blobToJson(data);
      console.log(json.message);
      return Promise.reject(error);
    }
    // 3. 处理http状态码非200情况 
    console.log(error?.response?.data?.message || String(error.message) || '网络异常，请稍后再试');
    return Promise.reject(error);
  },
);

export interface Request {
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>;
  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
  delete<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
  head<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
  options<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
  post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  postForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  putForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  patchForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
}

export default request as Request;

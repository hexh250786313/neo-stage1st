import { error } from '@/atoms/error';
import { loading } from '@/atoms/loading';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as apiModule from '../mock-api';
// 配置是否使用本地API
// const useLocalApi = process.env.USE_LOCAL_API !== 'false'; // 默认使用本地API
const useLocalApi = true;
const withLoadingAndError = async <T>(apiCall: () => Promise<T>, config?: AxiosRequestConfig): Promise<T> => {
    try {
        if (config?.silent === false) {
            loading.show();
            error.hide();
        }
        const result = await apiCall();
        if (!config?.silent) {
            loading.hide();
            // 检查请求是否成功
            if (!(result as any)?.success) {
                error.show(new Error((result as any)?.message || '请求失败'));
            }
        }
        return result;
    } catch (err) {
        if (err instanceof AxiosError && err.config?.silent === false) {
            loading.hide();
            error.show(err);
        }
        throw error;
    }
};
// 直接在 AxiosRequestConfig 上扩展 silent 属性
declare module 'axios' {
    interface AxiosRequestConfig {
        silent?: boolean | 'auto';
        useCache?: boolean;
        requireAuth?: boolean;
    }
}
const request = axios.create({
    // baseURL: 'https://neo-stage1st.hexh.xyz/api',
    baseURL: 'https://neo-stage1st-api.hexh.shop',
    // baseURL: 'http://192.168.10.160:3001',
});
request.interceptors.request.use(
    (config) => {
        // 默认不展示 loading
        if (config.silent === false) {
            loading.show();
            error.hide();
        }
        return config;
    },
    (err) => {
        // 默认不展示 loading
        if (err.config?.silent === false) {
            loading.hide();
            error.show(err);
        }
        return Promise.reject(error);
    },
);
request.interceptors.response.use(
    (response) => {
        if (!response.config.silent) {
            loading.hide();
            if (!response.data.success) {
                error.show(new Error(response.data.message || '请求失败'));
            }
        }
        return response.data;
    },
    (err) => {
        if (!err.config?.silent) {
            loading.hide();
            if (err?.response?.data?.message) {
                error.show(new Error(err.response.data.message));
            } else {
                error.show(err);
            }
        }
        return Promise.reject(err);
    },
);
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Array<JsonValue>;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
    [key: string]: JsonValue;
}
export type GetParams = JsonObject | undefined;
export type DeleteParams = JsonObject | undefined;
export type PostParams = JsonValue;
export type PutParams = JsonValue;
// 定义API响应的通用类型
export interface RequestResponse<T = JsonValue> {
    code: number;
    success: boolean;
    data: T;
    message?: string;
}
export const get = <T = JsonValue>(url: string, params?: GetParams, config?: AxiosRequestConfig) => {
    if (useLocalApi) {
        return withLoadingAndError<RequestResponse<T>>(
            () => apiModule.handleRequest('get', url, params, config),
            config,
        );
    }
    return request.get<JsonValue, RequestResponse<T>>(url, { ...config, params });
};
export const post = <T = JsonValue>(url: string, data?: PostParams, config?: AxiosRequestConfig) => {
    if (useLocalApi) {
        return withLoadingAndError<RequestResponse<T>>(
            () => apiModule.handleRequest('post', url, data, config),
            config,
        );
    }
    return request.post<JsonValue, RequestResponse<T>>(url, data, config);
};
export const put = <T = JsonValue>(url: string, data?: PutParams, config?: AxiosRequestConfig) => {
    if (useLocalApi) {
        return withLoadingAndError<RequestResponse<T>>(() => apiModule.handleRequest('put', url, data, config), config);
    }
    return request.put<JsonValue, RequestResponse<T>>(url, data, config);
};
export const del = <T = JsonValue>(url: string, params?: DeleteParams, config?: AxiosRequestConfig) => {
    if (useLocalApi) {
        return withLoadingAndError<RequestResponse<T>>(
            () => apiModule.handleRequest('delete', url, params, config),
            config,
        );
    }
    return request.delete<JsonValue, RequestResponse<T>>(url, { ...config, params });
};

export default request;

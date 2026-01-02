import {
    del,
    DeleteParams,
    get,
    GetParams,
    JsonValue,
    post,
    PostParams,
    put,
    PutParams,
    RequestResponse,
} from '@/services/request';
import { AxiosRequestConfig } from 'axios';
import { atom } from 'jotai';
import { getDefaultStore } from 'jotai/vanilla';
import objectHash from 'object-hash';
import { hasValidAuthToken } from '../auth';
import { navigateToLogin } from '../navigation';
import { isRequestSuccess } from './isRequestSuccess';
// 缓存结构定义
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiry: number;
}
// 创建缓存原子
const apiCacheMapAtom = atom<Map<string, CacheEntry<unknown>>>(new Map());
// 获取缓存的键
export function createCacheKey(path: string, method: string, params?: unknown): string {
    const key = `${path}:${method}`;
    if (params === undefined || params === null) {
        return key;
    }
    // 使用object-hash
    const paramsHash = objectHash(params, {
        algorithm: 'md5',
        encoding: 'hex',
        unorderedObjects: true,
        unorderedArrays: false,
    });
    return `${key}:${paramsHash}`;
}
// 为不同HTTP方法定义参数类型映射
interface MethodParamsMap {
    get: GetParams;
    post: PostParams;
    put: PutParams;
    delete: DeleteParams;
}
// 请求方法映射
const requestMethods = {
    get,
    post,
    put,
    delete: del,
};
// 使用函数重载定义不同HTTP方法的类型，添加Required参数控制params是否必填
export function createApiRequest<
    P extends MethodParamsMap['get'] = MethodParamsMap['get'],
    Required extends boolean = true,
>(
    path: string,
    method: 'get',
    config?: {
        cacheTime?: number;
        requireAuth?: boolean;
    },
): <ResponseData = JsonValue>(
    ...args: Required extends true ? [P, (AxiosRequestConfig | undefined)?] : [P?, (AxiosRequestConfig | undefined)?]
) => Promise<RequestResponse<ResponseData>>;
export function createApiRequest<
    P extends MethodParamsMap['post'] = MethodParamsMap['post'],
    Required extends boolean = true,
>(
    path: string,
    method: 'post',
    config?: {
        cacheTime?: number;
        requireAuth?: boolean;
    },
): <ResponseData = JsonValue>(
    ...args: Required extends true ? [P, (AxiosRequestConfig | undefined)?] : [P?, (AxiosRequestConfig | undefined)?]
) => Promise<RequestResponse<ResponseData>>;
export function createApiRequest<
    P extends MethodParamsMap['put'] = MethodParamsMap['put'],
    Required extends boolean = true,
>(
    path: string,
    method: 'put',
    config?: {
        cacheTime?: number;
        requireAuth?: boolean;
    },
): <ResponseData = JsonValue>(
    ...args: Required extends true ? [P, (AxiosRequestConfig | undefined)?] : [P?, (AxiosRequestConfig | undefined)?]
) => Promise<RequestResponse<ResponseData>>;
export function createApiRequest<
    P extends MethodParamsMap['delete'] = MethodParamsMap['delete'],
    Required extends boolean = true,
>(
    path: string,
    method: 'delete',
    config?: {
        cacheTime?: number;
        requireAuth?: boolean;
    },
): <ResponseData = JsonValue>(
    ...args: Required extends true ? [P, (AxiosRequestConfig | undefined)?] : [P?, (AxiosRequestConfig | undefined)?]
) => Promise<RequestResponse<ResponseData>>;
// 实际实现
export function createApiRequest<
    P = JsonValue,
    // @ts-expect-error: 不使用变量，只用来做类型推导
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Required extends boolean = true,
    M extends keyof MethodParamsMap = keyof MethodParamsMap,
>(
    path: string,
    method: M,
    config?: {
        cacheTime?: number;
        requireAuth?: boolean;
    },
) {
    const { cacheTime = 60000, requireAuth } = config || {};
    const requestMethod = requestMethods[method];
    return async <ResponseData = JsonValue>(
        params?: P,
        options?: AxiosRequestConfig,
    ): Promise<RequestResponse<ResponseData>> => {
        const { isTokenValid, auth, saltkey, uid } = hasValidAuthToken();
        if (!isTokenValid && requireAuth === true) {
            navigateToLogin();
            return undefined as any;
        }
        const store = getDefaultStore();
        const cacheMap = store.get(apiCacheMapAtom);
        const cacheKey = createCacheKey(path, method, params);
        let cache = cacheMap.get(cacheKey);
        // 获取过期时间
        const expiry = cache?.expiry || 0;
        // 如果未过期且允许使用缓存，直接返回缓存数据
        if (cache) {
            if (Date.now() > expiry) {
                cache = undefined;
            } else if (options?.useCache) {
                return cache.data as RequestResponse<ResponseData>;
            }
        }
        const response = await requestMethod<ResponseData>(path, params as any, {
            ...options,

            silent: options?.silent === 'auto' ? !!cache : options?.silent,
            headers: {
                ...options?.headers,
                // 自动把 auth 和 saltkey 和 uid 插入到请求头
                ...(isTokenValid
                    ? {
                          auth,
                          saltkey,
                          uid,
                      }
                    : {}),
            },
        });
        if (isRequestSuccess(response)) {
            const newCacheMap = new Map(cacheMap); // 创建新Map以保持不可变性
            newCacheMap.set(cacheKey, {
                data: response,
                timestamp: Date.now(),
                expiry: Date.now() + cacheTime,
            });
            store.set(apiCacheMapAtom, newCacheMap);
        }

        // 延迟 10ms 返回，使用微任务，不使用 setTimeout
        return response;
    };
}

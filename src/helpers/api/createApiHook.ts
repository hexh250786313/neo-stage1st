import { RequestResponse } from '@/services/request';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isRequestSuccess } from './isRequestSuccess';

const SUCCESS = 200;
interface InternalOptions {
    forceRefresh?: boolean;
}
// 提取API函数参数和返回值类型的辅助类型
// type ApiFunction = (...args: any[]) => Promise<any>;
type ApiFunction = (params?: any, options?: AxiosRequestConfig) => Promise<any>;
type ParamsType<T extends ApiFunction> = Parameters<T>; // 提取所有参数类型
type ResponseType<T extends ApiFunction> = Awaited<ReturnType<T>> extends RequestResponse<infer D> ? D : never;
type ApiResponse<T extends ApiFunction> = Awaited<ReturnType<T>>;
// 创建一个工具类型，将字符串首字母小写但保留其余部分大小写
type CamelCase<S extends string> = S extends `${infer F}${infer R}` ? `${Lowercase<F>}${R}` : S;
// 使用映射类型定义Hook返回结果
export type ApiHookResult<T extends ApiFunction, N extends string> = {
    [K in `fetch${Capitalize<N>}`]: (...args: ParamsType<T>) => Promise<ApiResponse<T> | undefined>;
} & {
    [K in CamelCase<N>]: ResponseType<T> | undefined;
} & {
    [K in `${CamelCase<N>}ResponseRef`]: React.RefObject<Awaited<ReturnType<T>> | undefined>;
} & {
    [K in `${CamelCase<N>}ResponseCode`]: number | undefined;
} & {
    [K in `${CamelCase<N>}Loading`]: boolean;
};
/**
 * 创建API请求Hook的工厂函数
 * @param apiFunction API请求函数
 * @param resourceName 资源名称
 * @param debounceMs 防抖延迟时间(毫秒)，默认为0(不防抖)
 */
export function createApiHook<T extends ApiFunction, N extends string>(
    apiFunction: T,
    resourceName: N,
    debounceMs: number = 0,
) {
    type Result = ApiHookResult<T, N>;
    type Data = ResponseType<T>;
    type Response = ApiResponse<T>;
    // 不再将资源名完全转小写，而是保留原始形式
    const capitalizedName = (resourceName.charAt(0).toUpperCase() + resourceName.slice(1)) as Capitalize<N>;
    // 仅将首字母转小写，保留其他大小写
    const camelCaseName = (resourceName.charAt(0).toLowerCase() + resourceName.slice(1)) as CamelCase<N>;
    return function useApi(): Result {
        const [data, setData] = useState<Data>();
        const [responseCode, setResponseCode] = useState<number>();
        const [loading, setLoading] = useState(false);
        const [refreshing, setRefreshing] = useState(false);
        const responseRef = useRef<Response>();
        const requestCounterRef = useRef<number>(0);
        const timerRef = useRef<NodeJS.Timeout | null>(null);
        useEffect(() => {
            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        }, []);
        // 使用展开运算符接收任意数量的参数
        const fetch = useCallback((...args: ParamsType<T>) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            const internalFetch = (
                fetchArgs: ParamsType<T>,
                internalOptions?: InternalOptions,
            ): Promise<Response | undefined> => {
                return new Promise<Response | undefined>((resolve, reject) => {
                    const executeRequest = () => {
                        const currentRequestId = ++requestCounterRef.current;
                        const requestArgs = [...fetchArgs] as ParamsType<T>;
                        // 第二个参数是 AxiosRequestConfig
                        const rawUseCache = requestArgs?.[1]?.useCache;
                        const rawSilent = requestArgs?.[1]?.silent;
                        const forceRefresh = internalOptions?.forceRefresh;
                        let useCache = rawUseCache;
                        if (useCache === undefined) {
                            if (forceRefresh) {
                                useCache = false;
                            } else {
                                useCache = true;
                            }
                        }
                        let silent: AxiosRequestConfig['silent'] = rawSilent;
                        if (silent === undefined) {
                            silent = 'auto';
                        }
                        const secondArg = {
                            ...requestArgs?.[1],
                            // 如果不是强制刷新的话，则给第二个入参传入 useCache: true
                            useCache,
                            silent,
                        };
                        requestArgs[1] = secondArg;
                        if (forceRefresh) {
                            setRefreshing(true);
                        }
                        const start = Date.now();
                        apiFunction(...requestArgs)
                            .then((res) => {
                                const end = Date.now();
                                if (currentRequestId === requestCounterRef.current) {
                                    responseRef.current = res;
                                    setLoading(false);
                                    setRefreshing(false);
                                    if (isRequestSuccess(res)) {
                                        setResponseCode(res?.code);
                                        if (res?.code === SUCCESS) {
                                            setData(res?.data);
                                        }
                                    }
                                    resolve(res);
                                }
                                // 不 resolve，悬挂 promise，防止竞态发生的时候旧请求的 promise 返回了一个错误的值导致业务逻辑错误
                                // 缺点是会导致内存增多
                                // else {
                                //     resolve(undefined);
                                // }

                                // 如果响应速度太快，可以认为是使用了缓存，这时候直接重新发起一次强制不使用缓存的请求
                                if (end - start < 10 && !forceRefresh) {
                                    internalFetch(fetchArgs, { forceRefresh: true });
                                }
                            })
                            .catch((error) => {
                                if (currentRequestId === requestCounterRef.current) {
                                    setLoading(false);
                                    setRefreshing(false);
                                    console.error(`Error fetching ${resourceName}:`, error);
                                    reject(error);
                                } else {
                                    // 非当前请求的错误可以忽略，不 resolve，，悬挂这个 promise，理由和上述一样
                                    // resolve(undefined);
                                }
                            });
                    };
                    if (debounceMs > 0) {
                        timerRef.current = setTimeout(executeRequest, debounceMs);
                    } else {
                        executeRequest();
                    }
                });
            };
            setLoading(true);
            return internalFetch(args);
        }, []);
        // 构建结果对象
        return {
            [`fetch${capitalizedName}`]: fetch,
            [camelCaseName]: data,
            [`${camelCaseName}ResponseRef`]: responseRef,
            [`${camelCaseName}ResponseCode`]: responseCode,
            [`${camelCaseName}Loading`]: loading,
            [`${camelCaseName}Refreshing`]: refreshing,
        } as unknown as Result;
    };
}

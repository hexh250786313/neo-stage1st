import { RequestResponse } from '../services/request';
import { routes } from './routes';

function matchRoute(method: string, url: string) {
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    return routes.find((route) => route.method.toLowerCase() === method.toLowerCase() && route.path === normalizedUrl);
}

export async function handleRequest(
    method: string,
    url: string,
    params?: any,
    config?: any,
): Promise<RequestResponse<any>> {
    try {
        const matchedRoute = matchRoute(method, url);
        if (!matchedRoute) {
            throw new Error(`未找到处理程序: ${method} ${url}`);
        }

        // 执行处理函数
        const data = await matchedRoute.handler(params as never, config);

        // 返回符合前端期望的格式
        return data;
    } catch (error) {
        console.error('API处理错误:', error);
        let message: string;

        if (error instanceof Error) {
            message = error.message;
        } else {
            message = String(error);
        }
        return {
            success: false,
            data: null,
            message: message,
            code: 500,
        };
    }
}

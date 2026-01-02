import { UserInfoResponse } from '@/requests/apis/getUserInfo';
import { RequestResponse } from '@/services/request';
import axios, { AxiosRequestConfig } from 'axios';
import { parseUserInfo } from '../parsers/userParser';

export async function handleUserRequest(
    _params: undefined,
    options?: AxiosRequestConfig,
): Promise<RequestResponse<UserInfoResponse>> {
    try {
        const saltkey = options?.headers?.saltkey;
        const auth = options?.headers?.auth;
        const uid = options?.headers?.uid;

        if (!saltkey || !auth || !uid) {
            return {
                code: 400,
                data: null as any,
                success: false,
                message: '缺少必要的请求头参数: auth 或 saltkey 或 uid',
            };
        }

        // 构建请求URL
        const url = `https://stage1st.com/2b/home.php?uid=${uid}&auth=${encodeURIComponent(auth as string)}&saltkey=${encodeURIComponent(saltkey as string)}`;

        // 发送请求获取HTML页面
        const response = await axios.get(url);
        const html = response.data;
        const userInfo = parseUserInfo(html, uid);

        // 返回处理后的响应数据
        return {
            code: 200,
            data: userInfo,
            success: true,
            message: '获取用户信息成功',
        };
    } catch (error) {
        console.error('获取用户信息请求错误:', error);
        let message: string;

        if (error instanceof Error) {
            message = error.message;
        } else {
            message = String(error);
        }

        return {
            code: 500,
            data: null as any,
            success: false,
            message: `获取用户信息失败: ${message || '未知错误'}`,
        };
    }
}

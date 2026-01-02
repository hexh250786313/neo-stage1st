import { LoginRequest, LoginResponse } from '@/requests/apis/login';
import { RequestResponse } from '@/services/request';
import { isInited } from '@/utils';
import axios from 'axios';
import qs from 'qs';

export async function handleLoginRequest(params: LoginRequest): Promise<RequestResponse<LoginResponse>> {
    try {
        if (!params.username || !params.password) {
            return {
                code: 400,
                data: null as any,
                success: false,
                message: '用户名和密码不能为空',
            };
        }

        // 表单数据编码
        const formData = qs.stringify({
            username: params.username,
            password: params.password,
        });

        // 发送登录请求到PHP页面而非API
        const response = await axios.post(
            'https://stage1st.com/2b/api/mobile/index.php?module=login&loginsubmit=yes',
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        // 解析和转换响应数据
        const responseData = response.data;
        if (!isInited(responseData?.Variables?.auth) || !isInited(responseData?.Variables?.auth)) {
            return {
                success: false,
                code: 500,
                data: null as any,
                message: responseData?.Message?.messageval,
            };
        }

        // 返回处理后的响应数据
        return {
            success: true,
            code: 200,
            data: responseData?.Variables,
            message: '登录成功',
        };
    } catch (error) {
        console.error('登录请求错误:', error);
        let message: string;

        if (error instanceof Error) {
            message = error.message;
        } else {
            message = String(error);
        }

        throw new Error(`登录失败: ${message || '未知错误'}`);
    }
}

import { handleUserRequest } from './handlers/getUser';
import { handleLoginRequest } from './handlers/login';

// 导入其他处理函数...
export const routes = [
    { method: 'get', path: '/user', handler: handleUserRequest },
    { method: 'post', path: '/login', handler: handleLoginRequest },
];

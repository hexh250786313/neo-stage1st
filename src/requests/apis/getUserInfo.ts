import { createApiRequest } from '@/helpers/api';

export type UserInfoResponse = {
    // 积分
    credits?: number;
    // 战斗力
    power?: number;
    // 节操
    prestige?: number;
    // RP
    rp?: number;
    // 死鱼
    fishCount?: number;
    username?: string;
    userGroup?: string;
    avatar?: string;
    signature?: string;
    uid?: string;
    customTitle?: string;
    onlineTime?: string;
    registerTime?: string;
    lastVisit?: string;
};
export const getUserInfo = createApiRequest<undefined, false>('/user', 'get', {
    cacheTime: 60 * 60 * 1000,
    requireAuth: true,
})<UserInfoResponse>;

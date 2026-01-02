import { createApiHook } from '@/helpers/api';
import { getUserInfo } from '../apis/getUserInfo';

const useUserInfo = createApiHook(getUserInfo, 'userInfo');
export default useUserInfo;

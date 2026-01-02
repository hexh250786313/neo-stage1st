import { createApiRequest } from '@/helpers/api';

export type LoginRequest = { password: string; username: string };
export type LoginResponse = {
    cookiepre?: string;
    auth: string;
    saltkey: string;
    member_uid: string;
    member_username?: string;
    member_avatar?: string;
    groupid?: string;
    formhash?: string;
    ismoderator?: null | boolean;
    readaccess?: string;
    notice?: {
        newpush?: string;
        newpm?: string;
        newprompt?: string;
        newmypost?: string;
    };
};

export const login = createApiRequest<LoginRequest>('/login', 'post')<LoginResponse>;

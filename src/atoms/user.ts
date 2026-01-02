import { UserInfoResponse } from '@/requests/apis/getUserInfo';
import { atom } from 'jotai';

export const userInfoAtom = atom<UserInfoResponse>();

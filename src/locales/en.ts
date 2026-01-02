import type { TranslationType } from './zh-CN';

export const en: TranslationType = {
    common: {
        processing: 'Processing...',
        brand: 'Stage 1st',
        loading: 'Loading...',
        requesting: 'Requesting...',
        error: 'Error occurred',
    },
    login: {
        title: 'Login',
        subTitle: 'Login with username and password',
        label1: 'Username',
        placeholder1: 'Please enter your username',
        label2: 'Password',

        placeholder2: 'Please enter your password',
        login: 'Login',
    },
    tabs: {
        home: 'Home',
        message: 'Messages',
        mine: 'Mine',
    },
    greeting: (params: { name: string }) => `Hello, ${params.name}`,
    items: (params: { count: number }) => `${params.count} items`,
    timeAgo: (params: { time: string; unit: string }) => `${params.time} ${params.unit} ago`,
    userStatus: (params: { name: string; status: string; count: number }) =>
        `User ${params.name} is currently ${params.status} with ${params.count} unread messages`,
};

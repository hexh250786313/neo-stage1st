import { UserInfoResponse } from '@/requests/apis/getUserInfo';
import { load } from 'cheerio';

export function parseUserInfo(html: string, uid: string): UserInfoResponse {
    // 使用Cheerio解析HTML
    const $ = load(html);

    // 提取用户信息
    const username = $('.name').text().trim();
    const avatar =
        $('style')
            .text()
            .match(/url\((.*?)\)/)?.[1] || '';

    // 提取用户组
    const userGroup = $('.myinfo_list ul li:contains("用户组") span').text().trim();

    // 修复问题2: 正确提取积分、战斗力等数据
    let credits = '0';
    let power = '0';
    let prestige = '0';
    let rp = '0';
    let fishCount = '0';

    $('.user_box ul li').each((_i, el) => {
        const text = $(el).text().trim();
        // 使用正则表达式分离数字和文本
        const matches = text.match(/^(\d+)\s*(.*?)$/);
        if (matches) {
            const [, value, key] = matches;
            if (key.includes('积分')) {
                credits = value;
            } else if (key.includes('鹅')) {
                power = value;
            } else if (key.includes('RP')) {
                rp = value;
            } else if (key.includes('斤')) {
                prestige = value;
            } else if (key.includes('条')) {
                fishCount = value;
            }
        }
    });

    // 提取个性签名
    const signature = $('.myinfo_list .sig').text().trim();

    // 修复问题3: 正确提取自定义头衔、在线时间等
    let customTitle = '';
    let onlineTime = '';
    let registerTime = '';
    let lastVisit = '';

    // 直接定位具体字段
    $('.myinfo_list:last ul li').each((_i, el) => {
        const text = $(el).text().trim();
        if (text.startsWith('自定义头衔')) {
            customTitle = $(el).find('span').text().trim();
        } else if (text.startsWith('在线时间')) {
            onlineTime = $(el).find('span').text().trim();
        } else if (text.startsWith('注册时间')) {
            registerTime = $(el).find('span').text().trim();
        } else if (text.startsWith('最后访问')) {
            lastVisit = $(el).find('span').text().trim();
        }
    });

    // 构建用户信息对象
    const userInfo: UserInfoResponse = {
        credits: credits ? parseInt(credits, 10) : 0,
        power: power ? parseInt(power, 10) : 0,
        prestige: prestige ? parseInt(prestige, 10) : 0,
        rp: rp ? parseInt(rp, 10) : 0,
        fishCount: fishCount ? parseInt(fishCount, 10) : 0,
        username,
        userGroup,
        avatar,
        signature,
        uid,
        customTitle,
        onlineTime,
        registerTime,
        lastVisit,
    };

    return userInfo;
}

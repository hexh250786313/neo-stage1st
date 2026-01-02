import Taro from '@tarojs/taro';

export class NavigationTracker {
    private static instance: NavigationTracker;
    private pageHistory: string[] = [];
    private lastPath: string | undefined;
    private penultimatePath: string | undefined;
    static getInstance(): NavigationTracker {
        if (!NavigationTracker.instance) {
            NavigationTracker.instance = new NavigationTracker();
        }
        return NavigationTracker.instance;
    }
    // 添加记录页面访问
    recordVisit(currentPage?: string) {
        if (!currentPage) {
            currentPage = Taro.getCurrentInstance().router?.path || '';
        }
        // 避免连续重复记录相同页面
        if (this.pageHistory.length === 0 || this.pageHistory[this.pageHistory.length - 1] !== currentPage) {
            this.pageHistory.push(currentPage);
        }
    }
    // 移除页面访问记录
    removeVisit() {
        if (this.pageHistory.length > 0) {
            this.lastPath = this.pageHistory.pop();
            this.penultimatePath =
                this.pageHistory.length > 0 ? this.pageHistory[this.pageHistory.length - 1] : undefined;
        }
    }
    // 检查是否是返回到当前页面的操作
    checkReturn(currentPage?: string): [boolean, string] {
        if (!currentPage) {
            currentPage = Taro.getCurrentInstance().router?.path || '';
        }
        if (!this.lastPath || !this.penultimatePath || currentPage !== this.penultimatePath) {
            return [false, ''];
        }
        return [true, this.lastPath];
    }
    // 检查是否是前进到当前页面的操作
    checkForward(currentPage?: string): [boolean, string] {
        if (!currentPage) {
            currentPage = Taro.getCurrentInstance().router?.path || '';
        }
        // 如果历史记录为空或只有一个页面，则不可能是前进操作

        if (this.pageHistory.length <= 1) {
            return [false, ''];
        }
        // 获取最后一个页面
        const lastPath = this.pageHistory[this.pageHistory.length - 1];
        if (lastPath !== currentPage) {
            return [false, ''];
        }
        // 倒数第二个页面是前进的来源页面
        const fromPath = this.pageHistory[this.pageHistory.length - 2];
        return [true, fromPath];
    }
}

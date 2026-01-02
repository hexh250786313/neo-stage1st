export function isRequestSuccess(res: { success?: unknown }) {
    return res?.success === true;
}

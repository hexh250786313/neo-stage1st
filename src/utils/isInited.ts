export function isInited<T>(value: T): value is Exclude<T, undefined> {
    return value !== undefined;
}

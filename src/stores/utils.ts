/* eslint-disable import/prefer-default-export */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export interface Observer<T = unknown> {
    update(data: T): void;
}
export declare class Subject<T = unknown> {
    private observers;
    addObserver(observer: Observer<T>): void;
    removeObserver(observer: Observer<T>): void;
    notify(data: T): void;
}
//# sourceMappingURL=Observer.d.ts.map
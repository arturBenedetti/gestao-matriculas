export class Subject {
    observers = [];
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter((o) => o !== observer);
    }
    notify(data) {
        for (const obs of this.observers) {
            obs.update(data);
        }
    }
}
//# sourceMappingURL=Observer.js.map
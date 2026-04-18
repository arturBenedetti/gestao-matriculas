export interface Observer<T = unknown> {
  update(data: T): void;
}

export class Subject<T = unknown> {
  private observers: Observer<T>[] = [];

  addObserver(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer<T>): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(data: T): void {
    for (const obs of this.observers) {
      obs.update(data);
    }
  }
}

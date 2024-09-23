export class EventListener<TData> {
    private readonly _callback: (data: TData) => void;

    public invoke = (data: TData) => this._callback(data);

    public constructor(callback: (data: TData) => void) {
        this._callback = callback;
    }
}

export class Event<TData> {
    private _listeners: WeakRef<EventListener<TData>>[] = [];

    public invoke(data: TData): void {
        this._listeners = this._listeners.filter(listener => listener.deref() !== undefined);

        this._listeners.forEach(listener => {
            listener.deref()?.invoke(data);
        })
    }

    public addListener(listener: EventListener<TData>): void {
        this._listeners.push(new WeakRef(listener));
    }
    public createListener(callback: (data: TData) => void): EventListener<TData> {
        let listener = new EventListener(callback);
        this.addListener(listener);
        return listener;
    }

    public removeListener(listener: EventListener<TData>): void {
        this._listeners = this._listeners.filter(l => l.deref() !== listener);
    }
}
export class EventListener<TData> {
    private readonly _callback: (data: TData) => void;

    readonly invokeOnce: boolean;

    public invoke = (data: TData) => this._callback(data);

    public constructor(callback: (data: TData) => void, invokeOnce: boolean) {
        this._callback = callback;
        this.invokeOnce = invokeOnce;
    }
}

export class Event<TData> {
    private _listeners: EventListener<TData>[] = [];

    public dispatch(data: TData): void {
        this._listeners.forEach(listener => {
            listener.invoke(data);
        })

        this._listeners = this._listeners.filter(listener => !listener.invokeOnce);
    }

    public addListener(listener: EventListener<TData>): void {
        this._listeners.push(listener);
    }
    public createListener(callback: (data: TData) => void, invokeOnce: boolean = false): EventListener<TData> {
        let listener = new EventListener(callback, invokeOnce);
        this.addListener(listener);
        return listener;
    }

    public removeListener(listener: EventListener<TData>): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }
}
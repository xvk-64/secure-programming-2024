export class EventListener<TData> {
    private readonly _callback: (data: TData) => Promise<void>;

    readonly invokeOnce: boolean;

    public invoke = (data: TData) => this._callback(data);

    public constructor(callback: (data: TData) => Promise<void>, invokeOnce: boolean) {
        this._callback = callback;
        this.invokeOnce = invokeOnce;
    }
}

export class EventEmitter<TData> {
    private _listeners: EventListener<TData>[] = [];

    public async dispatch(data: TData): Promise<void> {
        const promises = this._listeners.map(listener => listener.invoke(data));

        await Promise.all(promises);

        this._listeners = this._listeners.filter(listener => !listener.invokeOnce);
    }

    public addListener(listener: EventListener<TData>): void {
        this._listeners.push(listener);
    }
    public createAsyncListener(callback: (data: TData) => Promise<void>, invokeOnce: boolean = false): EventListener<TData> {
        let listener = new EventListener(callback, invokeOnce);
        this.addListener(listener);
        return listener;
    }
    public createListener(callback: (data: TData) => void | undefined, invokeOnce: boolean = false): EventListener<TData> {
        let listener = new EventListener((data: TData) => Promise.resolve(callback(data)), invokeOnce);
        this.addListener(listener);
        return listener;
    }

    public removeListener(listener: EventListener<TData>): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }
}
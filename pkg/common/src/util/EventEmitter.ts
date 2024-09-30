import {Mutex} from "async-mutex";

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
    protected _listeners: EventListener<TData>[] = [];

    private _dispatchBuffer: TData[] = [];
    private _mutex = new Mutex();

    public async dispatch(data: TData): Promise<void> {
        await this._mutex.runExclusive(async () => {
            const promises = this._listeners.map(listener => listener.invoke(data));

            await Promise.all(promises);

            this._listeners = this._listeners.filter(listener => !listener.invokeOnce);
        })
    }

    public addListener(listener: EventListener<TData>): void {
        this._listeners.push(listener);

        let front = this._dispatchBuffer.pop();
        while (front != undefined) {
            this.dispatch(front);
            front = this._dispatchBuffer.pop();
        }
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
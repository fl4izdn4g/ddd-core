export interface StoreTransformer {
    toStore<T, S>(obj: T): S;
    fromStore<S, T>(obj: S): T;
}
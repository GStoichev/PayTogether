export interface IReposotory<T,K> {
    read(): Promise<Array<T>>;
    readById(id: K): Promise<T>;
    create(entry: T): Promise<T>;
    update(entry: T): Promise<T>;
    delete(entry: T): Promise<T>;
}
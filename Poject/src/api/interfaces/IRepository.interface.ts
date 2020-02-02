export interface IReposotory<T,K> {
    read(): Promise<Array<T>>;
    readById(id: K): Promise<T>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(entity: T): Promise<T>;
}
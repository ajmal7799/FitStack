export interface IBaseRepository<T> {
    save(data: T): Promise<T>;
    

}

export interface IGenericRepository<T> {
    findAll(query?: any): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    findOne(query: any): Promise<T | null>;
  }
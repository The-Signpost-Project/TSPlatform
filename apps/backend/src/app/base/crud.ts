export abstract class CrudService<T> {
	protected abstract getById(id: string): Promise<T>;
	protected getAll?(): Promise<T[]>;
	// biome-ignore lint/suspicious/noExplicitAny: create can be implemented in any way necessary
	protected create?(...data: any): Promise<T>;
	protected abstract updateById(id: string, data: T): Promise<T>;
	protected abstract deleteById(id: string): Promise<void>;
}

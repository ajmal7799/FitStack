import { Model, Document } from 'mongoose';

export abstract class BaseRepository<TEntity, TModel extends Document> {
    constructor(
        protected _model: Model<TModel>,
        private mapper: any,
    ) { }

    async save(data: TEntity): Promise<TEntity> {
        const doc = this.mapper.toMongooseDocument(data);
        const saved = await this._model.create(doc);
        return this.mapper.fromMongooseDocument(saved);
    }

    async findById(_id: string): Promise<TEntity | null> {
        const found = await this._model.findById(_id);
        if (!found) return null;
        return this.mapper.fromMongooseDocument(found);
    }

}
import { Model } from "mongoose";
import { IGenericRepository } from "../interfaces/IGenericRepository";

export class GenericRepository<T> implements IGenericRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(query: any = {}): Promise<T[]> {
    try {
      return await this.model.find(query).exec();
    } catch (error) {
      throw new Error(`Error fetching entities: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const entity = await this.model.findById(id).exec();
      if (!entity) throw new Error("Entity not found");
      return entity;
    } catch (error) {
      throw new Error(`Error fetching entity: ${(error as Error).message}`);
    }
  }

  async create(entity: Partial<T>): Promise<T> {
    try {
      const newEntity = new this.model(entity);
      return (await newEntity.save()) as T; // Type assertion
    } catch (error) {
      throw new Error(`Error creating entity: ${(error as Error).message}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const updatedEntity = await this.model
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
      if (!updatedEntity) throw new Error("Entity not found");
      return updatedEntity;
    } catch (error) {
      throw new Error(`Error updating entity: ${(error as Error).message}`);
    }
  }

  async findOne(query: any): Promise<T | null> {
    try {
      const entity = await this.model.findOne(query).exec();
      if (!entity) throw new Error("Entity not found");
      return entity;
    } catch (error) {
      throw new Error(`Error fetching entity: ${(error as Error).message}`);
    }
  }
}
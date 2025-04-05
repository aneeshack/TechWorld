"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericRepository = void 0;
class GenericRepository {
    constructor(model) {
        this._model = model;
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            try {
                return yield this._model.find(query).exec();
            }
            catch (error) {
                throw new Error(`Error fetching entities: ${error.message}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this._model.findById(id).exec();
                if (!entity)
                    throw new Error("Entity not found");
                return entity;
            }
            catch (error) {
                throw new Error(`Error fetching entity: ${error.message}`);
            }
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newEntity = new this._model(entity);
                return (yield newEntity.save()); // Type assertion
            }
            catch (error) {
                throw new Error(`Error creating entity: ${error.message}`);
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEntity = yield this._model
                    .findByIdAndUpdate(id, { $set: data }, { new: true })
                    .exec();
                if (!updatedEntity)
                    throw new Error("Entity not found");
                return updatedEntity;
            }
            catch (error) {
                throw new Error(`Error updating entity: ${error.message}`);
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this._model.findOne(query).exec();
                if (!entity)
                    throw new Error("Entity not found");
                return entity;
            }
            catch (error) {
                throw new Error(`Error fetching entity: ${error.message}`);
            }
        });
    }
}
exports.GenericRepository = GenericRepository;

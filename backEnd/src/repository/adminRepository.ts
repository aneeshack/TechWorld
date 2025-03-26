import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { CategoryEntity } from "../interfaces/courses/category";
import { IUser, RequestStatus } from "../interfaces/database/IUser";
import { Category } from "../models/categoryModel";
import UserModel from "../models/userModel";
import { GenericRepository } from "./genericRepository";

export class AdminRepository implements IAdminRepository {
  private _userRepository: GenericRepository<IUser>;
  private _categoryRepository: GenericRepository<CategoryEntity>;

  constructor() {
    this._userRepository = new GenericRepository<IUser>(UserModel);
    this._categoryRepository = new GenericRepository<CategoryEntity>(Category);
  }

  async getAllRequests(): Promise<IUser[]> {
    try {
      return await this._userRepository.findAll({
        role: "instructor",
        isRequested: true,
        requestStatus: "pending",
      });
    } catch (error) {
      console.error("adminRepository error:getAllRequest", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getAllRejectedRequests(): Promise<IUser[]> {
    try {
      return await this._userRepository.findAll({
        role: "instructor",
        isRequested: true,
        requestStatus: RequestStatus.Rejected,
      });
    } catch (error) {
      console.error("adminRepository error:getAllRejectedRequests", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async approveRequest(userId: string): Promise<IUser> {
    try {
      return await this._userRepository.update(userId, {
        requestStatus: RequestStatus.Approved,
      }) as IUser;
    } catch (error) {
      console.error("adminRepository error:approveRequest", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async rejectRequest(userId: string): Promise<IUser> {
    try {
      return await this._userRepository.update(userId, {
        requestStatus: RequestStatus.Rejected,
      }) as IUser;
    } catch (error) {
      console.error("adminRepository error:rejectRequest", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this._userRepository.findAll({
        role: { $in: ["instructor", "student"] },
        $or: [{ isGoogleAuth: true }, { isOtpVerified: true }],
      });
      return users;
    } catch (error) {
      console.error("adminRepository error:getAllUsers", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async blockUser(userId: string): Promise<IUser> {
    try {
      return await this._userRepository.update(userId, { isBlocked: true }) as IUser;
    } catch (error) {
      console.error("adminRepository error:blockUser", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async unblockUser(userId: string): Promise<IUser> {
    try {
      return await this._userRepository.update(userId, { isBlocked: false }) as IUser;
    } catch (error) {
      console.error("adminRepository error:unblockUser", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async createCategory(categoryName: string, description: string, imageUrl: string): Promise<CategoryEntity | null> {
    try {
      return await this._categoryRepository.create({ categoryName, description, imageUrl });
    } catch (error) {
      console.error("adminRepository error:createCategory", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async allCategories(): Promise<CategoryEntity[]> {
    try {
      return await this._categoryRepository.findAll({ isActive: true });
    } catch (error) {
      console.error("adminRepository error:allCategories", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getCategoryById(categoryId: string): Promise<CategoryEntity> {
    try {
      return (await this._categoryRepository.findById(categoryId)) as CategoryEntity;
    } catch (error) {
      console.error("adminRepository error:getCategoryById", error);
      throw new Error(`${(error as Error).message}`);
    }
  }

  async updateCategory(categoryId: string, categoryData: Partial<CategoryEntity>): Promise<CategoryEntity> {
    try {
      return (await this._categoryRepository.update(categoryId, categoryData)) as CategoryEntity;
    } catch (error) {
      console.error("adminRepository error:updateCategory", error);
      throw new Error(`${(error as Error).message}`);
    }
  }
}


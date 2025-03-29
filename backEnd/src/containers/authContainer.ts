import { Container } from "inversify";
import { AUTH_TYPES } from "../interfaces/types";
import { AuthRepository } from "../repository/authRepository";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";

const authContainer = new Container();

// Bind dependencies
authContainer.bind<AuthRepository>(AUTH_TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
authContainer.bind<AuthService>(AUTH_TYPES.AuthService).to(AuthService).inSingletonScope();
authContainer.bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController).inSingletonScope();

export { authContainer };
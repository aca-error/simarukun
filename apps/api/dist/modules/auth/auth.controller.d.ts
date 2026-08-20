import { AuthService } from './auth.service';
import { LoginResponse } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(email: string, password: string): Promise<LoginResponse>;
    register(nama: string, email: string, password: string): Promise<LoginResponse>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<Omit<import("../users/entities/user.entity").User, "password">>;
}

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        nama: string;
        role: UserRole;
        isActive: boolean;
        createdAt: Date;
    };
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<Omit<User, 'password'>>;
    login(email: string, password: string): Promise<LoginResponse>;
    register(nama: string, email: string, password: string): Promise<LoginResponse>;
    generateTokens(userId: string, email: string, role: UserRole): Promise<AuthTokens>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    validateJwtPayload(payload: JwtPayload): Promise<Omit<User, 'password'>>;
}

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginatedResult } from '../../common/types';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(page?: number, limit?: number, role?: UserRole, isActive?: boolean): Promise<PaginatedResult<Omit<User, 'password'>>>;
    findById(id: string): Promise<Omit<User, 'password'> | null>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>>;
    remove(id: string): Promise<Omit<User, 'password'>>;
    toggleActive(id: string): Promise<Omit<User, 'password'>>;
    search(query: string): Promise<Omit<User, 'password'>[]>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    clearRefreshToken(userId: string): Promise<void>;
    findByRole(role: UserRole): Promise<Omit<User, 'password'>[]>;
}

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuthRequest } from '../../common/types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: AuthRequest, page?: number, limit?: number, role?: UserRole, isActive?: boolean): Promise<import("../../common/types").PaginatedResult<Omit<import("./entities/user.entity").User, "password">>>;
    search(query: string, req: AuthRequest): Promise<Omit<import("./entities/user.entity").User, "password">[]>;
    findOne(id: string, req: AuthRequest): Promise<Omit<import("./entities/user.entity").User, "password">>;
    create(createUserDto: CreateUserDto, req: any): Promise<Omit<import("./entities/user.entity").User, "password">>;
    toggleActive(id: string, req: any): Promise<Omit<import("./entities/user.entity").User, "password">>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<Omit<import("./entities/user.entity").User, "password">>;
    remove(id: string, req: any): Promise<Omit<import("./entities/user.entity").User, "password">>;
}

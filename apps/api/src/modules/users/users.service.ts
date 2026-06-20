import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find all users with pagination and optional filters
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param role - Filter by role (optional)
   * @param isActive - Filter by active status (optional)
   * @returns Paginated result with users
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: UserRole,
    isActive?: boolean,
  ): Promise<PaginatedResult<Omit<User, 'password'>>> {
    const where: FindOptionsWhere<User> = {};

    if (role !== undefined) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Remove password from all users
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      data: usersWithoutPassword as Omit<User, 'password'>[],
      total,
      page,
      limit,
    };
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User without password
   */
  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User with password (for authentication)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  /**
   * Create a new user
   * @param createUserDto - User data
   * @returns Created user without password
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Update a user
   * @param id - User ID
   * @param updateUserDto - Updated user data
   * @returns Updated user without password
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    const savedUser = await this.usersRepository.save(updatedUser);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns Deleted user without password
   */
  async remove(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = await this.usersRepository.remove(user);
    const { password, ...userWithoutPassword } = deletedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Toggle user active status
   * @param id - User ID
   * @returns Updated user without password
   */
  async toggleActive(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = !user.isActive;
    const savedUser = await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Search users by name or email
   * @param query - Search query
   * @returns List of users without password
   */
  async search(query: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      where: [
        { nama: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
      ],
      take: 10,
    });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return usersWithoutPassword as Omit<User, 'password'>[];
  }

  /**
   * Update user's refresh token
   * @param userId - User ID
   * @param refreshToken - Refresh token
   */
  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }

  /**
   * Clear user's refresh token (logout)
   * @param userId - User ID
   */
  async clearRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  /**
   * Get users by role
   * @param role - User role
   * @returns List of users without password
   */
  async findByRole(role: UserRole): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.findBy({ role });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return usersWithoutPassword as Omit<User, 'password'>[];
  }
}

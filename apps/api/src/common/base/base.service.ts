import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginatedResult } from '../../common/types';

/**
 * Abstract base service providing common CRUD operations
 * @template T - Entity type
 */
@Injectable()
export abstract class BaseService<T extends { id: string; userId?: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Get all entities with pagination and optional filters
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    where?: FindOptionsWhere<T>,
    relations?: string[],
    orderBy: Record<string, 'ASC' | 'DESC'> = { createdAt: 'DESC' },
  ): Promise<PaginatedResult<T>> {
    const [entities, total] = await this.repository.findAndCount({
      where: where || {},
      order: orderBy,
      skip: (page - 1) * limit,
      take: limit,
      relations,
    });

    return {
      data: entities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get entity by ID
   */
  async findOne(id: string, relations?: string[]): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }

    return entity;
  }

  /**
   * Create a new entity
   */
  async create(data: Partial<T>, user?: User): Promise<T> {
    const entity = this.repository.create({
      ...data,
      user,
      userId: user?.id || null,
    } as any);

    return this.repository.save(entity);
  }

  /**
   * Update an entity
   */
  async update(
    id: string,
    data: Partial<T>,
    currentUser: User,
    allowedRoles: UserRole[] = [UserRole.SUPERADMIN, UserRole.SUPERVISOR, UserRole.ADMIN],
  ): Promise<T> {
    const entity = await this.findOne(id);

    // Check permissions
    this.checkPermission(entity, currentUser, allowedRoles);

    const updatedEntity = this.repository.merge(entity, data as any);
    return this.repository.save(updatedEntity);
  }

  /**
   * Delete an entity
   */
  async remove(
    id: string,
    currentUser: User,
    allowedRoles: UserRole[] = [UserRole.SUPERADMIN, UserRole.SUPERVISOR],
  ): Promise<T> {
    const entity = await this.findOne(id);

    // Check permissions
    this.checkPermission(entity, currentUser, allowedRoles);

    return this.repository.remove(entity);
  }

  /**
   * Find entities by user ID
   */
  async findByUser(userId: string, relations?: string[]): Promise<T[]> {
    return this.repository.find({
      where: { userId } as any,
      order: { createdAt: 'DESC' },
      relations,
    });
  }

  /**
   * Check if user has permission to access/modify entity
   */
  protected checkPermission(
    entity: T,
    currentUser: User,
    allowedRoles: UserRole[],
  ): void {
    const hasRole = allowedRoles.includes(currentUser.role as UserRole);
    const isOwner = (entity as any).userId === currentUser.id;

    if (!hasRole && !isOwner) {
      throw new ForbiddenException(
        `You do not have permission to perform this action`,
      );
    }
  }

  /**
   * Get entity name for error messages (override in subclass)
   */
  protected getEntityName(): string {
    return 'Entity';
  }
}

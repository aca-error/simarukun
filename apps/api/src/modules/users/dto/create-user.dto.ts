/**
 * Create User Data Transfer Object
 * 
 * DTO ini digunakan untuk validasi data saat pembuatan user baru
 * Menggunakan Zod untuk validasi yang kuat
 * 
 * @package SimaRukun
 * @subpackage Backend/Users/DTO
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * Schema validasi untuk pembuatan user
 */
const CreateUserSchema = z.object({
  /**
   * Nama lengkap user
   * Minimal 2 karakter, maksimal 100 karakter
   */
  nama: z
    .string({
      required_error: 'Nama wajib diisi',
      invalid_type_error: 'Nama harus berupa teks',
    })
    .min(2, { message: 'Nama minimal 2 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' }),

  /**
   * Email user
   * Harus format email yang valid
   */
  email: z
    .string({
      required_error: 'Email wajib diisi',
      invalid_type_error: 'Email harus berupa teks',
    })
    .email({ message: 'Email tidak valid' })
    .max(255, { message: 'Email maksimal 255 karakter' }),

  /**
   * Password user
   * Minimal 8 karakter, maksimal 100 karakter
   */
  password: z
    .string({
      required_error: 'Password wajib diisi',
      invalid_type_error: 'Password harus berupa teks',
    })
    .min(8, { message: 'Password minimal 8 karakter' })
    .max(100, { message: 'Password maksimal 100 karakter' }),

  /**
   * Role user
   * Default: WARGA
   */
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Role tidak valid. Pilihan: SUPERADMIN, SUPERVISOR, ADMIN, WARGA' }),
    })
    .default(UserRole.WARGA),
});

/**
 * DTO untuk pembuatan user baru
 */
export class CreateUserDto extends createZodDto(CreateUserSchema) {}

/**
 * Type untuk CreateUserDto
 */
export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;

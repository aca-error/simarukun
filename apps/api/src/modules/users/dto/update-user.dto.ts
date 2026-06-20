/**
 * Update User Data Transfer Object
 * 
 * DTO ini digunakan untuk validasi data saat update user
 * Semua field bersifat optional
 * 
 * @package SimaRukun
 * @subpackage Backend/Users/DTO
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * Schema validasi untuk update user
 * Semua field bersifat optional
 */
const UpdateUserSchema = z.object({
  /**
   * Nama lengkap user
   * Minimal 2 karakter, maksimal 100 karakter
   */
  nama: z
    .string({
      invalid_type_error: 'Nama harus berupa teks',
    })
    .min(2, { message: 'Nama minimal 2 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' })
    .optional(),

  /**
   * Email user
   * Harus format email yang valid
   */
  email: z
    .string({
      invalid_type_error: 'Email harus berupa teks',
    })
    .email({ message: 'Email tidak valid' })
    .max(255, { message: 'Email maksimal 255 karakter' })
    .optional(),

  /**
   * Password user
   * Minimal 8 karakter, maksimal 100 karakter
   */
  password: z
    .string({
      invalid_type_error: 'Password harus berupa teks',
    })
    .min(8, { message: 'Password minimal 8 karakter' })
    .max(100, { message: 'Password maksimal 100 karakter' })
    .optional(),

  /**
   * Role user
   */
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Role tidak valid. Pilihan: SUPERADMIN, SUPERVISOR, ADMIN, WARGA' }),
    })
    .optional(),

  /**
   * Status user (aktif/tidak aktif)
   */
  isActive: z
    .boolean({
      invalid_type_error: 'isActive harus berupa boolean',
    })
    .optional(),
});

/**
 * DTO untuk update user
 */
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

/**
 * Type untuk UpdateUserDto
 */
export type UpdateUserDtoType = z.infer<typeof UpdateUserSchema>;

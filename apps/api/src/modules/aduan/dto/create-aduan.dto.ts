/**
 * Create Aduan Data Transfer Object
 * 
 * @package SimaRukun
 * @subpackage Backend/Aduan/DTO
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateAduanSchema = z.object({
  /**
   * Judul aduan
   */
  judul: z
    .string({
      required_error: 'Judul wajib diisi',
      invalid_type_error: 'Judul harus berupa teks',
    })
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(200, { message: 'Judul maksimal 200 karakter' }),

  /**
   * Deskripsi aduan
   */
  deskripsi: z
    .string({
      required_error: 'Deskripsi wajib diisi',
      invalid_type_error: 'Deskripsi harus berupa teks',
    })
    .min(10, { message: 'Deskripsi minimal 10 karakter' })
    .max(5000, { message: 'Deskripsi maksimal 5000 karakter' }),

  /**
   * Kategori aduan
   */
  kategori: z
    .enum(['KEAMANAN', 'KEBERSIHAN', 'FASILITAS', 'LAINNYA'] as const)
    .default('LAINNYA'),

  /**
   * Lokasi kejadian
   */
  lokasi: z
    .string({
      invalid_type_error: 'Lokasi harus berupa teks',
    })
    .max(100, { message: 'Lokasi maksimal 100 karakter' })
    .optional(),
});

export class CreateAduanDto extends createZodDto(CreateAduanSchema) {}

export type CreateAduanDtoType = z.infer<typeof CreateAduanSchema>;

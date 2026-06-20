/**
 * Update Aduan Data Transfer Object
 * 
 * @package SimaRukun
 * @subpackage Backend/Aduan/DTO
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateAduanSchema = z.object({
  /**
   * Judul aduan
   */
  judul: z
    .string({
      invalid_type_error: 'Judul harus berupa teks',
    })
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(200, { message: 'Judul maksimal 200 karakter' })
    .optional(),

  /**
   * Deskripsi aduan
   */
  deskripsi: z
    .string({
      invalid_type_error: 'Deskripsi harus berupa teks',
    })
    .min(10, { message: 'Deskripsi minimal 10 karakter' })
    .max(5000, { message: 'Deskripsi maksimal 5000 karakter' })
    .optional(),

  /**
   * Kategori aduan
   */
  kategori: z
    .enum(['KEAMANAN', 'KEBERSIHAN', 'FASILITAS', 'LAINNYA'] as const)
    .optional(),

  /**
   * Lokasi kejadian
   */
  lokasi: z
    .string({
      invalid_type_error: 'Lokasi harus berupa teks',
    })
    .max(100, { message: 'Lokasi maksimal 100 karakter' })
    .optional(),

  /**
   * Catatan
   */
  catatan: z
    .string({
      invalid_type_error: 'Catatan harus berupa teks',
    })
    .max(1000, { message: 'Catatan maksimal 1000 karakter' })
    .optional(),
});

export class UpdateAduanDto extends createZodDto(UpdateAduanSchema) {}

export type UpdateAduanDtoType = z.infer<typeof UpdateAduanSchema>;

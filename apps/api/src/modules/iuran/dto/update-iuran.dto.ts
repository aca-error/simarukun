/**
 * Update Iuran Data Transfer Object
 * 
 * @package SimaRukun
 * @subpackage Backend/Iuran/DTO
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateIuranSchema = z.object({
  /**
   * Judul iuran
   */
  judul: z
    .string({
      invalid_type_error: 'Judul harus berupa teks',
    })
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(200, { message: 'Judul maksimal 200 karakter' })
    .optional(),

  /**
   * Deskripsi iuran
   */
  deskripsi: z
    .string({
      invalid_type_error: 'Deskripsi harus berupa teks',
    })
    .max(2000, { message: 'Deskripsi maksimal 2000 karakter' })
    .optional(),

  /**
   * Jumlah iuran
   */
  jumlah: z
    .number({
      invalid_type_error: 'Jumlah harus berupa angka',
    })
    .positive({ message: 'Jumlah harus lebih dari 0' })
    .int({ message: 'Jumlah harus berupa bilangan bulat' })
    .optional(),

  /**
   * Tanggal jatuh tempo
   */
  tanggalJatuhTempo: z
    .string({
      invalid_type_error: 'Tanggal jatuh tempo harus berupa teks',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format tanggal harus YYYY-MM-DD' })
    .optional(),

  /**
   * Status iuran
   */
  status: z
    .enum(['BELUM_BAYAR', 'SUDAH_BAYAR', 'TELAT'] as const)
    .optional(),
});

export class UpdateIuranDto extends createZodDto(UpdateIuranSchema) {}

export type UpdateIuranDtoType = z.infer<typeof UpdateIuranSchema>;

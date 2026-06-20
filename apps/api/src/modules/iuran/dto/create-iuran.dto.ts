/**
 * Create Iuran Data Transfer Object
 * 
 * @package SimaRukun
 * @subpackage Backend/Iuran/DTO
 */

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateIuranSchema = z.object({
  /**
   * Judul iuran
   */
  judul: z
    .string({
      required_error: 'Judul wajib diisi',
      invalid_type_error: 'Judul harus berupa teks',
    })
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(200, { message: 'Judul maksimal 200 karakter' }),

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
      required_error: 'Jumlah wajib diisi',
      invalid_type_error: 'Jumlah harus berupa angka',
    })
    .positive({ message: 'Jumlah harus lebih dari 0' })
    .int({ message: 'Jumlah harus berupa bilangan bulat' }),

  /**
   * Tanggal jatuh tempo
   */
  tanggalJatuhTempo: z
    .string({
      required_error: 'Tanggal jatuh tempo wajib diisi',
      invalid_type_error: 'Tanggal jatuh tempo harus berupa teks',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format tanggal harus YYYY-MM-DD' }),

  /**
   * Status iuran
   */
  status: z
    .enum(['BELUM_BAYAR', 'SUDAH_BAYAR', 'TELAT'] as const)
    .default('BELUM_BAYAR'),
});

export class CreateIuranDto extends createZodDto(CreateIuranSchema) {}

export type CreateIuranDtoType = z.infer<typeof CreateIuranSchema>;

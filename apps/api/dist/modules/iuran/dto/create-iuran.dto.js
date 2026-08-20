"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIuranDto = exports.CreateIuranSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.CreateIuranSchema = zod_1.z.object({
    judul: zod_1.z
        .string({
        required_error: 'Judul wajib diisi',
        invalid_type_error: 'Judul harus berupa teks',
    })
        .min(3, { message: 'Judul minimal 3 karakter' })
        .max(200, { message: 'Judul maksimal 200 karakter' }),
    deskripsi: zod_1.z
        .string({
        invalid_type_error: 'Deskripsi harus berupa teks',
    })
        .max(2000, { message: 'Deskripsi maksimal 2000 karakter' })
        .optional(),
    jumlah: zod_1.z
        .number({
        required_error: 'Jumlah wajib diisi',
        invalid_type_error: 'Jumlah harus berupa angka',
    })
        .positive({ message: 'Jumlah harus lebih dari 0' })
        .int({ message: 'Jumlah harus berupa bilangan bulat' }),
    tanggalJatuhTempo: zod_1.z
        .string({
        required_error: 'Tanggal jatuh tempo wajib diisi',
        invalid_type_error: 'Tanggal jatuh tempo harus berupa teks',
    })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format tanggal harus YYYY-MM-DD' }),
    status: zod_1.z
        .enum(['BELUM_BAYAR', 'SUDAH_BAYAR', 'TELAT'])
        .default('BELUM_BAYAR'),
});
class CreateIuranDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateIuranSchema) {
}
exports.CreateIuranDto = CreateIuranDto;
//# sourceMappingURL=create-iuran.dto.js.map
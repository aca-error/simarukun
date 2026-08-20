"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAduanDto = exports.CreateAduanSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.CreateAduanSchema = zod_1.z.object({
    judul: zod_1.z
        .string({
        required_error: 'Judul wajib diisi',
        invalid_type_error: 'Judul harus berupa teks',
    })
        .min(3, { message: 'Judul minimal 3 karakter' })
        .max(200, { message: 'Judul maksimal 200 karakter' }),
    deskripsi: zod_1.z
        .string({
        required_error: 'Deskripsi wajib diisi',
        invalid_type_error: 'Deskripsi harus berupa teks',
    })
        .min(10, { message: 'Deskripsi minimal 10 karakter' })
        .max(5000, { message: 'Deskripsi maksimal 5000 karakter' }),
    kategori: zod_1.z
        .enum(['KEAMANAN', 'KEBERSIHAN', 'FASILITAS', 'LAINNYA'])
        .default('LAINNYA'),
    lokasi: zod_1.z
        .string({
        invalid_type_error: 'Lokasi harus berupa teks',
    })
        .max(100, { message: 'Lokasi maksimal 100 karakter' })
        .optional(),
});
class CreateAduanDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateAduanSchema) {
}
exports.CreateAduanDto = CreateAduanDto;
//# sourceMappingURL=create-aduan.dto.js.map
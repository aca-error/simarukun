"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAduanDto = exports.UpdateAduanSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpdateAduanSchema = zod_1.z.object({
    judul: zod_1.z
        .string({
        invalid_type_error: 'Judul harus berupa teks',
    })
        .min(3, { message: 'Judul minimal 3 karakter' })
        .max(200, { message: 'Judul maksimal 200 karakter' })
        .optional(),
    deskripsi: zod_1.z
        .string({
        invalid_type_error: 'Deskripsi harus berupa teks',
    })
        .min(10, { message: 'Deskripsi minimal 10 karakter' })
        .max(5000, { message: 'Deskripsi maksimal 5000 karakter' })
        .optional(),
    kategori: zod_1.z
        .enum(['KEAMANAN', 'KEBERSIHAN', 'FASILITAS', 'LAINNYA'])
        .optional(),
    lokasi: zod_1.z
        .string({
        invalid_type_error: 'Lokasi harus berupa teks',
    })
        .max(100, { message: 'Lokasi maksimal 100 karakter' })
        .optional(),
    catatan: zod_1.z
        .string({
        invalid_type_error: 'Catatan harus berupa teks',
    })
        .max(1000, { message: 'Catatan maksimal 1000 karakter' })
        .optional(),
});
class UpdateAduanDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateAduanSchema) {
}
exports.UpdateAduanDto = UpdateAduanDto;
//# sourceMappingURL=update-aduan.dto.js.map
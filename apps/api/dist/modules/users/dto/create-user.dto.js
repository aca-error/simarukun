"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const user_role_enum_1 = require("../../../common/enums/user-role.enum");
const CreateUserSchema = zod_1.z.object({
    nama: zod_1.z
        .string({
        required_error: 'Nama wajib diisi',
        invalid_type_error: 'Nama harus berupa teks',
    })
        .min(2, { message: 'Nama minimal 2 karakter' })
        .max(100, { message: 'Nama maksimal 100 karakter' }),
    email: zod_1.z
        .string({
        required_error: 'Email wajib diisi',
        invalid_type_error: 'Email harus berupa teks',
    })
        .email({ message: 'Email tidak valid' })
        .max(255, { message: 'Email maksimal 255 karakter' }),
    password: zod_1.z
        .string({
        required_error: 'Password wajib diisi',
        invalid_type_error: 'Password harus berupa teks',
    })
        .min(8, { message: 'Password minimal 8 karakter' })
        .max(100, { message: 'Password maksimal 100 karakter' }),
    role: zod_1.z
        .nativeEnum(user_role_enum_1.UserRole, {
        errorMap: () => ({ message: 'Role tidak valid. Pilihan: SUPERADMIN, SUPERVISOR, ADMIN, WARGA' }),
    })
        .default(user_role_enum_1.UserRole.WARGA),
});
class CreateUserDto extends (0, nestjs_zod_1.createZodDto)(CreateUserSchema) {
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map
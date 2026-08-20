import { z } from 'zod';
import { UserRole } from '../../../common/enums/user-role.enum';
declare const UpdateUserSchema: z.ZodObject<{
    nama: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    role?: UserRole | undefined;
    isActive?: boolean | undefined;
    nama?: string | undefined;
    password?: string | undefined;
}, {
    email?: string | undefined;
    role?: UserRole | undefined;
    isActive?: boolean | undefined;
    nama?: string | undefined;
    password?: string | undefined;
}>;
declare const UpdateUserDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    nama: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    role?: UserRole | undefined;
    isActive?: boolean | undefined;
    nama?: string | undefined;
    password?: string | undefined;
}, {
    email?: string | undefined;
    role?: UserRole | undefined;
    isActive?: boolean | undefined;
    nama?: string | undefined;
    password?: string | undefined;
}>, false>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export type UpdateUserDtoType = z.infer<typeof UpdateUserSchema>;
export {};

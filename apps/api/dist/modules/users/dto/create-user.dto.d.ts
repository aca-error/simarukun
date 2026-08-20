import { z } from 'zod';
import { UserRole } from '../../../common/enums/user-role.enum';
declare const CreateUserSchema: z.ZodObject<{
    nama: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodNativeEnum<typeof UserRole>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: UserRole;
    nama: string;
    password: string;
}, {
    email: string;
    nama: string;
    password: string;
    role?: UserRole | undefined;
}>;
declare const CreateUserDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    nama: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodNativeEnum<typeof UserRole>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: UserRole;
    nama: string;
    password: string;
}, {
    email: string;
    nama: string;
    password: string;
    role?: UserRole | undefined;
}>, false>;
export declare class CreateUserDto extends CreateUserDto_base {
}
export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
export {};

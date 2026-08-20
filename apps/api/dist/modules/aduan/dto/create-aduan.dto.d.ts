import { z } from 'zod';
export declare const CreateAduanSchema: z.ZodObject<{
    judul: z.ZodString;
    deskripsi: z.ZodString;
    kategori: z.ZodDefault<z.ZodEnum<["KEAMANAN", "KEBERSIHAN", "FASILITAS", "LAINNYA"]>>;
    lokasi: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    judul: string;
    deskripsi: string;
    kategori: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA";
    lokasi?: string | undefined;
}, {
    judul: string;
    deskripsi: string;
    kategori?: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA" | undefined;
    lokasi?: string | undefined;
}>;
declare const CreateAduanDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    judul: z.ZodString;
    deskripsi: z.ZodString;
    kategori: z.ZodDefault<z.ZodEnum<["KEAMANAN", "KEBERSIHAN", "FASILITAS", "LAINNYA"]>>;
    lokasi: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    judul: string;
    deskripsi: string;
    kategori: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA";
    lokasi?: string | undefined;
}, {
    judul: string;
    deskripsi: string;
    kategori?: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA" | undefined;
    lokasi?: string | undefined;
}>, false>;
export declare class CreateAduanDto extends CreateAduanDto_base {
}
export type CreateAduanDtoType = z.infer<typeof CreateAduanSchema>;
export {};

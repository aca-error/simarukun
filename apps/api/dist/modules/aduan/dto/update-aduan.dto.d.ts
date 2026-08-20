import { z } from 'zod';
export declare const UpdateAduanSchema: z.ZodObject<{
    judul: z.ZodOptional<z.ZodString>;
    deskripsi: z.ZodOptional<z.ZodString>;
    kategori: z.ZodOptional<z.ZodEnum<["KEAMANAN", "KEBERSIHAN", "FASILITAS", "LAINNYA"]>>;
    lokasi: z.ZodOptional<z.ZodString>;
    catatan: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    judul?: string | undefined;
    deskripsi?: string | undefined;
    catatan?: string | undefined;
    kategori?: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA" | undefined;
    lokasi?: string | undefined;
}, {
    judul?: string | undefined;
    deskripsi?: string | undefined;
    catatan?: string | undefined;
    kategori?: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA" | undefined;
    lokasi?: string | undefined;
}>;
declare const UpdateAduanDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    judul: z.ZodOptional<z.ZodString>;
    deskripsi: z.ZodOptional<z.ZodString>;
    kategori: z.ZodOptional<z.ZodEnum<["KEAMANAN", "KEBERSIHAN", "FASILITAS", "LAINNYA"]>>;
    lokasi: z.ZodOptional<z.ZodString>;
    catatan: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    judul?: string | undefined;
    deskripsi?: string | undefined;
    catatan?: string | undefined;
    kategori?: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA" | undefined;
    lokasi?: string | undefined;
}, {
    judul?: string | undefined;
    deskripsi?: string | undefined;
    catatan?: string | undefined;
    kategori?: "KEAMANAN" | "KEBERSIHAN" | "FASILITAS" | "LAINNYA" | undefined;
    lokasi?: string | undefined;
}>, false>;
export declare class UpdateAduanDto extends UpdateAduanDto_base {
}
export type UpdateAduanDtoType = z.infer<typeof UpdateAduanSchema>;
export {};

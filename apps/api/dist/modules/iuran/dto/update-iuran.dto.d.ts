import { z } from 'zod';
export declare const UpdateIuranSchema: z.ZodObject<{
    judul: z.ZodOptional<z.ZodString>;
    deskripsi: z.ZodOptional<z.ZodString>;
    jumlah: z.ZodOptional<z.ZodNumber>;
    tanggalJatuhTempo: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["BELUM_BAYAR", "SUDAH_BAYAR", "TELAT"]>>;
}, "strip", z.ZodTypeAny, {
    tanggalJatuhTempo?: string | undefined;
    status?: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT" | undefined;
    judul?: string | undefined;
    deskripsi?: string | undefined;
    jumlah?: number | undefined;
}, {
    tanggalJatuhTempo?: string | undefined;
    status?: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT" | undefined;
    judul?: string | undefined;
    deskripsi?: string | undefined;
    jumlah?: number | undefined;
}>;
declare const UpdateIuranDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    judul: z.ZodOptional<z.ZodString>;
    deskripsi: z.ZodOptional<z.ZodString>;
    jumlah: z.ZodOptional<z.ZodNumber>;
    tanggalJatuhTempo: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["BELUM_BAYAR", "SUDAH_BAYAR", "TELAT"]>>;
}, "strip", z.ZodTypeAny, {
    tanggalJatuhTempo?: string | undefined;
    status?: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT" | undefined;
    judul?: string | undefined;
    deskripsi?: string | undefined;
    jumlah?: number | undefined;
}, {
    tanggalJatuhTempo?: string | undefined;
    status?: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT" | undefined;
    judul?: string | undefined;
    deskripsi?: string | undefined;
    jumlah?: number | undefined;
}>, false>;
export declare class UpdateIuranDto extends UpdateIuranDto_base {
}
export type UpdateIuranDtoType = z.infer<typeof UpdateIuranSchema>;
export {};

import { z } from 'zod';
export declare const CreateIuranSchema: z.ZodObject<{
    judul: z.ZodString;
    deskripsi: z.ZodOptional<z.ZodString>;
    jumlah: z.ZodNumber;
    tanggalJatuhTempo: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["BELUM_BAYAR", "SUDAH_BAYAR", "TELAT"]>>;
}, "strip", z.ZodTypeAny, {
    tanggalJatuhTempo: string;
    status: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT";
    judul: string;
    jumlah: number;
    deskripsi?: string | undefined;
}, {
    tanggalJatuhTempo: string;
    judul: string;
    jumlah: number;
    status?: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT" | undefined;
    deskripsi?: string | undefined;
}>;
declare const CreateIuranDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    judul: z.ZodString;
    deskripsi: z.ZodOptional<z.ZodString>;
    jumlah: z.ZodNumber;
    tanggalJatuhTempo: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["BELUM_BAYAR", "SUDAH_BAYAR", "TELAT"]>>;
}, "strip", z.ZodTypeAny, {
    tanggalJatuhTempo: string;
    status: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT";
    judul: string;
    jumlah: number;
    deskripsi?: string | undefined;
}, {
    tanggalJatuhTempo: string;
    judul: string;
    jumlah: number;
    status?: "BELUM_BAYAR" | "SUDAH_BAYAR" | "TELAT" | undefined;
    deskripsi?: string | undefined;
}>, false>;
export declare class CreateIuranDto extends CreateIuranDto_base {
}
export type CreateIuranDtoType = z.infer<typeof CreateIuranSchema>;
export {};

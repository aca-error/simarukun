"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAccess = exports.UserRoleDescriptions = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPERADMIN"] = "superadmin";
    UserRole["SUPERVISOR"] = "supervisor";
    UserRole["ADMIN"] = "admin";
    UserRole["WARGA"] = "warga";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.UserRoleDescriptions = {
    [UserRole.SUPERADMIN]: 'Pengembang/Pemilik Sistem - Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime.',
    [UserRole.SUPERVISOR]: 'Ketua RT/RW - Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial.',
    [UserRole.ADMIN]: 'Sekretaris/Bendahara - Mengelola data warga, memantau pembayaran iuran, membuat pengumuman, dan menindaklanjuti laporan warga.',
    [UserRole.WARGA]: 'Kepala Keluarga/Anggota Keluarga - Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan.',
};
exports.RoleAccess = {
    [UserRole.SUPERADMIN]: [
        '/',
        '/warga',
        '/iuran',
        '/aduan',
        '/pengaturan',
        '/laporan',
        '/backup',
        '/webhook',
        '/server',
        '/audit',
    ],
    [UserRole.SUPERVISOR]: [
        '/',
        '/warga',
        '/iuran',
        '/aduan',
        '/pengaturan',
        '/laporan',
        '/backup',
        '/audit',
    ],
    [UserRole.ADMIN]: [
        '/',
        '/warga',
        '/iuran',
        '/aduan',
        '/pengaturan',
        '/laporan',
    ],
    [UserRole.WARGA]: [
        '/',
        '/pengaturan',
    ],
};
//# sourceMappingURL=user-role.enum.js.map
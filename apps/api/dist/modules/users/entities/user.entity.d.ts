import { UserRole } from '../../../common/enums/user-role.enum';
import { AuditLog } from '../../audit/audit.entity';
import { Iuran } from '../../iuran/entities/iuran.entity';
import { Aduan } from '../../aduan/entities/aduan.entity';
export declare class User {
    id: string;
    nama: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    refreshToken: string | null;
    phone: string | null;
    address: string | null;
    rt: string | null;
    rw: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
    auditLogs: AuditLog[];
    iurans: Iuran[];
    aduans: Aduan[];
}

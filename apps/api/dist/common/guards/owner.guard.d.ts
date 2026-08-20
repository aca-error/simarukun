import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const OWNER_CHECK_KEY = "owner_check";
export declare const CheckOwner: () => (target: any, propertyKey: string) => void;
export declare class OwnerGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

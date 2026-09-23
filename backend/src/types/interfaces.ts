export type Role = 'Admin' | 'FleetManager' | 'Dispatcher' | 'Driver' | 'Mechanic';
export interface AuthUser { id: number; role: Role; name: string; }
export interface ApiResult<T> { data: T; message: string; }
export interface RetireVehiclePayload { vehicleId: number; effectiveDate: string; reason: string; requestId?: string; }
export interface RetirementBlocking { dispatchOrders: any[]; maintenanceRecords: any[]; }

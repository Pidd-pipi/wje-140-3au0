export type Role = 'Admin' | 'FleetManager' | 'Dispatcher' | 'Driver' | 'Mechanic';
export interface AuthUser { id: number; role: Role; name: string; }
export interface ApiResult<T> { data: T; message: string; }

/** 退役办理入参 */
export interface RetirementRequest {
  vehicleId: number;
  effectiveDate: string;
  reason: string;
}

/** 退役办理被在途单据占用时返回的具体单据 */
export interface RetirementOccupation {
  dispatchOrders: { id: number; orderNo: string; status: string }[];
  maintenanceRecords: { id: number; item: string; status: string }[];
}

/** 退役记录 */
export interface RetirementRecord {
  id: number;
  vehicleId: number;
  effectiveDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

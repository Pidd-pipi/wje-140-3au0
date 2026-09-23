# 车队调度与维护 RESTful API 服务

## Docker 快速启动

```bash
docker compose up -d
```

Swagger 文档：http://localhost:19210/api-docs  
健康检查：http://localhost:19210/api/health

## 项目介绍

面向物流公司内部管理系统的后端 API，覆盖车辆生命周期、司机、调度、油耗、维保和费用核算。

## API 功能列表

- /api/vehicles：车辆管理（`?selectable=true` 仅返回可选车队，不含已退役车辆）。
- /api/drivers：司机管理。
- /api/dispatch-orders：调度派单与状态流转（`?vehicleId=` 按车查历史）。
- /api/maintenance-records：维保管理（`?vehicleId=` 按车查历史）。
- /api/fuel-records：油耗记录。
- /api/cost-summaries：费用汇总与利润核算。
- /api/vehicle-retirements：车辆退役办理。POST 提交 `vehicleId`、`effectiveDate`、`reason`（可选 `requestId` 用于重试幂等）；若车辆存在已派/执行中的调度或待开始/进行中的维保，返回 409 及具体占用单据且车辆状态不变；核验通过才生成退役记录并将车辆置为 Retired、移出可选车队；重复或并发办理只保留一份记录（GET `?vehicleId=` 按车查退役记录）。

## 本地开发

```bash
cd backend
npm install
npm run start:dev
```

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 后端 | NestJS + TypeScript |
| ORM | TypeORM |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 认证 | JWT |
| 文档 | Swagger |

## 目录结构

```
backend/src/
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── types/
├── utils/
├── config/
└── database/
```

## 枚举定义位置

- VehicleStatus：backend/src/types/enums.ts；backend/src/models/vehicle.entity.ts；backend/src/services/vehicle.service.ts
- DispatchStatus：backend/src/types/enums.ts；backend/src/models/dispatchOrder.entity.ts；backend/src/services/dispatch.service.ts
- MaintenanceType：backend/src/types/enums.ts；backend/src/models/maintenanceRecord.entity.ts；backend/src/services/maintenance.service.ts
- MaintenanceStatus：backend/src/types/enums.ts；backend/src/services/maintenance.service.ts；backend/src/services/vehicleRetirement.service.ts
- RetirementStatus：backend/src/types/enums.ts；backend/src/models/vehicleRetirement.entity.ts；backend/src/services/vehicleRetirement.service.ts
- DriverStatus：backend/src/types/enums.ts；backend/src/models/driver.entity.ts；backend/src/services/driver.service.ts
- PaymentMethod：backend/src/types/enums.ts；backend/src/models/fuelRecord.entity.ts；backend/src/services/fuel.service.ts

## License

MIT

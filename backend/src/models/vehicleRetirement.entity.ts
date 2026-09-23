import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class VehicleRetirementEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() vehicleId!: number;
  @Column() effectiveDate!: string;
  @Column() reason!: string;
  @Column() status!: string;
  @Column({ nullable: true }) requestId?: string;
  @Column() createdAt!: string;
}

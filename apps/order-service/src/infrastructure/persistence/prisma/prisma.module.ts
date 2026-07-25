// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  // Exportamos ambos para que cualquier módulo que importe DatabaseModule pueda usarlos
  exports: [PrismaService],
})
export class PrismaModule {}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
//import { JwtGuard } from 'building-blocks/passport/jwt.guard';
//import { CurrentUser } from 'building-blocks/decorators/current-user.decorator';
//import { JwtPayload } from 'building-blocks/passport/jwt-payload';

import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderResponseDto } from './dtos/order-response.dto';

import { CreateOrderCommand } from './feautures/create-order/create-order.command';

// ─────────────────────────────────────────────
// El Controller es solo el punto de entrada HTTP.
// No tiene lógica de negocio — recibe el request,
// arma el Command/Query y lo despacha al bus.
// ─────────────────────────────────────────────

@ApiBearerAuth()
@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
//@UseGuards(JwtGuard)
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ─────────────────────────────────────────────
  // POST /orders — Crear orden (inicia Saga)
  // ─────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  async createOrder(
    @Body() dto: CreateOrderDto, // class-validator valida aquí automáticamente
    // @CurrentUser() user: JwtPayload, // userId y companyId vienen del JWT
  ): Promise<OrderResponseDto> {
    return this.commandBus.execute(
      new CreateOrderCommand({
        companyId: 1,
        requestedBy: 1,
        customerId: dto.customerId,
        items: dto.items,
      }),
    );
  }
}
/*
  // ─────────────────────────────────────────────
  // GET /orders/:id — Obtener orden por ID
  // ─────────────────────────────────────────────
  @Get(':id')
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'NOT_FOUND' })
  async getOrder(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrderResponseDto> {
    // Aquí irá: return this.queryBus.execute(new GetOrderQuery(...))
    throw new Error('Not implemented yet');
  }

  // ─────────────────────────────────────────────
  // DELETE /orders/:id — Cancelar orden
  // ─────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'CANCELLED' })
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    // Aquí irá: return this.commandBus.execute(new CancelOrderCommand(...))
    throw new Error('Not implemented yet');
  }*/

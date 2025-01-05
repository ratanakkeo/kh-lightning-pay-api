import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { EscrowResponseDto } from './dto/escrow-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

@ApiTags('escrow')
@Controller('escrow')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Get()
  @ApiOperation({ summary: 'Get all escrows' })
  @ApiResponse({ type: EscrowResponseDto, isArray: true })
  async findAll(@CurrentUser() userId: string, @Query('role') role?: 'buyer' | 'seller') {
    if (role === 'buyer') {
      return this.escrowService.findByBuyer(userId);
    } else if (role === 'seller') {
      return this.escrowService.findBySeller(userId);
    }
    return this.escrowService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get escrow by id' })
  @ApiResponse({ type: EscrowResponseDto })
  findOne(@Param('id') id: string) {
    return this.escrowService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new escrow' })
  @ApiResponse({ type: EscrowResponseDto })
  create(@CurrentUser() userId: string, @Body() createEscrowDto: CreateEscrowDto) {
    return this.escrowService.createEscrow(userId, createEscrowDto);
  }

  @Post(':id/confirm-payment')
  @ApiOperation({ summary: 'Confirm payment received' })
  @ApiResponse({ type: EscrowResponseDto })
  confirmPayment(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.escrowService.confirmPayment(id, userId);
  }

  @Post(':id/confirm-shipment')
  @ApiOperation({ summary: 'Confirm shipment by seller' })
  @ApiResponse({ type: EscrowResponseDto })
  confirmShipment(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.escrowService.confirmShipment(id, userId);
  }

  @Post(':id/confirm-receipt')
  @ApiOperation({ summary: 'Confirm receipt by buyer' })
  @ApiResponse({ type: EscrowResponseDto })
  confirmReceipt(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.escrowService.confirmReceipt(id, userId);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Initiate dispute' })
  @ApiResponse({ type: EscrowResponseDto })
  initiateDispute(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.escrowService.initiateDispute(id, userId);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund disputed escrow' })
  @ApiResponse({ type: EscrowResponseDto })
  refund(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.escrowService.refund(id);
  }
} 
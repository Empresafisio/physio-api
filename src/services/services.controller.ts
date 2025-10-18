// services/services.controller.ts (atualizado)
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  createService(@Body('name') name: string) {
    return this.servicesService.createService(name);
  }

  @Post('assign')
  assignServiceToPhysiotherapist(
    @Body()
    body: {
      physiotherapist_id: string;
      service_id: string;
      price: number;
    },
  ) {
    return this.servicesService.assignServiceToPhysiotherapist(
      body.physiotherapist_id,
      body.service_id,
      body.price,
    );
  }

  @Get()
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get('physiotherapist/:physiotherapist_id')
  getPhysiotherapistServices(
    @Param('physiotherapist_id') physiotherapist_id: string,
  ) {
    return this.servicesService.getPhysiotherapistServices(physiotherapist_id);
  }

  @Patch(':id/price')
  updateServicePrice(@Param('id') id: string, @Body('price') price: number) {
    return this.servicesService.updateServicePrice(id, price);
  }

  @Get(':service_id/physiotherapists')
  getPhysiotherapistsByService(@Param('service_id') service_id: string) {
    return this.servicesService.getPhysiotherapistsByService(service_id);
  }
}

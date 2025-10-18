import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  @Post('save/:physiotherapist_id')
  async saveAvailability(
    @Param('physiotherapist_id') physiotherapist_id: string,
    @Body()
    body: {
      availability: {
        day_of_week: string;
        start_time: string;
        end_time: string;
      }[];
    },
  ) {
    return this.service.saveAvailability(physiotherapist_id, body.availability);
  }

  @Get(':physiotherapist_id')
  getAvailability(@Param('physiotherapist_id') physiotherapist_id: string) {
    return this.service.getAvailability(physiotherapist_id);
  }

  @Get(':physiotherapist_id/:day_of_week')
  getAvailabilityByDay(
    @Param('physiotherapist_id') physiotherapist_id: string,
    @Param('day_of_week') day_of_week: string,
  ) {
    return this.service.getAvailabilityByDay(physiotherapist_id, day_of_week);
  }
}

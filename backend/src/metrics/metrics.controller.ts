import { Controller, Post, Body } from '@nestjs/common';
import { MetricsService } from './metrics.service';

class CheckConnectionDto {
  host!: string;
  username!: string;
  privateKey!: string;
}

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('check')
  check(@Body() dto: CheckConnectionDto) {
    return this.metricsService.checkConnection(dto.host, dto.username, dto.privateKey);
  }
}
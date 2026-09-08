import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('connect')
  async connect() {
    const result = await this.metricsService.checkConnection();
    return { status: result };
  }
}

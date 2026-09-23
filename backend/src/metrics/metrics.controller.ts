import { Controller, Post, Body } from '@nestjs/common';
import { MetricsService } from './metrics.service';

class CheckConnectionDto {
  host!: string;
  username!: string;
  password!: string;
}

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post('uptime')
  getUptime(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getUptime(dto.host, dto.username, dto.password);
  }

  @Post('failedUnits')
  getFailed(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getFailed(dto.host, dto.username, dto.password);
  }

  @Post('failedConnections')
  getFailedConnections(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getFailedConnections(dto.host, dto.username, dto.password);
  }

  @Post('ram')
  getRam(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getRam(dto.host, dto.username, dto.password);
  }

  @Post('top')
  getTop(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getTop(dto.host, dto.username, dto.password);
  }

  @Post('disk')
  getDisk(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getDisk(dto.host, dto.username, dto.password);
  }

  @Post('cpu')
  getCpu(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getCpu(dto.host, dto.username, dto.password);
  }

  @Post('ports')
  getPorts(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getPorts(dto.host, dto.username, dto.password);
  }

  @Post('processes')
  getTopProcesses(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getTopProcesses(dto.host, dto.username, dto.password);
  }

  @Post('docker')
  getDockerContainers(@Body() dto: CheckConnectionDto) {
    return this.metricsService.getDockerContainers(dto.host, dto.username, dto.password);
  }
}

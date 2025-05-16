import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequestWithUser } from '../common/types/request-with-user';

@Controller('weather')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string, @Req() req: RequestWithUser) {
    return this.weatherService.fetchWeather(city, req.user.userId);
  }

  @Get('queries/me')
  async myQueries(@Req() req: RequestWithUser) {
    return this.weatherService.getMyQueries(req.user.userId);
  }

  @Get('queries/all')
  @Roles('ADMIN')
  async allQueries() {
    return this.weatherService.getAllQueries();
  }
}

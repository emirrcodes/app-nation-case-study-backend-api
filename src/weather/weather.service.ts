import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async fetchWeather(city: string, userId: string) {
    await this.cache.set('redis_test', 'from redis-yet');
    const check = await this.cache.get('redis_test');
    console.log('[REDIS-TEST]', check);

    const cacheKey = city.toLowerCase().trim();

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      console.log(`[CACHE] Found for city: ${city}`);
      console.log(cached);
      return cached;
    }

    const apiKey = this.config.get<string>('OPENWEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await lastValueFrom(this.http.get(url));
    const data = response.data;

    await new Promise((resolve) => setTimeout(resolve, 100));

    const recheck = await this.cache.get(cacheKey);
    console.log('[CACHE-DEBUG] Written & fetched immediately:', recheck);

    await this.prisma.weatherQuery.create({
      data: {
        city,
        result: data,
        userId,
      },
    });

    return data;
  }

  async getMyQueries(userId: string) {
    return this.prisma.weatherQuery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllQueries() {
    return this.prisma.weatherQuery.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Public()
    getHealth(): string {
        return this.appService.getHealth();
    }
}

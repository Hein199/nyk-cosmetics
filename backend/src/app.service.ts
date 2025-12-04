import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        return {
            status: 'ok',
            message: 'NYK Cosmetics API is running',
            timestamp: new Date().toISOString(),
        };
    }
}

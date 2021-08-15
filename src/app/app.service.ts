import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome() {
    return 'Test task for yalantis Node.js school';
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInspector implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const ResponseObj = context.switchToHttp().getResponse();
    ResponseObj.setHeader('Access-Control-Allow-Origin', '*');
    return next.handle();
  }
}

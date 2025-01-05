import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapper } from '../interfaces/response-wrapper.interface';

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, ResponseWrapper<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        message: 'Operation successful'
      }))
    );
  }
} 
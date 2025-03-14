import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { APIResponse } from '../interfaces/api-response.interface';
  
  @Injectable()
  export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, APIResponse<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<APIResponse<T>> {
      return next
        .handle()
        .pipe(map((data) => ({ status: 'success', result: data })));
    }
  }
  
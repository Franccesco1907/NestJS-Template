import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, TimeoutError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TimeOutInterceptor } from './timeout.interceptor';

describe('TimeOutInterceptor', () => {
  let interceptor: TimeOutInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new TimeOutInterceptor();

    mockExecutionContext = {};

    mockCallHandler = {
      handle: jest.fn(() => of('OK')),
    };
  });

  it('should return the observable if within timeout', (done) => {
    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe((result) => {
        expect(result).toBe('OK');
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      });
  });

  it('should throw TimeoutError if request takes too long', (done) => {
    mockCallHandler.handle = jest.fn(
      () => of('Delayed').pipe(delay(4000)), // 4s > 3s timeout
    );

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe({
        next: () => {
          fail('Expected timeout error');
        },
        error: (err) => {
          expect(err instanceof TimeoutError).toBe(true);
          done();
        },
      });
  });
});

import { IsNotEmpty, IsNumber } from 'class-validator';
import { JobMessage } from './job-message';

export class FibonacciMessage extends JobMessage {
    @IsNotEmpty()
    @IsNumber()
    iterations!: number;
}

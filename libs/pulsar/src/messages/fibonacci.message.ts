import { IsNotEmpty, IsNumber } from 'class-validator';

export class FibonacciMessage {
    @IsNotEmpty()
    @IsNumber()
    iterations!: number;
}

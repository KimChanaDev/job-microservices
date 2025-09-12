import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class FibonacciData {
  @IsNotEmpty()
  @IsNumber()
  iterations!: number;
}

export class FibonacciMessage {
  @ValidateNested({ each: true }) // validate each element
  @Type(() => FibonacciData) // transform each element into FibonacciData
  data!: FibonacciData[];
}

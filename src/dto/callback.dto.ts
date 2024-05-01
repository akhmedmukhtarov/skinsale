import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CallbackDto {
  @ApiProperty({
    description: 'valid user uuid',
    example: '65d5f9f7-a31e-48db-8222-7ed765142198',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'paid or refused', example: 'paid' })
  @IsString()
  @IsIn(['paid', 'refused'])
  status: 'paid' | 'refused';

  @ApiProperty({
    description: 'Greater than 0 decimal or integer',
    example: 1000,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}

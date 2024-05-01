import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemsResponseDto {
  @ApiProperty()
  market_hash_name: string;

  @ApiPropertyOptional()
  tradable?: number | null;

  @ApiPropertyOptional()
  non_tradable?: number | null;
}

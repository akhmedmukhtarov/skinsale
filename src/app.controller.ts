import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CallbackDto } from './dto/callback.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemsResponseDto } from './dto/items.response.dto';
import { ErrorResponseDto } from './dto/response.dto';

@ApiTags('HomePage')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: 200,
    isArray: true,
    type: ItemsResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Something went wrong' })
  @Get('items')
  getItems() {
    return this.appService.getItems();
  }

  @ApiResponse({
    status: 201,
    type: null,
    description: 'With valid dto status 201',
  })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({
    status: 406,
    description: 'If dto status is refused',
  })
  @ApiResponse({
    status: 404,
    description: 'If user with given uuid not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Something went wrong',
  })
  @Post('callback')
  callback(@Body() dto: CallbackDto) {
    return this.appService.callback(dto);
  }
}

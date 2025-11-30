import { ResponseDto } from '@common/dto';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';

export class GetHealthApiResponseDto extends ResponseDto<string> {
  @ApiProperty({ type: String, description: 'Health' })
  declare data: string;
}

@ApiTags('Health')
@ApiInternalServerErrorResponse({ description: "To Do's Server Error" })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetHealthApiResponseDto, description: 'Health' })
  getHealth(): string {
    return this.appService.getHealth();
  }
}

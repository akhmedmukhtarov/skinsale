export class ErrorResponseDto {
  ok: boolean;
  statusCode: number;
  message: string[] | string;
  path: 'string';
}

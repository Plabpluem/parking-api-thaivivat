import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  throwError(error) {
    if (error?.response?.message) {
      throw new HttpException(
        {
          message: error.response?.message,
          code: error.response?.statusCode || HttpStatus.BAD_REQUEST,
        },
        error.response?.httpCode || HttpStatus.BAD_REQUEST,
      );
    } else {
      throw new HttpException(
        {
          message: 'internal error',
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  createResponse(data: any) {
    return { message: 'successfully', statusCode: HttpStatus.CREATED, data };
  }

  getResponse(data: any) {
    return { message: 'successfully', statusCode: HttpStatus.OK, data };
  }
}

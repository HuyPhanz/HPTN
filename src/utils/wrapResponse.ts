import { IResponseDTO, IResponseDTOWithMeta } from './types';

export function wrapResponse<T>(
  data: T,
  status: number | boolean,
  errorCode: string,
  message?: string,
  meta?: any,
): IResponseDTO<T> {
  return {
    status,
    errorCode,
    message,
    meta,
    data,
  };
}

export function wrapResponseMeta<T>(
  data: T,
  status: number | boolean,
  errorCode: string,
  message?: string,
  meta?: { current_page?: number; total?: number },
): IResponseDTOWithMeta<T> {
  return {
    status,
    errorCode,
    message,
    data: {
      current_page: meta?.current_page,
      data,
      total: meta?.total,
    },
  };
}

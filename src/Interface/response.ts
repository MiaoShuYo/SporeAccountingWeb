export interface Response<T> {
    statusCode: number;
    errorMessage: string;
    data: T;
}
import { HttpException, HttpStatus } from '@nestjs/common';

const wrappedFetch = async <TBody>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<TBody> => {
  try {
    const response = await fetch(input, init);
    const body = await response.json();
    if (!response.ok) {
      console.error(body);
      throw new HttpException(
        JSON.stringify(response.json()),
        HttpStatus.BAD_REQUEST,
      );
    }

    return body;
  } catch (error) {
    console.error('An error occurred during the fetch request:', error);
    throw error;
  }
};

export default wrappedFetch;

import { HttpException, HttpStatus } from '@nestjs/common';

const wrappedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  try {
    const response = await fetch(input, init);
    if (!response.ok) {
      console.error(await response.json());
      throw new HttpException(
        JSON.stringify(response.json()),
        HttpStatus.BAD_REQUEST,
      );
    }

    return response;
  } catch (error) {
    console.error('An error occurred during the fetch request:', error);
    throw error;
  }
};

export default wrappedFetch;

// src/features/hotel/liteapi/liteapi.service.ts

import {
  LiteApiBookRequest,
  LiteApiPrebookRequest,
  LiteApiPrebookResponse,
  LiteApiRatesResponse,
  LiteApiHotelSearchRequest,
  LiteApiFacilitiesResponse,
} from './liteapi.types';

import { liteApiClient } from './liteapi.client';
import { LiteApiCitiesResponse } from '../../hotel/external/hotel.type';

class LiteApiService {
  async searchRates(
    payload: LiteApiHotelSearchRequest,
  ): Promise<LiteApiRatesResponse> {
    return liteApiClient.apiPost<LiteApiRatesResponse>(
      '/hotels/rates',
      payload,
    );
  }

  async getHotel(
    hotelId: string,
  ): Promise<any> {
    return liteApiClient.apiGet(
      '/data/hotel',
      {
        params: {
          hotelId,
        },
      },
    );
  }

  async getHotelRates(payload: LiteApiHotelSearchRequest) {
    return liteApiClient.apiPost<LiteApiRatesResponse>(
      '/hotels/rates',
      payload,
    );
  }

  async getFacilities(): Promise<LiteApiFacilitiesResponse> {
    return liteApiClient.apiGet<LiteApiFacilitiesResponse>(
      '/data/facilities',
    );
  }

  async prebook(
    payload: LiteApiPrebookRequest,
  ): Promise<LiteApiPrebookResponse> {
    return liteApiClient.bookingPost<LiteApiPrebookResponse>(
      '/rates/prebook',
      payload,
    );
  }

  async book(
    payload: LiteApiBookRequest,
  ): Promise<any> {
    return liteApiClient.bookingPost(
      '/rates/book',
      payload,
    );
  }

  async getBooking(
    bookingId: string,
  ): Promise<any> {
    return liteApiClient.bookingGet(
      `/bookings/${encodeURIComponent(bookingId)}`,
    );
  }

  async cancelBooking(
    bookingId: string,
  ): Promise<any> {
    return liteApiClient.bookingPut(
      `/bookings/${encodeURIComponent(bookingId)}`,
      {},
    );
  }


  async getCities(
    countryCode: string,
  ): Promise<LiteApiCitiesResponse> {
    return liteApiClient.apiGet<LiteApiCitiesResponse>(
      '/data/cities',
      {
        params: {
          countryCode: countryCode.toUpperCase(),
        },
      },
    );
  }
}

export const liteApiService =
  new LiteApiService();
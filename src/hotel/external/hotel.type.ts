// src/features/hotel/hotel.types.ts

export interface HotelSearchQuery {
  city: string;

  checkIn: string;

  checkOut: string;

  adults: number;

  children?: number[];

  rooms?: number;

  guestNationality?: string;

  minRating?: number;

  stars?: number[];

  facilities?: number[];

  strictFacilityFiltering?: boolean;

  refundableOnly?: boolean;

  boardType?: string;

  bedTypes?: string[];

  minReviewsCount?: number;

  sort?: 'recommended' | 'price_low' | 'price_high';

  page?: number;

  limit?: number;

  sessionId?: string;
}

export interface HotelDetailsQuery {
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number[];
  rooms: number;
  guestNationality?: string;
}

export interface HotelPrebookRequest {
  offerId: string;

  usePaymentSdk?: boolean;
}

export interface HotelBookingHolder {
  firstName: string;

  lastName: string;

  email: string;

  phone?: string;
}

export interface HotelBookingGuest {
  occupancyNumber: number;

  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  remarks?: string;
}

export interface HotelBookRequest {
  prebookId: string;

  holder: HotelBookingHolder;

  guests: HotelBookingGuest[];

  clientReference?: string;

  payment:
    | {
        method: 'ACC_CREDIT_CARD';
      }
    | {
        method: 'TRANSACTION_ID';

        transactionId: string;
      }
    | {
        method: 'WALLET';
      }
    | {
        method: 'CREDIT';
      };
}


export interface LiteApiCitiesResponse {
  data: {
    city: string;
  }[];
}
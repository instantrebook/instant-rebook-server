// src/features/hotel/liteapi/liteapi.types.ts

export interface LiteApiOccupancy {
  adults: number;
  children?: number[];
  childAges?: number[];
}

export interface LiteApiHotelSearchRequest {
  occupancies: LiteApiOccupancy[];

  currency: string;

  guestNationality: string;

  checkin: string;

  checkout: string;

  hotelIds?: string[];

  timeout?: number;

  maxRatesPerHotel?: number;

  boardType?: string;

  refundableRatesOnly?: boolean;

  roomAmenities?: number[];

  roomAmenitiesFilter?: string;

  amenityFilterLogic?: 'AND' | 'OR';

  bedTypes?: string[];

  roomMapping?: boolean;

  hotelName?: string;

  countryCode?: string;

  cityName?: string;

  latitude?: number;

  longitude?: number;

  radius?: number;

  iataCode?: string;

  limit?: number;

  offset?: number;

  minReviewsCount?: number;

  minRating?: number;

  zip?: string;

  placeId?: string;

  starRating?: number[];

  hotelTypeIds?: number[];

  chainIds?: number[];

  facilities?: number[];

  strictFacilityFiltering?: boolean;

  advancedAccessibilityOnly?: boolean;

  includeHotelData?: boolean;

  sessionId?: string;
}

export interface LiteApiRateTotal {
  amount: number;
  currency: string;
}

export interface LiteApiCancellationPolicy {
  refundableTag?: string;

  cancelPolicyInfos?: Array<{
    cancelTime?: string;
    amount?: number;
    currency?: string;
  }>;
}

// export interface LiteApiRate {
//   name?: string;

//   mappedRoomId?: number;

//   boardName?: string;

//   offerId?: string;

//   retailRate?: {
//     total?: LiteApiRateTotal[];

//     initialPrice?: number;

//     taxesAndFees?: Array<{
//       included?: boolean;
//       amount?: number;
//       currency?: string;
//     }>;
//   };

//   cancellationPolicies?: LiteApiCancellationPolicy;

//   [key: string]: unknown;
// }

export interface LiteApiRate {
  rateId?: string;

  occupancyNumber?: number;

  name?: string;

  boardType?: string;

  boardName?: string;

  mappedRoomId?: number;

  retailRate?: {
    total?: Array<{
      amount: number;
      currency: string;
    }>;

    taxesAndFees?: Array<{
      included?: boolean;
      amount?: number;
      currency?: string;
    }>;
  };

  cancellationPolicies?: {
    refundableTag?: string;

    cancelPolicyInfos?: Array<{
      cancelTime?: string;
      amount?: number;
      currency?: string;
      type?: string;
      timezone?: string;
    }>;
  };

  paymentTypes?: string[];

  perks?: unknown[];

  promotions?: unknown[];
}

// export interface LiteApiRoomType {
//   roomTypeId?: string;

//   offerId?: string;

//   rates?: LiteApiRate[];

//   [key: string]: unknown;
// }

export interface LiteApiRoomType {
  roomTypeId?: string;

  name?: string;

  offerId: string;

  supplier?: string;

  supplierId?: number;

  rates: LiteApiRate[];

  offerRetailRate?: {
    amount: number;
    currency: string;
  };

  suggestedSellingPrice?: {
    amount: number;
    currency: string;
  };
}

export interface LiteApiHotelData {
  id?: string;

  hotelId?: string;

  name?: string;

  main_photo?: string;

  address?: string;

  city?: string;

  country?: string;

  rating?: number;

  starRating?: number;

  hotelFacilities?: unknown[];

  [key: string]: unknown;
}

// export interface LiteApiRatesResponse {
//   data: Array<{
//     hotelId: string;

//     roomTypes?: LiteApiRoomType[];

//     [key: string]: unknown;
//   }>;

//   hotels?: LiteApiHotelData[];

//   guestLevel?: number;

//   sandbox?: boolean;

//   sessionId?: string;
// }

export interface LiteApiHotelRates {
  hotelId: string;

  roomTypes: LiteApiRoomType[];
}

export interface LiteApiRatesResponse {
  data: LiteApiHotelRates[];

  guestLevel?: number;

  sandbox?: boolean;
}

export interface LiteApiPrebookRequest {
  offerId: string;

  usePaymentSdk: boolean;

  voucherCode?: string;

  bedTypeIds?: number[];

  includeCreditBalance?: boolean;
}

export interface LiteApiPrebookResponse {
  data: {
    prebookId: string;

    transactionId?: string;

    secretKey?: string;

    [key: string]: unknown;
  };

  sandbox?: boolean;

  [key: string]: unknown;
}

export interface LiteApiHolder {
  firstName: string;

  lastName: string;

  email: string;

  phone?: string;
}

export interface LiteApiGuest {
  occupancyNumber: number;

  firstName: string;

  lastName: string;

  email: string;

  remarks?: string;

  phone?: string;
}

export interface LiteApiPayment {
  method:
    | 'ACC_CREDIT_CARD'
    | 'TRANSACTION_ID'
    | 'WALLET'
    | 'CREDIT'
    | 'CREDIT_CARD';

  transactionId?: string;
}

export interface LiteApiBookRequest {
  prebookId: string;

  clientReference?: string;

  holder: LiteApiHolder;

  guests: LiteApiGuest[];

  payment: LiteApiPayment;

  metadata?: Record<string, unknown>;

  customTags?: Record<string, string>;

  guestPayment?: Record<string, unknown>;
}

export interface LiteApiFacility {
  facility: string;

  facility_id: number;

  sort?: number;

  translation?: Array<{
    lang: string;
    facility: string;
  }>;
}

export interface LiteApiFacilitiesResponse {
  data: LiteApiFacility[];
}
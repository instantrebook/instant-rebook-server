// src/features/hotel/hotel.service.ts

import crypto from 'crypto';

import {
  HotelBookRequest,
  HotelDetailsQuery,
  HotelPrebookRequest,
  HotelSearchQuery,
} from './hotel.type';

import {
  liteApiService,
} from './../../utils/liteapi/liteapi.service';
import { sendUserBookingEmail } from '../../utils/email/emails.util';


class HotelService {
    
    async getFacilities() {
    const response =
        await liteApiService.getFacilities();

    return response.data.map(
        (facility) => ({
        id: facility.facility_id,
        name: facility.facility,
        // translations: []
        // translations: 
        //     facility.translation ?? [],
        }),
    );
    }

  
  async getCities(
    countryCode: string,
    search?: string,
  ) {
    const response =
      await liteApiService.getCities(
        countryCode,
      );

    const cities = [
      ...new Set(
        (response.data ?? [])
          .map((item) => item.city?.trim())
          .filter(
            (city): city is string =>
              Boolean(city),
          ),
      ),
    ].sort((a, b) =>
      a.localeCompare(b),
    );

    const searchTerm =
      search?.trim().toLowerCase();

    const filteredCities =
      searchTerm
        ? cities.filter((city) =>
            city
              .toLowerCase()
              .includes(searchTerm),
          )
        : cities;

    return {
      countryCode:
        countryCode.toUpperCase(),

      total:
        filteredCities.length,

      cities:
        filteredCities,
    };
  }

  async search(
    query: HotelSearchQuery,
  ) {
    const page =
      query.page ?? 1;

    const limit =
      query.limit ?? 20;

    const offset =
      (page - 1) * limit;

    const rooms =
      query.rooms ?? 1;

    const adults =
      query.adults;

    const children =
      query.children ?? [];

    /**
     * Build occupancy per room.
     *
     * For now we divide adults across rooms.
     *
     * Example:
     *
     * 2 adults / 1 room
     * [
     *   { adults: 2, children: [] }
     * ]
     */
    const occupancies =
      this.buildOccupancies(
        adults,
        children,
        rooms,
      );

    const sort =
      this.buildSort(query.sort);

    const response =
      await liteApiService.searchRates({
        countryCode: 'CA',

        cityName: query.city,

        checkin: query.checkIn,

        checkout: query.checkOut,

        currency: 'CAD',

        guestNationality:
          query.guestNationality ?? 'NG',

        occupancies,

        timeout: 10,

        maxRatesPerHotel: 1,

        roomMapping: true,

        includeHotelData: true,

        limit,

        offset,

        ...(query.minRating !== undefined && {
          minRating: query.minRating,
        }),

        ...(query.stars?.length && {
          starRating: query.stars,
        }),

        ...(query.facilities?.length && {
          facilities: query.facilities,
        }),

        ...(query.strictFacilityFiltering !== undefined && {
            strictFacilityFiltering:
                query.strictFacilityFiltering,
        }),

        ...(query.refundableOnly !== undefined && {
          refundableRatesOnly:
            query.refundableOnly,
        }),

        ...(query.boardType && {
          boardType: query.boardType,
        }),

        ...(query.bedTypes?.length && {
          bedTypes: query.bedTypes,
        }),

        ...(query.minReviewsCount !== undefined && {
          minReviewsCount:
            query.minReviewsCount,
        }),

        ...(sort && {
          sort,
        }),

        ...(query.sessionId && {
          sessionId: query.sessionId,
        }),
      });

    return {
      searchId:
        query.sessionId ??
        crypto.randomUUID(),

      location: {
        countryCode: 'CA',

        city: query.city,
      },

      dates: {
        checkIn: query.checkIn,

        checkOut: query.checkOut,
      },

      occupancy: {
        adults,

        children,

        rooms,
      },

      pagination: {
        page,

        limit,

        offset,
      },

      // hotels: this.normalizeHotels(response),
      hotels: this.normalizeHotelsMe(response)
    };
  }


    async getHotelDetails(
        hotelId: string,
    ) {
    const response =
        await liteApiService.getHotel(
        hotelId,
        );

    return this.normalizeHotelDetails(
        response,
    );
    }

    async sendLink(
        email: string,
        link: string,
    ) {
    const response =
        await  sendUserBookingEmail({emailTo: email, subject: "Complete Your Hotel Booking", message: link})

      return {message: "email sent successfully"}
    }

    async getHotelRate(
        hotelId: string,
        query: HotelDetailsQuery,
    ) {
        const occupancies = this.buildOccupancies(
            query.adults,
            query.children ?? [],
            query.rooms,
        );

        const ratesResponse = await liteApiService.searchRates({
            hotelIds: [hotelId],
            occupancies,
            currency: 'CAD',
            guestNationality: query.guestNationality ?? 'CA',
            checkin: query.checkIn,
            checkout: query.checkOut,

            // IMPORTANT
            roomMapping: true,

            // Don't use 1 here.
            // We want all available room/rate options.
            // maxRatesPerHotel: undefined,

            includeHotelData: true,
        })

        return {
            ratesResponse
        }
    }
    


    async getHotelDetailsTwo(
    hotelId: string,
    query: HotelDetailsQuery,
    ) {
    const occupancies = this.buildOccupancies(
        query.adults,
        query.children ?? [],
        query.rooms,
    );

    const [hotelResponse, ratesResponse] = await Promise.all([
        // Static hotel/room information
        liteApiService.getHotel(hotelId),

        // Live prices and availability
        liteApiService.searchRates({
        hotelIds: [hotelId],
        occupancies,
        currency: 'CAD',
        guestNationality: query.guestNationality ?? 'CA',
        checkin: query.checkIn,
        checkout: query.checkOut,

        // IMPORTANT
        roomMapping: true,

        // Don't use 1 here.
        // We want all available room/rate options.
        // maxRatesPerHotel: undefined,

        includeHotelData: true,
        }),
    ]);

    // console.log(
    //     'LITEAPI RATES:',
    //     JSON.stringify(ratesResponse, null, 2),
    // );

    return this.normalizeHotelDetailsTwo(
        hotelResponse,
        ratesResponse,
    );
    }

  async prebook(
    input: HotelPrebookRequest,
  ) {
    const response =
      await liteApiService.prebook({
        offerId: input.offerId,

        usePaymentSdk:
          input.usePaymentSdk ?? false,
      });

    return response;
  }

  async book(
    input: HotelBookRequest,
  ) {
    const clientReference =
      input.clientReference ??
      `HOTEL-${crypto.randomUUID()}`;

    const response =
      await liteApiService.book({
        prebookId:
          input.prebookId,

        clientReference,

        holder: input.holder,

        guests: input.guests,

        payment: input.payment,
      });

    return {
      clientReference,

      ...response,
    };
  }

  async getBooking(
    bookingId: string,
  ) {
    return liteApiService.getBooking(
      bookingId,
    );
  }

  async cancelBooking(
    bookingId: string,
  ) {
    return liteApiService.cancelBooking(
      bookingId,
    );
  }

  private buildOccupancies(
    adults: number,
    children: number[],
    rooms: number,
  ) {
    const occupancies = [];

    let remainingAdults =
      adults;

    for (
      let room = 1;
      room <= rooms;
      room++
    ) {
      const remainingRooms =
        rooms - room + 1;

      const roomAdults =
        Math.max(
          1,
          Math.ceil(
            remainingAdults /
              remainingRooms,
          ),
        );

      remainingAdults -= roomAdults;

      occupancies.push({
        adults: roomAdults,

        children:
          room === 1
            ? children
            : [],
      });
    }

    return occupancies;
  }

  private buildSort(
    sort:
      | HotelSearchQuery['sort']
      | undefined,
  ) {
    switch (sort) {
      case 'price_low':
        return [
          {
            field: 'price',
            direction: 'asc',
          },
        ];

      case 'price_high':
        return [
          {
            field: 'price',
            direction: 'desc',
          },
        ];

      default:
        return undefined;
    }
  }

  private normalizeHotels(
    response: any,
  ) {
    const hotels =
      response.hotels ?? [];

    const rates =
      response.data ?? [];

    return hotels.map(
      (hotel: any) => {
        const hotelRates =
          rates.find(
            (item: any) =>
              item.hotelId ===
              (hotel.id ??
                hotel.hotelId),
          );

        const roomTypes =
          hotelRates?.roomTypes ??
          [];

        const firstRate =
          roomTypes[0]?.rates?.[0];

        const total =
          firstRate?.retailRate
            ?.total?.[0];

        return {
          hotelId:
            hotel.id ??
            hotel.hotelId,

          name:
            hotel.name,

          image:
            hotel.main_photo ??
            null,

          address:
            hotel.address ??
            null,

          city:
            hotel.city ??
            null,

          country:
            hotel.country ??
            'CA',

          rating:
            hotel.rating ??
            null,

          stars:
            hotel.starRating ??
            null,

          price:
            total
              ? {
                  amount:
                    total.amount,

                  currency:
                    total.currency,
                }
              : null,

          room:
            firstRate
              ? {
                  name:
                    firstRate.name ??
                    null,

                  board:
                    firstRate.boardName ??
                    null,

                  offerId:
                    firstRate.offerId ??
                    roomTypes[0]
                      ?.offerId ??
                    null,

                  mappedRoomId:
                    firstRate.mappedRoomId ??
                    null,
                }
              : null,

          refundable:
            firstRate
              ?.cancellationPolicies
              ?.refundableTag ===
            'RFN',

          facilities:
            hotel.hotelFacilities ??
            [],
        };
      },
    );
  }

  private normalizeHotelDetails(
    response: any,
    ) {
    const hotel =
        response.data ?? response;

    const rooms =
        hotel.rooms ?? [];

    return {
        id:
        hotel.id ??
        hotel.hotelId ??
        null,

        name:
        hotel.name ??
        null,

        description:
        hotel.description ??
        null,

        address:
        hotel.address ??
        null,

        city:
        hotel.city ??
        hotel.city_name ??
        null,

        country:
        hotel.country ??
        hotel.country_code ??
        'CA',

        rating:
        hotel.rating ??
        null,

        stars:
        hotel.stars ??
        hotel.starRating ??
        null,

        images:
        hotel.photos ??
        hotel.images ??
        [],

        facilities:
        hotel.facilities ??
        hotel.hotelFacilities ??
        [],

        rooms: rooms.map(
        (room: any) => ({
            id:
            room.id,

            name:
            room.roomName ??
            null,

            description:
            room.description ??
            null,

            maxOccupancy:
            room.maxOccupancy ??
            null,

            maxAdults:
            room.maxAdults ??
            null,

            maxChildren:
            room.maxChildren ??
            null,

            roomSize:
            room.roomSizeSquare
                ? {
                    value:
                    room.roomSizeSquare,

                    unit:
                    room.roomSizeUnit ??
                    'm2',
                }
                : null,

            beds:
            room.bedTypes ??
            [],

            amenities:
            room.roomAmenities ??
            [],

            images:
            (room.photos ?? []).map(
                (photo: any) => ({
                url:
                    photo.url ??
                    photo.failoverPhoto ??
                    null,

                description:
                    photo.imageDescription ??
                    null,

                main:
                    photo.mainPhoto ??
                    false,
                }),
            ),
        }),
        ),
    };
    }

//     private normalizeHotelDetailsTwo(
//   hotelResponse: any,
//   ratesResponse: any,
// ) {
//   const hotel = hotelResponse?.data ?? hotelResponse;
//   const rateGroups = ratesResponse?.data ?? [];

//   /**
//    * ---------------------------------------------------------
//    * 1. Build:
//    *
//    * mappedRoomId -> rates[]
//    *
//    * Example:
//    *
//    * 1459488889 -> [
//    *   {
//    *      offerId: "...",
//    *      rateId: "...",
//    *      price: {...}
//    *   }
//    * ]
//    * ---------------------------------------------------------
//    */

//   const ratesByRoomId = new Map<string, any[]>();

//   for (const group of rateGroups) {
//     const offerId = group?.offerId ?? null;

//     for (const rate of group?.rates ?? []) {
//       if (
//         rate?.mappedRoomId === undefined ||
//         rate?.mappedRoomId === null
//       ) {
//         continue;
//       }

//       const roomId = String(rate.mappedRoomId);

//       const normalizedRate = {
//         /**
//          * IMPORTANT:
//          * This is what you send to prebook.
//          */
//         offerId,

//         /**
//          * Provider rate identifier.
//          * Do NOT use this for prebook.
//          */
//         rateId: rate.rateId ?? null,

//         occupancyNumber:
//           rate.occupancyNumber ?? null,

//         /**
//          * Live rate name.
//          *
//          * Example:
//          * "Executive King + pullout Suite"
//          */
//         name: rate.name ?? null,

//         maxOccupancy:
//           rate.maxOccupancy ?? null,

//         adultCount:
//           rate.adultCount ?? null,

//         childCount:
//           rate.childCount ?? null,

//         childrenAges:
//           rate.childrenAges ?? [],

//         /**
//          * Room Only, Breakfast, etc.
//          */
//         boardType:
//           rate.boardType ?? null,

//         boardName:
//           rate.boardName ?? null,

//         remarks:
//           rate.remarks ?? null,

//         priceType:
//           rate.priceType ?? null,

//         mappedRoomId:
//           rate.mappedRoomId,

//         /**
//          * Final display price.
//          */
//         price:
//           this.getRatePrice(rate),

//         /**
//          * Keep complete pricing information
//          * for checkout if needed.
//          */
//         retailRate:
//           rate.retailRate ?? null,

//         /**
//          * Cancellation information.
//          */
//         cancellationPolicies:
//           rate.cancellationPolicies ?? null,

//         refundable:
//           rate.cancellationPolicies?.refundableTag === 'RFN',

//         paymentTypes:
//           rate.paymentTypes ?? [],

//         perks:
//           rate.perks ?? [],

//         promotions:
//           rate.promotions ?? null,
//       };

//       if (!ratesByRoomId.has(roomId)) {
//         ratesByRoomId.set(roomId, []);
//       }

//       ratesByRoomId
//         .get(roomId)!
//         .push(normalizedRate);
//     }
//   }

//   /**
//    * ---------------------------------------------------------
//    * 2. Merge rates into the hotel content rooms
//    * ---------------------------------------------------------
//    */

//   const rooms = (hotel?.rooms ?? []).map(
//     (room: any) => {
//       const roomId = String(room.id);

//       const rates =
//         ratesByRoomId.get(roomId) ?? [];

//       /**
//        * Sort cheapest rate first.
//        */
//       rates.sort(
//         (a, b) =>
//           (a.price?.amount ?? Infinity) -
//           (b.price?.amount ?? Infinity),
//       );

//       const cheapestRate =
//         rates[0] ?? null;

//       return {
//         /**
//          * Static room information
//          */
//         id: room.id,

//         name:
//           room.roomName ??
//           room.name ??
//           null,

//         description:
//           room.description ??
//           null,

//         maxOccupancy:
//           room.maxOccupancy ??
//           null,

//         maxAdults:
//           room.maxAdults ??
//           null,

//         maxChildren:
//           room.maxChildren ??
//           null,

//         beds:
//           room.beds ??
//           room.bedTypes ??
//           [],

//         amenities:
//           room.amenities ??
//           room.roomAmenities ??
//           [],

//         roomSize:
//           this.normalizeRoomSize(room),

//         images:
//           this.normalizeRoomImages(room),

//         /**
//          * ---------------------------------------------------
//          * LIVE RATE INFORMATION
//          * ---------------------------------------------------
//          */
//         rates,

//         /**
//          * Convenient fields for your UI.
//          */
//         cheapestRate: cheapestRate
//           ? {
//               amount:
//                 cheapestRate.price?.amount ??
//                 null,

//               currency:
//                 cheapestRate.price?.currency ??
//                 null,
//             }
//           : null,

//         hasAvailability:
//           rates.length > 0,
//       };
//     },
//   );

//   /**
//    * ---------------------------------------------------------
//    * 3. Find rates that could not be matched to a room.
//    * ---------------------------------------------------------
//    */

//   const hotelRoomIds = new Set(
//     (hotel?.rooms ?? []).map(
//       (room: any) =>
//         String(room.id),
//     ),
//   );

//   const unmatchedRates: any[] = [];

//   for (
//     const [roomId, rates] of ratesByRoomId.entries()
//   ) {
//     if (!hotelRoomIds.has(roomId)) {
//       unmatchedRates.push(...rates);
//     }
//   }

//   /**
//    * ---------------------------------------------------------
//    * 4. Return final application response
//    * ---------------------------------------------------------
//    */

//   return {
//     id:
//       hotel?.id ??
//       null,

//     name:
//       hotel?.name ??
//       null,

//     description:
//       hotel?.description ??
//       null,

//     address:
//       hotel?.address ??
//       null,

//     city:
//       hotel?.city ??
//       null,

//     country:
//       hotel?.country ??
//       null,

//     rating:
//       hotel?.rating ??
//       null,

//     stars:
//       hotel?.stars ??
//       null,

//     images:
//       hotel?.images ??
//       [],

//     facilities:
//       hotel?.facilities ??
//       [],

//     rooms,

//     /**
//      * Only really needed while developing/debugging.
//      */
//     unmatchedRates,

//     rateSummary: {
//       totalRateGroups:
//         rateGroups.length,

//       totalRates:
//         rateGroups.reduce(
//           (
//             total: number,
//             group: any,
//           ) =>
//             total +
//             (group?.rates?.length ?? 0),
//           0,
//         ),

//       roomsWithRates:
//         rooms.filter(
//           (room: any) =>
//             room.rates.length > 0,
//         ).length,

//       roomsWithoutRates:
//         rooms.filter(
//           (room: any) =>
//             room.rates.length === 0,
//         ).length,
//     },
//   };
// }

private normalizeHotelDetailsTwo(
  hotelResponse: any,
  ratesResponse: any,
) {
  const hotel =
    hotelResponse?.data ?? hotelResponse;

  const rateGroups =
    ratesResponse?.data ?? [];

  const hotelRooms =
    hotel?.rooms ?? [];

  /**
   * ---------------------------------------------------------
   * Normalize words
   * ---------------------------------------------------------
   */
  const normalizeWords = (
    value: any,
  ): string[] => {
    if (!value) {
      return [];
    }

    return String(value)
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);
  };

  /**
   * Words that are not useful when identifying
   * the actual room type.
   */
  const ignoredWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'with',
    'room',
    'rooms',
    'bed',
    'beds',
    'king',
    'queen',
    'single',
    'double',
    'twin',
    'extra',
    'pullout',
    'level',
  ]);

  /**
   * ---------------------------------------------------------
   * Get meaningful words
   * ---------------------------------------------------------
   */
  const getMeaningfulWords = (
    name: any,
  ): string[] => {
    return normalizeWords(name).filter(
      (word) =>
        !ignoredWords.has(word),
    );
  };

  /**
   * ---------------------------------------------------------
   * Search for the best rate match for a room
   *
   * IMPORTANT:
   * We SEARCH the rates.
   *
   * We do NOT simply compare:
   *
   * roomName === rateName
   * ---------------------------------------------------------
   */
  const findMatchingRates = (
    roomName: string,
    rates: any[],
  ) => {
    const roomWords =
      getMeaningfulWords(roomName);

    if (!roomWords.length) {
      return [];
    }

    const matches = rates
      .map((rate) => {
        const rateWords =
          getMeaningfulWords(
            rate?.name,
          );

        if (!rateWords.length) {
          return null;
        }

        /**
         * Words shared by room and rate.
         */
        const matchedWords =
          roomWords.filter((word) =>
            rateWords.includes(word),
          );

        /**
         * How much of the room name was matched.
         */
        const roomMatchRatio =
          matchedWords.length /
          roomWords.length;

        /**
         * How much of the rate name was matched.
         */
        const rateMatchRatio =
          matchedWords.length /
          rateWords.length;

        /**
         * Give a score to the match.
         *
         * Room match is more important because
         * we are trying to identify which hotel
         * room the rate belongs to.
         */
        const score =
          roomMatchRatio * 0.7 +
          rateMatchRatio * 0.3;

        return {
          rate,
          score,
          matchedWords,
        };
      })
      .filter(Boolean)
      .sort(
        (a: any, b: any) =>
          b.score - a.score,
      );

    /**
     * Only accept a meaningful match.
     *
     * 0.5 means at least roughly half of
     * the meaningful room words matched.
     */
    return matches
      .filter(
        (match: any) =>
          match.score >= 0.5 &&
          match.matchedWords.length >= 1,
      )
      .map(
        (match: any) => match.rate,
      );
  };

  /**
   * ---------------------------------------------------------
   * Build all rates from LiteAPI
   * ---------------------------------------------------------
   */
  const normalizedRates: any[] =
    rateGroups.flatMap(
      (group: any) => {
        const offerId =
          group?.offerId ?? null;

        return (group?.rates ?? []).map(
          (rate: any) => ({
            offerId,

            rateId:
              rate?.rateId ?? null,

            occupancyNumber:
              rate?.occupancyNumber ??
              null,

            name:
              rate?.name ?? null,

            maxOccupancy:
              rate?.maxOccupancy ??
              null,

            adultCount:
              rate?.adultCount ??
              null,

            childCount:
              rate?.childCount ??
              null,

            childrenAges:
              rate?.childrenAges ?? [],

            boardType:
              rate?.boardType ?? null,

            boardName:
              rate?.boardName ?? null,

            remarks:
              rate?.remarks ?? null,

            priceType:
              rate?.priceType ?? null,

            /**
             * Keep it for reference/debugging,
             * but DO NOT use it for matching.
             */
            mappedRoomId:
              rate?.mappedRoomId ??
              null,

            price:
              this.getRatePrice(rate),

            retailRate:
              rate?.retailRate ??
              null,

            cancellationPolicies:
              rate?.cancellationPolicies ??
              null,

            refundable:
              rate
                ?.cancellationPolicies
                ?.refundableTag ===
              'RFN',

            paymentTypes:
              rate?.paymentTypes ?? [],

            perks:
              rate?.perks ?? [],

            promotions:
              rate?.promotions ??
              null,
          }),
        );
      },
    );

  /**
   * ---------------------------------------------------------
   * SEARCH + MAP
   * ---------------------------------------------------------
   *
   * For every hotel room:
   *
   *    search all available rates
   *    find matching rate names
   *    attach matching rates
   *
   * If nothing matches:
   *
   *    rates = []
   *
   * We do NOT force unmatched rates into
   * another room.
   * ---------------------------------------------------------
   */

  const rooms =
    hotelRooms.map((room: any) => {
      const roomName =
        room?.name ??
        room?.roomName ??
        '';

      const matchingRates =
        findMatchingRates(
          roomName,
          normalizedRates,
        );

      /**
       * Cheapest matching rate first.
       */
      matchingRates.sort(
        (a: any, b: any) =>
          (a.price?.amount ??
            Infinity) -
          (b.price?.amount ??
            Infinity),
      );

      const cheapestRate =
        matchingRates[0] ??
        null;

      return {
        id:
          room?.id ?? null,

        name:
          roomName || null,

        description:
          room?.description ?? null,

        maxOccupancy:
          room?.maxOccupancy ?? null,

        maxAdults:
          room?.maxAdults ?? null,

        maxChildren:
          room?.maxChildren ?? null,

        beds:
          room?.beds ??
          room?.bedTypes ??
          [],

        amenities:
          room?.amenities ??
          room?.roomAmenities ??
          [],

        roomSize:
          this.normalizeRoomSize(
            room,
          ),

        images:
          this.normalizeRoomImages(
            room,
          ),

        /**
         * Rates found by SEARCHING the
         * rate names.
         */
        rates:
          matchingRates,

        cheapestRate:
          cheapestRate
            ? {
                amount:
                  cheapestRate.price
                    ?.amount ?? null,

                currency:
                  cheapestRate.price
                    ?.currency ?? null,
              }
            : null,

        hasAvailability:
          matchingRates.length > 0,
      };
    });

  /**
   * ---------------------------------------------------------
   * Return hotel
   * ---------------------------------------------------------
   */

  return {
    id:
      hotel?.id ?? null,

    name:
      hotel?.name ?? null,

    description:
      hotel?.description ?? null,

    address:
      hotel?.address ?? null,

    city:
      hotel?.city ?? null,

    country:
      hotel?.country ?? null,

    rating:
      hotel?.rating ?? null,

    stars:
      hotel?.stars ?? null,

    images:
      hotel?.images ?? [],

    facilities:
      hotel?.facilities ?? [],

    rooms,

    rateSummary: {
      totalRateGroups:
        rateGroups.length,

      totalRates:
        normalizedRates.length,

      roomsWithRates:
        rooms.filter(
          (room: any) =>
            room.rates.length > 0,
        ).length,

      roomsWithoutRates:
        rooms.filter(
          (room: any) =>
            room.rates.length === 0,
        ).length,
    },
  };
}

    private normalizeHotelDetailsTwoo(
  hotelResponse: any,
  ratesResponse: any,
) {
  const hotel = hotelResponse?.data ?? hotelResponse;

  /**
   * LiteAPI /hotels/rates response:
   *
   * data = [
   *   {
   *     roomTypeId,
   *     offerId,
   *     rates: [
   *       {
   *         mappedRoomId,
   *         rateId,
   *         retailRate,
   *         ...
   *       }
   *     ]
   *   }
   * ]
   */

  const rateData = ratesResponse?.data ?? [];

  /**
   * Map:
   *
   * mappedRoomId -> rates[]
   */
  const ratesByRoomId = new Map<string, any[]>();

  for (const roomType of rateData) {
    const offerId = roomType?.offerId ?? null;

    for (const rate of roomType?.rates ?? []) {
      if (!rate?.mappedRoomId) {
        continue;
      }

      const roomId = String(rate.mappedRoomId);

      const normalizedRate = {
        offerId,

        rateId: rate.rateId ?? null,

        occupancyNumber: rate.occupancyNumber ?? null,

        name: rate.name ?? null,

        maxOccupancy: rate.maxOccupancy ?? null,

        adultCount: rate.adultCount ?? null,

        childCount: rate.childCount ?? null,

        childrenAges: rate.childrenAges ?? [],

        boardType: rate.boardType ?? null,

        boardName: rate.boardName ?? null,

        remarks: rate.remarks ?? null,

        priceType: rate.priceType ?? null,

        mappedRoomId: rate.mappedRoomId,

        price: this.getRatePrice(rate),

        retailRate: rate.retailRate ?? null,

        cancellationPolicies:
          rate.cancellationPolicies ?? null,

        refundable:
          rate.cancellationPolicies?.refundableTag === 'RFN',

        paymentTypes:
          rate.paymentTypes ?? [],

        perks:
          rate.perks ?? [],

        promotions:
          rate.promotions ?? null,
      };

      if (!ratesByRoomId.has(roomId)) {
        ratesByRoomId.set(roomId, []);
      }

      ratesByRoomId
        .get(roomId)!
        .push(normalizedRate);
    }
  }

  /**
   * Map LiteAPI hotel rooms to the live rates.
   */
  const rooms = (hotel?.rooms ?? []).map((room: any) => {
    const roomId = String(room.id);

    const rates =
      ratesByRoomId.get(roomId) ?? [];

    return {
      id: room.id,

      name:
        room.roomName ??
        room.name ??
        null,

      description:
        room.description ??
        null,

      maxOccupancy:
        room.maxOccupancy ??
        null,

      maxAdults:
        room.maxAdults ??
        null,

      maxChildren:
        room.maxChildren ??
        null,

      beds:
        room.beds ??
        room.bedTypes ??
        [],

      amenities:
        room.amenities ??
        room.roomAmenities ??
        [],

      roomSize: room.roomSize
        ? {
            value: room.roomSize.value,
            unit: room.roomSize.unit,
          }
        : room.roomSizeSquare
          ? {
              value: room.roomSizeSquare,
              unit: room.roomSizeUnit ?? 'm2',
            }
          : null,

      images: (
        room.images ??
        room.photos ??
        []
      ).map((photo: any) => ({
        url:
          photo.url ??
          photo.failoverPhoto ??
          null,

        description:
          photo.description ??
          photo.imageDescription ??
          null,

        main:
          photo.main ??
          photo.mainPhoto ??
          false,
      })),

      /**
       * THIS IS THE IMPORTANT PART
       */
      rates,
    };
  });

  /**
   * Rates whose mappedRoomId does not exist
   * in the hotel content rooms.
   */
  const matchedRoomIds = new Set(
    (hotel?.rooms ?? []).map(
      (room: any) => String(room.id),
    ),
  );

  const unmatchedRates: any[] = [];

  for (const [roomId, rates] of ratesByRoomId.entries()) {
    if (!matchedRoomIds.has(roomId)) {
      unmatchedRates.push(
        ...rates,
      );
    }
  }

  return {
    id: hotel?.id ?? null,

    name:
      hotel?.name ??
      null,

    description:
      hotel?.description ??
      null,

    address:
      hotel?.address ??
      null,

    city:
      hotel?.city ??
      null,

    country:
      hotel?.country ??
      null,

    rating:
      hotel?.rating ??
      null,

    stars:
      hotel?.stars ??
      null,

    images:
      hotel?.images ??
      [],

    facilities:
      hotel?.facilities ??
      [],

    rooms,

    /**
     * Useful while debugging LiteAPI mappings.
     */
    unmatchedRates,

    /**
     * Useful for debugging.
     */
    rateSummary: {
      rateGroups: rateData.length,

      totalRates: rateData.reduce(
        (total: number, group: any) =>
          total + (group?.rates?.length ?? 0),
        0,
      ),

      matchedRoomIds: Array.from(
        new Set(
          rateData.flatMap(
            (group: any) =>
              (group?.rates ?? [])
                .filter(
                  (rate: any) =>
                    rate?.mappedRoomId,
                )
                .map(
                  (rate: any) =>
                    String(
                      rate.mappedRoomId,
                    ),
                ),
          ),
        ),
      ),
    },
  };
}

    private getRatePrice(rate: any) {
    const total = rate.retailRate?.total?.[0];

    if (!total) {
        return null;
    }

    return {
        amount: total.amount,
        currency: total.currency,
    };
    }

    private normalizeRoomSize(room: any) {
    if (room?.roomSize) {
        return {
        value: room.roomSize.value,
        unit: room.roomSize.unit,
        };
    }

    if (room?.roomSizeSquare) {
        return {
        value: room.roomSizeSquare,
        unit: room.roomSizeUnit ?? 'm2',
        };
    }

    return null;
    }

        private normalizeRoomImages(room: any) {
    return (
        room?.images ??
        room?.photos ??
        []
    ).map((photo: any) => ({
        url:
        photo?.url ??
        photo?.failoverPhoto ??
        null,

        description:
        photo?.description ??
        photo?.imageDescription ??
        null,

        main:
        photo?.main ??
        photo?.mainPhoto ??
        false,
    }));
    }





    private normalizeHotelsMe(response: any) {
  const hotels = response.hotels ?? [];
  const rates = response.data ?? [];

  return hotels.map((hotel: any) => {
    const hotelId =
      hotel.id ??
      hotel.hotelId;

    const hotelRates =
      rates.find(
        (item: any) =>
          item.hotelId === hotelId,
      );

    const roomTypes =
      hotelRates?.roomTypes ?? [];

    return {
      hotelId,

      name:
        hotel.name ?? null,

      image:
        hotel.main_photo ?? null,

      address:
        hotel.address ?? null,

      city:
        hotel.city ?? null,

      country:
        hotel.country ?? 'CA',

      rating:
        hotel.rating ?? null,

      stars:
        hotel.starRating ?? null,

      rooms:
        roomTypes.map(
          (roomType: any) => ({
            roomTypeId:
              roomType.roomTypeId ?? null,

            offerId:
              roomType.offerId,

            name:
              roomType.name ?? null,

            rates:
              (roomType.rates ?? []).map(
                (rate: any) => ({
                  rateId:
                    rate.rateId ?? null,

                  occupancyNumber:
                    rate.occupancyNumber ?? null,

                  name:
                    rate.name ?? null,

                  maxOccupancy:
                    rate.maxOccupancy ?? null,

                  adultCount:
                    rate.adultCount ?? null,

                  childCount:
                    rate.childCount ?? null,

                  childrenAges:
                    rate.childrenAges ?? [],

                  boardType:
                    rate.boardType ?? null,

                  boardName:
                    rate.boardName ?? null,

                  price:
                    rate.retailRate
                      ?.total?.[0]
                      ? {
                          amount:
                            rate.retailRate.total[0]
                              .amount,

                          currency:
                            rate.retailRate.total[0]
                              .currency,
                        }
                      : null,

                  suggestedSellingPrice:
                    rate.retailRate
                      ?.suggestedSellingPrice?.[0]
                      ? {
                          amount:
                            rate.retailRate
                              .suggestedSellingPrice[0]
                              .amount,

                          currency:
                            rate.retailRate
                              .suggestedSellingPrice[0]
                              .currency,
                        }
                      : null,

                  taxesAndFees:
                    rate.retailRate
                      ?.taxesAndFees ?? [],

                  cancellation: {
                    refundable:
                      rate.cancellationPolicies
                        ?.refundableTag === 'RFN',

                    policies:
                      rate.cancellationPolicies
                        ?.cancelPolicyInfos ?? [],
                  },

                  paymentTypes:
                    rate.paymentTypes ?? [],

                  perks:
                    rate.perks ?? [],

                  promotions:
                    rate.promotions ?? [],

                  remarks:
                    rate.remarks ?? null,
                }),
              ),
          }),
        ),
    };
  });
}

}

export const hotelService =
  new HotelService();
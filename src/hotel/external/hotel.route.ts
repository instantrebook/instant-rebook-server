// src/features/hotel/hotel.route.ts

import {
  Router,
} from 'express';

import {
  searchHotels,
  prebookHotel,
  bookHotel,
  getHotelBooking,
  cancelHotelBooking,
  getHotelFacilities,
  getHotelDetails,
  // getHotelDetailsTwo,
  getHotelRate,
  sendbookinglink,
  getHotelCities,
} from './hotel.controller';

const router =
  Router();

  router.get(
  '/facilities',
  getHotelFacilities,
);

/**
 * Get cities by country.
 */
router.get(
  '/cities',
  getHotelCities,
);

/**
 * Public hotel search.
 */
router.get(
  '/search',
  searchHotels,
);

router.get(
  '/hotel-deatil/:hotelId',
  getHotelDetails,
);

// router.get(
//   '/hotel-deatil-two/:hotelId',
//   getHotelDetailsTwo,
// );

router.get(
  '/hotel-rates/:hotelId',
  getHotelRate,
);

/**
 * Validate current rate
 * and create prebook session.
 */
router.post(
  '/prebook',
  prebookHotel,
);

router.post(
  '/send-link',
  sendbookinglink,
);

/**
 * Complete booking.
 */
router.post(
  '/book',
  bookHotel,
);

/**
 * Retrieve booking.
 */
router.get(
  '/bookings/:bookingId',
  getHotelBooking,
);

/**
 * Cancel booking.
 */
router.put(
  '/bookings/:bookingId/cancel',
  cancelHotelBooking,
);

export default router;
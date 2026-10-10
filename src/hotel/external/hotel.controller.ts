// src/features/hotel/hotel.controller.ts

import {
  Request,
  Response,
  NextFunction,
} from 'express';

import {
  hotelService,
} from './hotel.service';

import {
  hotelBookSchema,
  hotelPrebookSchema,
  hotelSearchSchema,
} from './hotel.validation';

export const getHotelFacilities =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result =
        await hotelService.getFacilities();

        return res.status(200).json({
        success: true,

        data: result,
        });
    } catch (error) {
        next(error);
    }
};


export const getHotelCities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const countryCode =
      String(
        req.query.countryCode ?? 'CA',
      ).trim().toUpperCase();

    const search =
      req.query.search === undefined
        ? undefined
        : String(req.query.search);

    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return res.status(400).json({
        success: false,
        message:
          'A valid two-letter countryCode is required',
      });
    }

    const result =
      await hotelService.getCities(
        countryCode,
        search,
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const searchHotels = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query =
      hotelSearchSchema.parse(
        req.query,
      );

    const result =
      await hotelService.search(
        query,
      );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelDetails =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const hotelId =
        req.params.hotelId;

      if (!hotelId) {
        return res.status(400).json({
          success: false,
          message:
            'Hotel ID is required',
        });
      }

      const result =
        await hotelService.getHotelDetails(
          hotelId,
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

// export const getHotelDetailsTwo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const hotelId = req.params.hotelId;

//     if (!hotelId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Hotel ID is required',
//       });
//     }

//     const {
//       checkIn,
//       checkOut,
//       adults,
//       children,
//       rooms,
//       guestNationality,
//     } = req.query;

//     if (!checkIn || !checkOut) {
//       return res.status(400).json({
//         success: false,
//         message: 'checkIn and checkOut are required',
//       });
//     }

//     const result = await hotelService.getHotelDetailsTwo(
//       hotelId,
//       {
//         checkIn: String(checkIn),
//         checkOut: String(checkOut),

//         adults: Number(adults ?? 2),

//         children: children
//           ? String(children)
//               .split(',')
//               .map(Number)
//           : [],

//         rooms: Number(rooms ?? 1),

//         guestNationality:
//           String(guestNationality ?? 'CA'),
//       },
//     );

//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getHotelRate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotelId = req.params.hotelId;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required',
      });
    }

    const {
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      guestNationality,
    } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'checkIn and checkOut are required',
      });
    }

    const result = await hotelService.getHotelRate(
      hotelId,
      {
        checkIn: String(checkIn),
        checkOut: String(checkOut),

        adults: Number(adults ?? 2),

        children: children
          ? String(children)
              .split(',')
              .map(Number)
          : [],

        rooms: Number(rooms ?? 1),

        guestNationality:
          String(guestNationality ?? 'CA'),
      },
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const prebookHotel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body =
      hotelPrebookSchema.parse(
        req.body,
      );

    const result =
      await hotelService.prebook(
        body,
      );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const sendbookinglink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {email, link, } = req.body;

    const result = await hotelService.sendLink(email, link);

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const bookHotel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body =
      hotelBookSchema.parse(
        req.body,
      );

    const result =
      await hotelService.book(
        body,
      );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId =
      req.params.bookingId;

    if (!bookingId) {
      return res.status(400).json({
        success: false,

        message:
          'Booking ID is required',
      });
    }

    const result =
      await hotelService.getBooking(
        bookingId,
      );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelHotelBooking =
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bookingId =
        req.params.bookingId;

      if (!bookingId) {
        return res.status(400).json({
          success: false,

          message:
            'Booking ID is required',
        });
      }

      const result =
        await hotelService.cancelBooking(
          bookingId,
        );

      return res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
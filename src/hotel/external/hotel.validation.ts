// src/features/hotel/hotel.validation.ts

import { z } from 'zod';

const dateRegex =
  /^\d{4}-\d{2}-\d{2}$/;

export const hotelSearchSchema =
  z.object({
    city: z
      .string()
      .trim()
      .min(2)
      .max(100),

    checkIn: z
      .string()
      .regex(
        dateRegex,
        'checkIn must be YYYY-MM-DD',
      ),

    checkOut: z
      .string()
      .regex(
        dateRegex,
        'checkOut must be YYYY-MM-DD',
      ),

    adults: z.coerce
      .number()
      .int()
      .min(1)
      .max(20),

    children: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];

        return value
          .split(',')
          .map(Number)
          .filter(
            (age) =>
              Number.isInteger(age) &&
              age >= 0 &&
              age <= 17,
          );
      }),

    rooms: z.coerce
      .number()
      .int()
      .min(1)
      .max(10)
      .default(1),

    guestNationality: z
      .string()
      .length(2)
      .regex(/^[A-Za-z]{2}$/)
      .default('NG'),

    minRating: z
      .coerce
      .number()
      .min(0)
      .max(5)
      .optional(),

    stars: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];

        return value
          .split(',')
          .map(Number)
          .filter(
            (star) =>
              star >= 0 &&
              star <= 5,
          );
      }),

    facilities: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];

        return value
          .split(',')
          .map(Number)
          .filter(Number.isInteger);
      }),

    strictFacilityFiltering: z
    .enum(['true', 'false'])
    .optional()
    .transform(
        (value) => value === 'true',
    ),

    refundableOnly: z
      .enum(['true', 'false'])
      .optional()
      .transform(
        (value) => value === 'true',
      ),

    boardType: z
      .string()
      .optional(),

    bedTypes: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];

        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }),

    minReviewsCount: z
      .coerce
      .number()
      .int()
      .min(0)
      .optional(),

    sort: z
      .enum([
        'recommended',
        'price_low',
        'price_high',
      ])
      .default('recommended'),

    page: z
      .coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z
      .coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    sessionId: z
      .string()
      .max(100)
      .optional(),
  });

export const hotelPrebookSchema =
  z.object({
    offerId: z
      .string()
      .min(1),

    usePaymentSdk: z
      .boolean()
      .default(false),
  });

export const hotelBookSchema =
  z.object({
    prebookId: z
      .string()
      .min(1),

    clientReference: z
      .string()
      .max(100)
      .optional(),

    holder: z.object({
      firstName: z
        .string()
        .trim()
        .min(1)
        .max(100),

      lastName: z
        .string()
        .trim()
        .min(1)
        .max(100),

      email: z
        .string()
        .email(),

      phone: z
        .string()
        .max(30)
        .optional(),
    }),

    guests: z
      .array(
        z.object({
          occupancyNumber: z
            .number()
            .int()
            .min(1),

          firstName: z
            .string()
            .trim()
            .min(1)
            .max(100),

          lastName: z
            .string()
            .trim()
            .min(1)
            .max(100),

          email: z
            .string()
            .email(),

          phone: z
            .string()
            .max(30)
            .optional(),

          remarks: z
            .string()
            .max(500)
            .optional(),
        }),
      )
      .min(1),

    payment: z.discriminatedUnion(
      'method',
      [
        z.object({
          method: z.literal(
            'ACC_CREDIT_CARD',
          ),
        }),

        z.object({
          method: z.literal(
            'TRANSACTION_ID',
          ),

          transactionId: z
            .string()
            .min(1),
        }),

        z.object({
          method: z.literal('WALLET'),
        }),

        z.object({
          method: z.literal('CREDIT'),
        }),
      ],
    ),
  });
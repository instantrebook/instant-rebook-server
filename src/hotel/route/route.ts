const express = require("express");
const router = express.Router();

import { requestValidation } from "./../middleware/request.validation.middleware";

import { hotelForgotPasswordController, hotelResetPasswordController, hotelSignInController, hotelSignUpController, searchHotelPartnerController } from "../controller/auth.controller";
import { changeRoomImageController, getAllRoomController, getSingleRoomController, getTotalRoomByStatusController, searchForRoomController, userAddRoomController, userEditRoomController, userRomoveRoomController } from "../controller/room.controller";
import { checkHotelRole } from "../middleware/role.checker.middleware";
import { checkInVerificationController, comfirmArrivalController, createCustomerBookingController, customersController, expectedArrivalController, noShowController, placementRateController, totalFailBookingsController, totalGuestExpectancyController, totalGuestRebookedController } from "../controller/customer.controller";
import { hotelProfileController, hotelUpdateProfileController } from "../controller/setting.controller";

router.post("/create-account", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, hotelSignUpController ); 
router.post("/login", requestValidation.validateLoginParams, requestValidation.validateFormData, hotelSignInController );
router.post("/forgot-password", requestValidation.validateForgotPasswordParams, requestValidation.validateFormData, hotelForgotPasswordController ); 
router.post("/reset-password", requestValidation.validateResetPasswordParams, requestValidation.validateFormData, hotelResetPasswordController );

router.get("/hotel-partner-search",  searchHotelPartnerController );

// router.post("/add-room", checkHotelRole, singleFileUpload('picture', ['image']), requestValidation.validateAddRoomParams, requestValidation.validateFormData, userAddRoomController );
router.get("/rooms", checkHotelRole, getAllRoomController );
router.get("/rooms-by-status", checkHotelRole, requestValidation.validateGetRoomByStatusParams, requestValidation.validateFormData, getTotalRoomByStatusController );

router.post("/edit-room/:roomId", checkHotelRole, requestValidation.validateAddRoomParams, requestValidation.validateFormData,  userEditRoomController );
// router.post("/change-room-picture/:roomId", checkHotelRole, singleFileUpload('picture', ['image']), changeRoomImageController );
router.post("/remove-room/:roomId", checkHotelRole, userRomoveRoomController );

router.get("/search-room", checkHotelRole, searchForRoomController );
router.get("/rooms/:roomId", checkHotelRole, getSingleRoomController);

router.post("/booking", checkHotelRole, requestValidation.validateBookRoomParams, requestValidation.validateFormData, createCustomerBookingController );

router.get("/expected-arrival", checkHotelRole, expectedArrivalController );
router.post("/check-in-verification", checkHotelRole, requestValidation.validateCheckInParams, requestValidation.validateFormData, checkInVerificationController );
router.post("/comfirm-arrival", checkHotelRole, requestValidation.validateCustomerIdParams, requestValidation.validateFormData, comfirmArrivalController );
router.post("/no-show", checkHotelRole, requestValidation.validateCustomerIdParams, requestValidation.validateFormData, noShowController );
router.get("/customers", checkHotelRole, customersController );

router.get("/guest-rebooked", checkHotelRole, totalGuestRebookedController );
router.get("/fail-booking", checkHotelRole, totalFailBookingsController );
router.get("/guest-expectancy", checkHotelRole, totalGuestExpectancyController );
router.get("/placement-rate", checkHotelRole, placementRateController );

router.get("/profile", checkHotelRole, hotelProfileController );
router.post("/profile-update", checkHotelRole, requestValidation.validateUpdateProfileParams, requestValidation.validateFormData, hotelUpdateProfileController );


export default router;
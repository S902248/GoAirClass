# Frontend API Calls

Here is the list of all the API endpoints called from the frontend, categorized by the file they are located in:

## `api/adminApi.js`
- `POST /auth/admin-login` (Admin login endpoint)
- `POST /auth/admin-request` (Request admin access endpoint)
- `GET /auth/dashboard-stats` (Dashboard statistics)
- `GET /auth/admin-requests` (Admin access requests)
- `GET /auth/admin-notifications` (Admin notifications)
- `PUT /auth/update-request-status` (Update request status)
- `GET /auth/admins` (List admins)
- `GET /operators/all` (List all operators)
- `POST /operators/create` (Create new operator)
- `DELETE /operators/:operatorId` (Delete operator)

## `api/bookingApi.js`
- `POST /bookings/create` (Create a new booking)
- `GET /bookings/user` (Get current user's bookings)
- `GET /bookings/:bookingId` (Get specific booking details)
- `POST /bookings/:bookingId/cancel` (Cancel a booking)

## `api/busApi.js`
- `GET /bus/search` (Search for buses based on parameters)
- `GET /bus/:busId` (Get specific bus details)
- `GET /bus/all` (Get all buses)

## `api/busPaymentApi.js`
- `POST /payments/create-order` (Create Razorpay payment order)
- `POST /payments/verify` (Verify Razorpay payment)
- `POST /bookings/create` (Create booking after payment)
- `POST /coupons/validate` (Validate a coupon code)

## `api/cityApi.js`
- `GET /cities/search?q=:query` (Search for cities)

## `api/operatorDashboardApi.js`
- `GET /buses/my-buses` (Get operator's buses)
- `POST /buses/create` (Create new bus for operator)
- `DELETE /buses/:busId` (Delete a bus)
- `GET /routes/all` (Get all routes)
- `POST /routes/create` (Create a new route)
- `DELETE /routes/:routeId` (Delete a route)
- `GET /schedules/bus/:busId` (Get schedules for a specific bus)
- `GET /schedules/my-schedules` (Get operator's schedules)
- `POST /schedules/create` (Create a new schedule)
- `DELETE /schedules/:scheduleId` (Delete a schedule)
- `GET /schedules/search?from=:from&to=:to&date=:date` (Search schedules)
- `GET /coupons/my-coupons` (Get operator's coupons)
- `GET /bookings/my-bookings` (Get operator's bookings)
- `POST /operators/login` (Operator login)

## `api/userApi.js`
- `POST /users/register` (Register a new user)
- `POST /auth/get-otp` (Request OTP for login/verification)
- `POST /auth/verify-otp` (Verify OTP)



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/hotelApi';

export const fetchAllHotelBookings = createAsyncThunk('hotelBookings/fetchAll', async () => {
    const data = await api.getAllHotelBookings();
    return data.bookings || [];
});

const hotelBookingSlice = createSlice({
    name: 'hotelBookings',
    initialState: { bookings: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllHotelBookings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllHotelBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
            .addCase(fetchAllHotelBookings.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
    },
});

export default hotelBookingSlice.reducer;

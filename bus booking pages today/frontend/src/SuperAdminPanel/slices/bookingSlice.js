import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBookings } from '../../api/adminApi';

export const fetchAllBookings = createAsyncThunk(
    'bookings/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllBookings();
            // The backend returns the array directly based on router.get('/') in bookingRoutes.js
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch bookings');
        }
    }
);

const initialState = {
    bookings: [],
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearBookingError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchAllBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;

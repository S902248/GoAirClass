import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/hotelApi';

export const fetchAllHotels = createAsyncThunk('hotels/fetchAll', async () => {
    const data = await api.getAllHotels();
    return data.hotels || [];
});

export const approveHotelThunk = createAsyncThunk('hotels/approve', async (id, { dispatch }) => {
    await api.approveHotel(id);
    dispatch(fetchAllHotels());
});

export const rejectHotelThunk = createAsyncThunk('hotels/reject', async ({ id, reason }, { dispatch }) => {
    await api.rejectHotel(id, reason);
    dispatch(fetchAllHotels());
});

export const blockHotelThunk = createAsyncThunk('hotels/block', async (id, { dispatch }) => {
    await api.blockHotel(id);
    dispatch(fetchAllHotels());
});

export const unblockHotelThunk = createAsyncThunk('hotels/unblock', async (id, { dispatch }) => {
    await api.unblockHotel(id);
    dispatch(fetchAllHotels());
});

export const deleteHotelThunk = createAsyncThunk('hotels/delete', async (id, { dispatch }) => {
    await api.deleteHotel(id);
    dispatch(fetchAllHotels());
});

const hotelSlice = createSlice({
    name: 'hotels',
    initialState: {
        hotels: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllHotels.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllHotels.fulfilled, (state, action) => { state.loading = false; state.hotels = action.payload; })
            .addCase(fetchAllHotels.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
    },
});

export default hotelSlice.reducer;

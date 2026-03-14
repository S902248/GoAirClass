import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/hotelApi';

export const fetchAllHotelOffers = createAsyncThunk('hotelOffers/fetchAll', async () => {
    const data = await api.getAllHotelOffers();
    return data.offers || [];
});

export const createHotelOfferThunk = createAsyncThunk('hotelOffers/create', async (data, { dispatch }) => {
    await api.createHotelOffer(data);
    dispatch(fetchAllHotelOffers());
});

export const updateHotelOfferThunk = createAsyncThunk('hotelOffers/update', async ({ id, data }, { dispatch }) => {
    await api.updateHotelOffer(id, data);
    dispatch(fetchAllHotelOffers());
});

export const deleteHotelOfferThunk = createAsyncThunk('hotelOffers/delete', async (id, { dispatch }) => {
    await api.deleteHotelOffer(id);
    dispatch(fetchAllHotelOffers());
});

const hotelOfferSlice = createSlice({
    name: 'hotelOffers',
    initialState: { offers: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllHotelOffers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllHotelOffers.fulfilled, (state, action) => { state.loading = false; state.offers = action.payload; })
            .addCase(fetchAllHotelOffers.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
    },
});

export default hotelOfferSlice.reducer;

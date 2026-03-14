import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../api/adminApi';

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getDashboardStats();
            return data.stats;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch stats');
        }
    }
);

const initialState = {
    isSidebarOpen: true,
    isDarkMode: false,
    stats: {
        revenue: 1254300,
        bookings: 8540,
        users: 12400,
    },
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
            state.stats = action.payload;
        });
    },
});

export const { toggleSidebar, setSidebarOpen, toggleDarkMode } = dashboardSlice.actions;
export default dashboardSlice.reducer;

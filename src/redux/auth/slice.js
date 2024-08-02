import { createSlice } from '@reduxjs/toolkit';
import { logIn } from './operations';

const authInitialState = {
    user: {},
    token: null,
    isLoggedIn: false,
	isRefreshing: false,
	error: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState: authInitialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(logIn.fulfilled, (state, action) => {
				state.token = action.payload.token || null;
				state.isLoggedIn = true;
				state.isRefreshing = false;
			})
			.addCase(logIn.pending, (state) => {
				state.isRefreshing = true;
			})
			.addCase(logIn.rejected, (state) => {
                state.isRefreshing = false;
            });
	},
});

export const authReducer = authSlice.reducer;
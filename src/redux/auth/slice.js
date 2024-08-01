import { createSlice } from '@reduxjs/toolkit';
import { logIn } from './operations';

const authInitialState = {
    user: { email: null },
    token: null,
    isLoggedIn: false,
    isRefreshing: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState: authInitialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(logIn.fulfilled, (state, action) => {
				state.user = { email: null };
				state.token = action.payload.user;
				state.isLoggedIn = true;
			})
	},
});

export const authReducer = authSlice.reducer;
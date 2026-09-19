import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { SessionHydratedPayload, SessionState } from "@/src/features/authentication/types/authentication.types";
import type { WalletUser } from "@/src/types/wallet.types";

const initialState: SessionState = {
  hydrated: false,
  isAuthenticated: false,
  user: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionHydrated(state, action: PayloadAction<SessionHydratedPayload>) {
      state.hydrated = true;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    sessionStarted(state, action: PayloadAction<WalletUser>) {
      state.hydrated = true;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    sessionCleared(state) {
      state.hydrated = true;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { sessionCleared, sessionHydrated, sessionStarted } = sessionSlice.actions;
export const authenticationReducer = sessionSlice.reducer;
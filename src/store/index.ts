import { configureStore } from "@reduxjs/toolkit";

import { authenticationReducer } from "@/src/features/authentication/store/authentication.slice";
import { transfersReducer } from "@/src/features/transfers/store/transfers.slice";

export const store = configureStore({
  reducer: {
    session: authenticationReducer,
    transfer: transfersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { TransferDraft, TransferError, TransferReceipt, TransferState } from "@/src/features/transfers/types/transfers.types";

const initialState: TransferState = {
  draft: null,
  latestReceipt: null,
  latestError: null,
};

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    draftSaved(state, action: PayloadAction<TransferDraft>) {
      state.draft = action.payload;
      state.latestError = null;
    },
    transferSucceeded(state, action: PayloadAction<TransferReceipt>) {
      state.latestReceipt = action.payload;
      state.latestError = null;
    },
    transferFailed(
      state,
      action: PayloadAction<TransferError>,
    ) {
      state.latestError = action.payload;
      state.latestReceipt = null;
    },
    transferFlowReset(state) {
      state.draft = null;
      state.latestReceipt = null;
      state.latestError = null;
    },
  },
});

export const { draftSaved, transferFailed, transferFlowReset, transferSucceeded } = transferSlice.actions;
export const transfersReducer = transferSlice.reducer;
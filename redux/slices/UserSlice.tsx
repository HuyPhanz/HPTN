import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAccountInfo} from "../../types";

const initialState: IAccountInfo = {};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (_, action: PayloadAction<IAccountInfo>) => {
      return action.payload;
    },
    logoutUser: () => {
      return initialState;
    },
    updateSyncData: (
      state,
      action: PayloadAction<{slug: string; items: any}>
    ) => {
      return {
        ...state,
        syncData: {
          ...state.syncData,
          [action.payload.slug]: action.payload.items,
        },
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {loginUser, logoutUser, updateSyncData} = UserSlice.actions;

export default UserSlice.reducer;

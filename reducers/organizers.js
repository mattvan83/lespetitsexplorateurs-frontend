import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const organizersSlice = createSlice({
  name: "organizers",
  initialState,
  reducers: {
    loadOrganizers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { loadOrganizers } = organizersSlice.actions;
export default organizersSlice.reducer;

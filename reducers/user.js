import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    firstName: null,
    latitude: null,
    longitude: null,
    activities: [],
    filters: {
      categoryFilter: [],
      dateFilter: [],
      momentFilter: [],
      ageFilter: [],
      priceFilter: null,
      locationFilter: null,
      scopeFilter: null
    }
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.latitude = null;
      state.value.longitude = null;
    },
    addCurrentLocation: (state, action) => {
      state.value.latitude = action.payload.latitude;
      state.value.longitude = action.payload.longitude;
    },
    importActivities: (state, action) => {
      state.value.activities = action.payload;
    },
    addPreferences: (state, action) => {

    },
    deletePreferences: (state, action) => {
      
    }
  },
});

export const { login, logout, addCurrentLocation, importActivities } =
  userSlice.actions;
export default userSlice.reducer;

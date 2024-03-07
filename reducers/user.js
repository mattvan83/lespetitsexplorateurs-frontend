import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    cityName: null,
    latitude: null,
    longitude: null,
    activities: [],
    filters: {
      categoryFilter: [],
      dateFilter: [],
      momentFilter: [],
      ageFilter: [],
      priceFilter: null,
      cityFilter: null,
      latitudeFilter: null,
      longitudeFilter: null,
      scopeFilter: null,
    },
    preferences: {
      agePreference: [],
      cityPreference: null,
      latitudePreference: null,
      longitudePreference: null,
      scopePreference: 50,
    },
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
    addCurrentCity: (state, action) => {
      state.value.cityName = action.payload;
    },
    importActivities: (state, action) => {
      state.value.activities = action.payload;
    },
    setFilters: (state, action) => {
      state.value.filters.categoryFilter = action.payload.categoryFilter;
      state.value.filters.dateFilter = action.payload.dateFilter;
      state.value.filters.momentFilter = action.payload.momentFilter;
      state.value.filters.ageFilter = action.payload.ageFilter;
      state.value.filters.priceFilter = action.payload.priceFilter;
      state.value.filters.cityFilter = action.payload.cityFilter;
      state.value.filters.longitudeFilter = action.payload.longitudeFilter;
      state.value.filters.latitudeFilter = action.payload.latitudeFilter;
      state.value.filters.scopeFilter = action.payload.scopeFilter;
    },
    setLocationFilters: (state, action) => {
      state.value.filters.cityFilter = action.payload.cityFilter;
      state.value.filters.longitudeFilter = action.payload.longitudeFilter;
      state.value.filters.latitudeFilter = action.payload.latitudeFilter;
    },
    resetFilters: (state, action) => {
      state.value.filters.categoryFilter = [];
      state.value.filters.dateFilter = [];
      state.value.filters.momentFilter = [];
      state.value.filters.ageFilter = [];
      state.value.filters.priceFilter = null;
      state.value.filters.cityFilter = null;
      state.value.filters.longitudeFilter = null;
      state.value.filters.latitudeFilter = null;
      state.value.filters.scopeFilter = null;
    },
    setPreferences: (state, action) => {
      state.value.preferences.agePreference = action.payload.agePreference;
      state.value.preferences.cityPreference = action.payload.cityPreference;
      state.value.preferences.latitudePreference =
        action.payload.latitudePreference;
      state.value.preferences.longitudePreference =
        action.payload.longitudePreference;
      state.value.preferences.scopePreference = action.payload.scopePreference;
    },
    resetPreferences: (state, action) => {
      state.value.preferences.agePreference = [];
      state.value.preferences.cityPreference = null;
      state.value.preferences.latitudePreference = null;
      state.value.preferences.longitudePreference = null;
      state.value.preferences.scopePreference = null;
    },
  },
});

export const {
  login,
  logout,
  addCurrentLocation,
  addCurrentCity,
  importActivities,
  setFilters,
  setLocationFilters,
  resetFilters,
  setPreferences,
  resetPreferences,
} = userSlice.actions;
export default userSlice.reducer;

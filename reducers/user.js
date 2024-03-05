import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
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
      scopeFilter: null,
    },
    preferences: {
      agePreference: [],
      locationPreference: null,
      scopePreference: null,
    },
    citySearched: {
      cityName: null,
      postalCode: null,
      department: null,
      region: null,
      latitude: null,
      longitude: null,
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
    importActivities: (state, action) => {
      state.value.activities = action.payload;
    },
    setFilters: (state, action) => {
      state.value.filters.categoryFilter = action.payload.categoryFilter;
      state.value.filters.dateFilter = action.payload.dateFilter;
      state.value.filters.momentFilter = action.payload.momentFilter;
      state.value.filters.ageFilter = action.payload.ageFilter;
      state.value.filters.priceFilter = action.payload.priceFilter;
      state.value.filters.locationFilter = action.payload.locationFilter;
      state.value.filters.scopeFilter = action.payload.scopeFilter;
    },
    resetFilters: (state, action) => {
      state.value.filters.categoryFilter = [];
      state.value.filters.dateFilter = [];
      state.value.filters.momentFilter = [];
      state.value.filters.ageFilter = [];
      state.value.filters.priceFilter = null;
      state.value.filters.locationFilter = null;
      state.value.filters.scopeFilter = null;
    },
    setPreferences: (state, action) => {
      state.value.preferences.agePreference = action.payload.agePreference;
      state.value.preferences.locationPreference =
        action.payload.locationPreference;
      state.value.preferences.scopePreference = action.payload.scopePreference;
    },
    resetPreferences: (state, action) => {
      state.value.preferences.agePreference = [];
      state.value.preferences.locationPreference = null;
      state.value.preferences.scopePreference = null;
    },
    setCitySearched: (state, action) => {
      state.value.citySearched.cityName = action.payload.cityName;
      state.value.citySearched.postalCode = action.payload.postalCode;
      state.value.citySearched.department = action.payload.department;
      state.value.citySearched.region = action.payload.region;
      state.value.citySearched.latitude = action.payload.coords[1];
      state.value.citySearched.longitude = action.payload.coords[0];
    },
    resetCitySearched: (state, action) => {
      state.value.citySearched.cityName = null;
      state.value.citySearched.postalCode = null;
      state.value.citySearched.department = null;
      state.value.citySearched.region = null;
      state.value.citySearched.latitude = null;
      state.value.citySearched.longitude = null;
    },
  },
});

export const {
  login,
  logout,
  addCurrentLocation,
  importActivities,
  setFilters,
  resetFilters,
  setPreferences,
  resetPreferences,
  setCitySearched,
  resetCitySearched,
} = userSlice.actions;
export default userSlice.reducer;

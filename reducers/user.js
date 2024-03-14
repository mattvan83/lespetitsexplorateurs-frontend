import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    cityName: null,
    latitude: -200,
    longitude: -200,
    activities: [],
    userActivities: [],
    favoriteActivities: [],
    filters: {
      categoryFilter: [],
      dateFilter: [],
      momentFilter: [],
      ageFilter: [],
      priceFilter: 50,
      cityFilter: null,
      latitudeFilter: -200,
      longitudeFilter: -200,
      scopeFilter: 50,
    },
    preferences: {
      agePreference: [],
      cityPreference: null,
      latitudePreference: -200,
      longitudePreference: -200,
      scopePreference: 50,
    },
    errorMsg: null,
    errorOrganizersMsg: null,
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
      state.value.latitude = -200;
      state.value.longitude = -200;
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
    setCategoryFilters: (state, action) => {
      state.value.filters.categoryFilter = action.payload;
    },
    setLocationFilters: (state, action) => {
      state.value.filters.cityFilter = action.payload.cityFilter;
      state.value.filters.longitudeFilter = action.payload.longitudeFilter;
      state.value.filters.latitudeFilter = action.payload.latitudeFilter;
    },
    setPreferencesFilters: (state, action) => {
      state.value.filters.ageFilter = action.payload.agePreference;
      state.value.filters.cityFilter = action.payload.cityPreference;
      state.value.filters.latitudeFilter = action.payload.latitudePreference;
      state.value.filters.longitudeFilter = action.payload.longitudePreference;
      state.value.filters.scopeFilter = action.payload.scopePreference;
    },
    resetFilters: (state, action) => {
      state.value.filters.categoryFilter = [];
      state.value.filters.dateFilter = [];
      state.value.filters.momentFilter = [];
      state.value.filters.ageFilter = [];
      state.value.filters.priceFilter = 50;
      state.value.filters.cityFilter = null;
      state.value.filters.longitudeFilter = -200;
      state.value.filters.latitudeFilter = -200;
      state.value.filters.scopeFilter = 50;
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
    setLocationPreferences: (state, action) => {
      state.value.preferences.cityPreference = action.payload.cityPreference;
      state.value.preferences.longitudePreference =
        action.payload.longitudePreference;
      state.value.preferences.latitudePreference =
        action.payload.latitudePreference;
    },
    resetPreferences: (state, action) => {
      state.value.preferences.agePreference = [];
      state.value.preferences.cityPreference = null;
      state.value.preferences.latitudePreference = -200;
      state.value.preferences.longitudePreference = -200;
      state.value.preferences.scopePreference = 50;
    },
    loadUserActivities: (state, action) => {
      console.log("loaduserActivities");
      state.value.userActivities = action.payload;
    },
    addUserActivity: (state, action) => {
      console.log("adduserActivities");
      state.value.userActivities.push(action.payload);
    },
    modifyUserActivity: (state, action) => {
      console.log("modifyuserActivities");
      const index = state.value.userActivities.findIndex(
        (activity) => activity.id === action.payload.activityId
      );
      state.value.userActivities[index].name = action.payload.activity.name;
      state.value.userActivities[index].description =
        action.payload.activity.description;
      // state.value.userActivities[index].durationInMilliseconds = action.payload.activity.durationInMilliseconds;
      state.value.userActivities[index].category =
        action.payload.activity.category;
      state.value.userActivities[index].concernedAges =
        action.payload.activity.concernedAges;
      state.value.userActivities[index].address =
        action.payload.activity.address;
      state.value.userActivities[index].postalCode =
        action.payload.activity.postalCode;
      state.value.userActivities[index].city = action.payload.activity.city;
      state.value.userActivities[index].locationName =
        action.payload.activity.locationName;
      state.value.userActivities[index].date = action.payload.activity.date;
      state.value.userActivities[index].price = action.payload.activity.price;
      state.value.userActivities[index].latitude =
        action.payload.activity.latitude;
      state.value.userActivities[index].longitude =
        action.payload.activity.longitude;
      if (action.payload.activity.imgUrl) {
        state.value.userActivities[index].imgUrl =
          action.payload.activity.imgUrl;
      }
    },
    deleteUserActivity: (state, action) => {
      state.value.userActivities = state.value.userActivities.filter(
        (activity) => activity.id !== action.payload
      );
    },
    updateFavoriteActivities: (state, action) => {
      if (state.value.favoriteActivities.includes(action.payload)) {
        state.value.favoriteActivities = state.value.favoriteActivities.filter(
          (activityId) => activityId !== action.payload
        );
      } else {
        state.value.favoriteActivities.push(action.payload);
      }
    },
    loadFavoriteActivities: (state, action) => {
      state.value.favoriteActivities = action.payload;
    },
    setErrorMsg: (state, action) => {
      state.value.errorMsg = action.payload;
    },
    setErrorOrganizersMsg: (state, action) => {
      state.value.errorOrganizersMsg = action.payload;
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
  setCategoryFilters,
  setLocationFilters,
  setPreferencesFilters,
  resetFilters,
  setPreferences,
  setLocationPreferences,
  resetPreferences,
  setCitySearched,
  resetCitySearched,
  updateFavoriteActivities,
  loadUserActivities,
  addUserActivity,
  addUserActivityPhoto,
  deleteUserActivity,
  setErrorMsg,
  setErrorOrganizersMsg,
} = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    author: null,
    organizer: null,
    createdAt: null,
    name: null,
    description: null,
    durationInMilliseconds: 3600000, // 1H by default
    category: null,
    concernedAges: [],
    address: null,
    postalCode: null,
    locationName: null,
    latitude: null,
    longitude: null,
    city: null,
    date: null,
    price: 0,
    isRecurrent: false,
    recurrence: null,
    imgUrl: null,
    isLiked: null,
    likes: [],
    //For updates
    isCurrentlyUpdated: false,
    id: null,
  },
};

export const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    addActivityInfoScreen1: (state, action) => {
      state.value.name = action.payload.name;
      state.value.description = action.payload.description;
      state.value.category = action.payload.category;
    },
    addActivityInfoScreen2: (state, action) => {
      state.value.concernedAges = action.payload.concernedAges;
      state.value.price = action.payload.price;
    },
    addActivityInfoScreen3: (state, action) => {
      state.value.address = action.payload.address;
      state.value.postalCode = action.payload.postalCode;
      state.value.city = action.payload.city;
      state.value.locationName = action.payload.locationName;
      state.value.latitude = action.payload.latitude;
      state.value.longitude = action.payload.longitude;
    },
    addActivityInfoScreen4: (state, action) => {
      state.value.date = action.payload.date;
      state.value.durationInMilliseconds = action.payload.durationInMilliseconds;
    },
    addActivityInfoScreen5: (state, action) => {
      state.value.imgUrl = action.payload.imgUrl;
    },
    startUpdate: (state, action) => {
      state.value.isCurrentlyUpdated = true;
      state.value.id = action.payload.id;
    },
    resetActivityInfos: (state, action) => {
      state.value.name = null;
      state.value.description = null;
      state.value.category = null;
      state.value.concernedAges = [];
      state.value.address = null;
      state.value.postalCode = null;
      state.value.latitude = null;
      state.value.longitude = null;
      state.value.city = null;
      state.value.locationName = null;
      state.value.date = null;
      state.value.durationInMilliseconds = 3600000;
      state.value.imgUrl = null;
      state.value.isCurrentlyUpdated = false;
      state.value.id = null;
      state.value.price = 0;
    },
  },
});

export const { addActivityInfoScreen1, addActivityInfoScreen2, addActivityInfoScreen3, addActivityInfoScreen4, addActivityInfoScreen5, resetActivityInfos, startUpdate } =
  activitiesSlice.actions;
export default activitiesSlice.reducer;
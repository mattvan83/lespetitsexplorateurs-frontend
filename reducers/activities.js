import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    author: null,
    organizer: null,
    createdAt: null,
    name: null,
    description: null,
    durationInMilliseconds: null,
    category: null,
    concernedAges: [],
    address: null,
    postalCode: null,
    locationName: null,
    latitude: null,
    longitude: null,
    city: null,
    date: null,
    isRecurrent: false,
    recurrence: null,
    image: null,
    likes: [],
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
    },
    addActivityInfoScreen3: (state, action) => {
        state.value.address = action.payload.address;
        state.value.postalCode = action.payload.postalCode;
        state.value.city = action.payload.city;
        state.value.locationName = action.payload.locationName;
        //state.value.latitude = action.payload.latitude;
        //state.value.longitude = action.payload.longitude;
    },
    addActivityInfoScreen4: (state, action) => {
        state.value.date = action.payload.date;
    },
    addActivityInfoScreen5: (state, action) => {
        state.value.image = action.payload.image;
    },
    updateLikedActivities: (state, action) => {
      const indexActivity = state.value.findIndex(
        (activity) => activity.id === action.payload.id
      );

      if (action.payload.isLiked) {
        state.value[indexActivity].likes.push(action.payload.userId);
        state.value[indexActivity].isLiked = true;
      } else {
        state.value[indexActivity].likes = state.value[indexActivity].likes.filter(
          (userId) => userId !== action.payload.userId
        );
        state.value[indexActivity].isLiked = false;
      }
    },
  },
});

export const { addActivityInfoScreen1, addActivityInfoScreen2, addActivityInfoScreen3, addActivityInfoScreen4, addActivityInfoScreen5 } =
  activitiesSlice.actions;
export default activitiesSlice.reducer;
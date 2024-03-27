import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { importActivities, setErrorActivitiesFetch } from "../reducers/user";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export const useFetchActivities = (user) => {
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const dispatch = useDispatch();

  const fetchActivities = async (resetCategoryFilter = false) => {
    try {
      // Fetch activities based on user filters
      setIsLoadingActivities(true);

      // Get user preferences, filters and token
      const {
        agePreference,
        latitudePreference,
        longitudePreference,
        scopePreference,
      } = user.preferences;

      const {
        latitudeFilter,
        longitudeFilter,
        categoryFilter,
        dateFilter,
        momentFilter,
        ageFilter,
        priceFilter,
        scopeFilter,
      } = user.filters;

      const { token } = user;

      let endpoint = "";
      let requestBody = {};

      if (latitudeFilter === -200 || longitudeFilter === -200) {
        // Case where filters location has been cleared and no preferences location is defined
        if (latitudePreference === -200 || longitudePreference === -200) {
          endpoint = `${BACKEND_ADDRESS}/activities/nogeoloc`;
          requestBody = {
            token,
            filters: {
              categoryFilter: resetCategoryFilter ? [] : categoryFilter,
              dateFilter,
              momentFilter,
              ageFilter,
              priceFilter,
            },
          };
          // Case where filters location has been cleared and preferences location is defined
        } else if (
          latitudePreference !== -200 &&
          longitudePreference !== -200
        ) {
          endpoint = `${BACKEND_ADDRESS}/activities/geoloc`;
          requestBody = {
            token,
            latitude: latitudePreference,
            longitude: longitudePreference,
            scope: scopePreference,
            filters: {
              categoryFilter: resetCategoryFilter ? [] : categoryFilter,
              dateFilter,
              momentFilter,
              ageFilter: agePreference,
              priceFilter,
            },
          };
        }
        // Case where filters location is defined
      } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
        endpoint = `${BACKEND_ADDRESS}/activities/geoloc`;
        requestBody = {
          token,
          latitude: latitudeFilter,
          longitude: longitudeFilter,
          scope: scopeFilter,
          filters: {
            categoryFilter: resetCategoryFilter ? [] : categoryFilter,
            dateFilter,
            momentFilter,
            ageFilter,
            priceFilter,
          },
        };
      }

      if (endpoint !== "") {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();

        if (data.result) {
          dispatch(importActivities(data.activities));
          dispatch(setErrorActivitiesFetch(null));
          // setMarkerColors(data.activities.map(() => initialMarkerColor));
        } else {
          dispatch(importActivities([]));
          dispatch(setErrorActivitiesFetch(data.error));
          // setMarkerColors([]);
        }
        //   setPressedMarkerIndex(null);
      }
    } catch (error) {
      console.error(error.message);
      dispatch(setErrorActivitiesFetch(error.message));
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // useEffect to manage fetch of activities at each update of user.filters
  useEffect(() => {
    fetchActivities();

    // Clean-up function
    return () => {
      // Perform any cleanup if needed
    };
  }, [user.filters]); // Trigger effect when user filters change

  // Return loading state if needed
  return { isLoadingActivities, setIsLoadingActivities, fetchActivities };
};

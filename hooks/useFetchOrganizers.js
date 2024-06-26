import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadOrganizers } from "../reducers/organizers";
import { setErrorOrganizersFetch } from "../reducers/user";

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS;

export const useFetchOrganizers = (user, currentScreenName, geolocation) => {
  const [isLoadingOrganizers, setIsLoadingOrganizers] = useState(
    currentScreenName === "Explorer" ? true : false
  );
  const dispatch = useDispatch();

  // useEffect to manage fetch of organizers at each update of (user.filters.scopeFilter, user.filters.latitudeFilter, user.filters.longitudeFilter) OR geolocation
  useEffect(() => {
    const fetchOrganizers = async (user, currentScreenName, geolocation) => {
      // Fetch organizers based on user filters OR geolocation
      try {
        if (currentScreenName !== "Explorer") {
          setIsLoadingOrganizers(true);
        }

        // Get user preferences, filters
        const { latitudePreference, longitudePreference, scopePreference } =
          user.preferences;

        const { latitudeFilter, longitudeFilter, scopeFilter } = user.filters;

        let endpoint = "";

        if (latitudeFilter === -200 || longitudeFilter === -200) {
          // Case where filters location has been cleared and no preferences location is defined
          if (latitudePreference === -200 || longitudePreference === -200) {
            if (currentScreenName === "Explorer" && geolocation) {
              const { latitude, longitude } = geolocation;
              endpoint = `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitude}/${latitude}`;
            } else endpoint = `${BACKEND_ADDRESS}/organizers/nogeoloc`;
          } else if (
            latitudePreference !== -200 &&
            longitudePreference !== -200
          ) {
            endpoint = `${BACKEND_ADDRESS}/organizers/geoloc/${scopePreference}/${longitudePreference}/${latitudePreference}`;
          }
          // Case where filters location is defined
        } else if (latitudeFilter !== -200 || longitudeFilter !== -200) {
          endpoint = `${BACKEND_ADDRESS}/organizers/geoloc/${scopeFilter}/${longitudeFilter}/${latitudeFilter}`;
        }

        if (endpoint !== "") {
          const response = await fetch(endpoint);
          const data = await response.json();

          if (data.result) {
            dispatch(loadOrganizers(data.organizers));
            dispatch(setErrorOrganizersFetch(null));
          } else {
            dispatch(loadOrganizers([]));
            dispatch(setErrorOrganizersFetch(data.error));
          }
        }
      } catch (error) {
        console.error(error.message);
        dispatch(setErrorOrganizersFetch(error.message));
      } finally {
        setIsLoadingOrganizers(false);
      }
    };

    if (
      currentScreenName !== "Explorer" ||
      (currentScreenName === "Explorer" && geolocation) ||
      (currentScreenName === "Explorer" && geolocation === undefined)
    ) {
      fetchOrganizers(user, currentScreenName, geolocation);
    }
    // Clean-up function
    return () => {
      // Perform any cleanup if needed
    };
  }, [
    currentScreenName === "Explorer"
      ? geolocation
      : (user.filters.scopeFilter,
        user.filters.latitudeFilter,
        user.filters.longitudeFilter),
  ]); // Trigger effect when geolocation or user filters location change based on the currentScreenName

  // Return loading state if needed
  return { isLoadingOrganizers, setIsLoadingOrganizers };
};

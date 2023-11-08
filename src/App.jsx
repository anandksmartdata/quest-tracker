import { Flex, SkeletonText } from "@chakra-ui/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { ref, set, get, child } from "firebase/database";
import { db, dbRef } from "./firebase";
import moment from "moment";
import { googleMapsApiKey } from "./env";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["places"],
  });

  const [markers, setMarkers] = useState([]);
  const [questCount, setQuestCount] = useState(1);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const createMarker = (lat, lng) => {
    const timestamp = moment(new Date().getTime()).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    return {
      [`quest ${questCount}`]: {
        location: {
          lat,
          lng,
        },
        timestamp,
      },
    };
  };

  const handleMapClick = (e) => {
    const newMarker = createMarker(e.latLng.lat(), e.latLng.lng());

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setQuestCount((prevCount) => prevCount + 1);

    set(ref(db, "questsList"), markers);
  };

  useEffect(() => {
    const getUserLocation = () => {
      const newYorkLocation = { lat: 40.7128, lng: -74.006 };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            setMapCenter(userLocation);
          },
          () => setMapCenter(newYorkLocation)
        );
      } else setMapCenter(newYorkLocation);
    };

    getUserLocation();

    get(child(dbRef, "questsList"))
      .then((snapshot) => {})
      .catch((error) => console.error("firebase db error", error));
  }, []);

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      {isLoaded ? (
        <GoogleMap
          center={mapCenter || { lat: 48.8584, lng: 2.2945 }}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onClick={handleMapClick}
        >
          {markers?.map((quest, index) => {
            const questKey = Object.keys(quest)[0];
            const { location, timestamp } = quest[questKey];

            return (
              <Marker
                key={questKey}
                position={location}
                label={String(index + 1)}
                onClick={() =>
                  setSelectedMarker((prev) => ({
                    ...prev,
                    name: questKey,
                    timestamp,
                    location,
                  }))
                }
              />
            );
          })}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker?.location}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h2>Marker Details</h2>
                <p>Name: {selectedMarker?.name}</p>
                <p>Timestamp: {selectedMarker?.timestamp}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <SkeletonText />
      )}
    </Flex>
  );
}

export default App;

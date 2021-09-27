import classes from "./PlacesSearchRest.module.css";
import MapboxAutocomplete from "react-mapbox-autocomplete";
import RestContext from "../../store/rest-context";
import UserContext from "../../store/user-context";
import { useHistory } from "react-router";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import "../address/PlacesOverride.css";
import "./PlacesOverrideRest.css";

const PlacesSearchRest = (props) => {
  const restCtx = useContext(RestContext);
  const userCtx = useContext(UserContext);
  const [address, setAddress] = useState("delivery address");
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    const checkAddressHandler = () => {
      const searchAddress = localStorage.getItem("search-address");
      if (userCtx._id && userCtx.deliveryAddress.coordinates) {
        setAddress(userCtx.deliveryAddress.address);
      } else if (!params.lat && !params.lng) {
        setAddress("delivery address");
      } else if (searchAddress) {
        const foundAddress = JSON.parse(searchAddress);
        setAddress(foundAddress.result);
      }
    };
    checkAddressHandler();
  }, [userCtx, params]);

  const suggestionHandler = async (result, lat, lng, text) => {
    try {
      const response = await restCtx.getRestaurantsWithin(lat, lng);
      localStorage.setItem(
        "search-address",
        JSON.stringify({
          result,
        })
      );
      if (response.data.status === "success") {
        history.push(`/restaurants/address/${lat}/${lng}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.reset}>
      <MapboxAutocomplete
        publicKey="pk.eyJ1Ijoia2F0bWlsIiwiYSI6ImNrb2hjd25meTAxNzUycXA4ejV1OHFwcHMifQ.PWjetm-kTu_VQtRo8uB7HA"
        inputClass={`${classes.input}`}
        onSuggestionSelect={suggestionHandler}
        placeholder={address}
      />
    </div>
  );
};

export default PlacesSearchRest;

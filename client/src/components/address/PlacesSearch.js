import classes from "./PlacesSearch.module.css";
import MapboxAutocomplete from "react-mapbox-autocomplete";
import "./PlacesOverride.css";

const PlacesSearch = (props) => {
  return (
    <div className={classes.reset}>
      <MapboxAutocomplete publicKey="pk.eyJ1Ijoia2F0bWlsIiwiYSI6ImNrb2hjd25meTAxNzUycXA4ejV1OHFwcHMifQ.PWjetm-kTu_VQtRo8uB7HA" spellcheck="false" inputClass={props.input || `${classes.input}`} onSuggestionSelect={props.onSearch} placeholder={props.placeholder || " "} />
    </div>
  );
};

export default PlacesSearch;

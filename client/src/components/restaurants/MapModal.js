import ReactMapboxGl, { Marker, ZoomControl, Popup } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import restIcon from './../../assets/marker.png';
import userIcon from './../../assets/user-marker.png';
import classes from './MapModal.module.css';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1Ijoia2F0bWlsIiwiYSI6ImNrb2hjd25meTAxNzUycXA4ejV1OHFwcHMifQ.PWjetm-kTu_VQtRo8uB7HA',
});
const MapModal = (props) => {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showRestPopup, setShowRestPopup] = useState(false);

  const userPopupOn = () => {
    setShowUserPopup(true);
  };

  const restPopupOn = () => {
    setShowRestPopup(true);
  };

  const userPopupOff = () => {
    setShowUserPopup(false);
  };

  const restPopupOff = () => {
    setShowRestPopup(false);
  };

  //   const geojson = {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         geometry: {
  //           type: "LineString",
  //           coordinates: [props.coordinates, props.userCoordinates],
  //         },
  //       },
  //     ],
  //   };
  //   const linePaint = {
  //     "line-color": "grey",
  //     "line-width": 2,
  //   };

  return (
    <div className={classes.modal}>
      <div className={classes.content}>
        <Map
          style="mapbox://styles/katmil/ckpxtwn0r0xgu18nlyvutq39p"
          containerStyle={{
            height: '100%',
            width: '100%',
            zIndex: '2',
          }}
          zoom={[13]}
          center={props.coordinates}
        >
          <div className={classes['text-button']}>
            <p className={classes.p}>
              approximate distance: {props.distance}km
            </p>
            <div className={classes.button}>
              <span
                onClick={() => {
                  props.onClose();
                }}
                className={classes.close}
              >
                &times;
              </span>
            </div>
          </div>
          <ZoomControl position={'bottom-right'} />
          <Marker
            coordinates={props.coordinates}
            className={classes.marker}
            onMouseEnter={restPopupOn}
            onMouseLeave={restPopupOff}
            anchor="bottom"
          >
            <img
              src={restIcon}
              alt="icon"
              style={{ width: '100%', height: '100%' }}
            />
          </Marker>
          <Marker
            coordinates={props.userCoordinates}
            className={classes.marker}
            anchor="bottom"
            onMouseEnter={userPopupOn}
            onMouseLeave={userPopupOff}
          >
            <img
              src={userIcon}
              alt="icon"
              style={{ width: '100%', height: '100%' }}
            />
          </Marker>
          {showRestPopup && (
            <Popup
              coordinates={props.coordinates}
              offset={{
                bottom: [0, -40],
              }}
              anchor="bottom"
            >
              <div className={classes.popup}>{props.name} Restaurant</div>
            </Popup>
          )}
          {showUserPopup && (
            <Popup
              coordinates={props.userCoordinates}
              offset={{
                bottom: [0, -40],
              }}
              anchor="bottom"
            >
              <div className={classes.popup}>You are here</div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};
// 44.818847 / 20.454455;
export default MapModal;

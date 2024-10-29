import React from 'react'
import {
    CImage,
  } from '@coreui/react'
import GoogleMapReact from 'google-map-react'
import icon from '../../assets/icons/location-pin-grinplus.png'
import PropTypes from 'prop-types';

const LocationPin = ({ text }) => (
    <div className="pin">
      <CImage src={icon} height={38} alt="Logo" className="pin-icon" />
      <p className="pin-text">{text}</p>
    </div>
  )

LocationPin.propTypes = {
    text: PropTypes.string,
};

const Map = ({ location, zoomLevel }) => (
    <div className="map">
      {/* <h2 className="map-h2">Come Visit Us At Our Campus</h2> */}
  
      <div className="google-map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBUuEeKO9-yrJM50bujszPhseg0mUyWWSw' }}
          defaultCenter={location}
          defaultZoom={zoomLevel}
          yesIWantToUseGoogleMapApiInternals
          options={function (maps) { return { mapTypeId: "satellite", draggable: false, zoomControl: true, scrollwheel: true } }}
        >
          <LocationPin
            lat={location.lat}
            lng={location.lng}
            text={location.address}
          />
        </GoogleMapReact>
      </div>
    </div>
  )

Map.propTypes = {
    location: PropTypes.object,
    zoomLevel: PropTypes.number,
};

  export default Map
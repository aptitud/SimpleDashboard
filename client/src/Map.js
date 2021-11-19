/*global google*/
import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
  };

  displayMarkers = () => {
    return this.props.employees.map((employee, index) => {
				if(employee.position) {
					if (!employee.icon) employee.icon = {url: '/employee.svg', anchor: new google.maps.Point(10,10)}
					return <Marker key={index} id={index} position={employee.position}
						title={employee.name} icon={employee.icon}
						onClick={() => console.log("You clicked me!")} />
				}
    })
  }

  render() {
	  const aptiMarker = {name:'Ferken', position:{lat:59.324274515453006, lng: 18.074365189285885}, icon: {url: '/favicon-57.png', anchor: new google.maps.Point(28,28)}};

	  return (
        <Map google={this.props.google}
            zoom={9}
            style={mapStyles}
            initialCenter={{ lat: 59.325071, lng: 18.067997}}>
			<Marker key={aptiMarker.name} id={aptiMarker.name} position={aptiMarker.position}
					title={aptiMarker.name} icon={aptiMarker.icon}
					onClick={() => console.log("You clicked me!")} />
          {this.displayMarkers()}
        </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwChmJ8Y45tMxQ27HNhLyc7SeohwRqIT8'
})(MapContainer);

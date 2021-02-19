import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [
              {name: 'Butiken', position: {lat:59.325065, lng: 18.067978}, icon: '/favicon-57.png'},
              {name: 'Anders Ljusberg', position: {lat: 59.298866, lng: 17.968189}},
              {name: 'Anders Löwenborg', position: {lat: 59.318032, lng: 18.464043}},
              {name: 'Arpine Avakian', position: {lat: 59.215458, lng: 17.959254}},
              {name: 'Christian Fredh', position: {lat: 59.310764, lng: 18.100486}},
              {name: 'David Blomberg', position: {lat: 59.316629, lng: 17.774051}},
              {name: 'Emil Ingridsson', position: {lat: 59.302078, lng: 17.966434}},
              {name: 'Emma Ullberg', position: {lat: 59.425835, lng: 17.931786}},
              {name: 'Fredrik Sundberg', position: {lat: 59.292399, lng: 18.056717}},
              {name: 'Giovannie Malmqvist', position: {lat: 59.115698, lng: 17.565763}},
              {name: 'Hampus Klarin', position: {lat: 59.236993, lng: 18.038172}},
              {name: 'Håkan Alexander', position: {lat: 59.373280, lng: 17.951610}},
              {name: 'Johan Elmström', position: {lat: 59.311198, lng: 18.471072}},
              {name: 'Johan Leino', position: {lat: 59.955902, lng: 17.571649}},
              {name: 'John Magnusson', position: {lat: 59.405855, lng: 18.326766}},
              {name: 'Jonas Ahnlund', position: {lat: 59.233777, lng: 17.972453}},
              {name: 'Jonas Cederkvist', position: {lat: 59.279295, lng: 18.061710}},
              {name: 'Jonas Ehrenfried', position: {lat: 59.367807, lng: 17.985114}},
              {name: 'Magnus Hübner', position: {lat: 59.238458, lng: 17.953280}},
              {name: 'Mikael Ahlinder', position: {lat: 59.308081, lng: 18.007212}},
              {name: 'Olof Sandström', position: {lat: 59.368475, lng: 17.897355}},
              {name: 'Peter Qwärnström', position: {lat: 59.249916, lng: 18.268034}},
              {name: 'Richard Danninger', position: {lat: 59.335783, lng: 18.050989}},
              {name: 'Sebastian Näslund', position: {lat: 59.272375, lng: 18.072875}},
              {name: 'Thomas Granbacka', position: {lat: 59.111582, lng: 18.085051}},
              {name: 'Magnus Crafoord', position: {lat: 59.850321, lng: 17.654502}},
              {name: 'Åsa Fogelin', position: {lat: 59.508779, lng: 18.069619}},
              {name: 'Isa Jonsson', position: {lat: 59.311361, lng: 18.055033}}]
    }
  };

  displayMarkers = () => {
    return this.state.employees.map((employee, index) => {
      return <Marker key={index} id={index} position={employee.position}
      title={employee.name} icon={employee.icon}
     onClick={() => console.log("You clicked me!")} />
    })
  }

  render() {
    return (
        <Map google={this.props.google}
            zoom={9}
            style={mapStyles}
            initialCenter={{ lat: 59.325071, lng: 18.067997}}>
          {this.displayMarkers()}
        </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwChmJ8Y45tMxQ27HNhLyc7SeohwRqIT8'
})(MapContainer);

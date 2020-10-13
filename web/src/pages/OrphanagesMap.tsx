import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi'

import { Map, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import '../styles/pages/orphanages.css';
import mapMarkerImg from '../images/map-marker.svg';

function OrphanagesMap() {
  console.log(process.env.REACT_APP_MAPBOX_TOKEN)
  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Map Marker Happy"/>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Londrina</strong>
          <span>Paraná</span>
        </footer>
      </aside>

      <Map 
        center={[-23.3090714,-51.1767247]}
        zoom={13.75}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer 
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          />
      </Map>

      <Link to="" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;

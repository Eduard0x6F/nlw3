import React, { ChangeEvent, FormEvent, useState, EventHandler, HTMLAttributes, AllHTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";
import mapIcon from '../utils/mapIcon'

import Sidebar from '../components/Sidebar';
import '../styles/pages/create-orphanage.css';
import api from "../services/api";




export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    images.forEach(image => {
      data.append('images', image);
    });

    api.post('orphanages', data)
      .then(response => {
        alert('Cadastro realizado com sucesso!');
        history.push('/app');
      })
      .catch(error => alert('Erro no cadastro'));
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const imagesFiles =  Array.from(event.target.files);
    setImages(imagesFiles);

    const imagesPreview = imagesFiles.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(imagesPreview);
  }

  function handleRemoveImage(event: any) {
    const removedImage = event.target.getAttribute('id');
    //console.log(event.target.getAttribute('id'));
    
    setPreviewImages(previewImages.filter(image => image !== removedImage));   
    
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-23.3090714,-51.1767247]} 
              style={{ width: '100%', height: 280 }}
              zoom={12}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && (
                  <Marker 
                    interactive={false}
                    icon={mapIcon}
                    position={[position.latitude,position.longitude]}
                  />
                )              
             }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                value={about}
                onChange={event => setAbout(event.target.value)} maxLength={300}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <label key={image} className="remove-image">
                      <img src={image} alt={name}>                      
                      </img>
                      <span id={image} onClick={handleRemoveImage}>X</span>
                    </label>
                    
                  )
                })}
                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input
                  multiple
                  hidden
                  type="file"
                  id="image[]"
                  onChange={handleSelectImages}
                >
                </input>
              </div>            
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={ event => setInstructions(event.target.value) }
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de atendimento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={ event => setOpeningHours(event.target.value) }
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={ open_on_weekends ? 'active' : '' }
                  onClick={ () => setOpenOnWeekends(true) }
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={ !open_on_weekends ? 'active' : '' }
                  onClick={ () => setOpenOnWeekends(false) }
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit" onClick={handleSubmit}>
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;

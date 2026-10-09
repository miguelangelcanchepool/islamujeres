"use client";

import { useEffect, useState } from "react";
import { Photo } from "@/components/Photo";
import { categoryLabel, visibilityLabel } from "@/lib/places/categories";
import { directionsUrl, formatCoordinates } from "@/lib/places/geo";
import {
  categoryDetailFields,
  type Place,
  type PlaceDetailField,
} from "@/lib/places/types";

type PlaceCardProps = {
  place: Place;
  onClose: () => void;
};

function allows(place: Place, field: PlaceDetailField) {
  return (categoryDetailFields[place.category] as readonly string[]).includes(field);
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function PlaceCard({ place, onClose }: PlaceCardProps) {
  const photos = place.photos ?? [];
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = photos[photoIndex] ?? photos[0];

  useEffect(() => {
    setPhotoIndex(0);
  }, [place.id]);

  const whatsappDigits = place.whatsapp ? digits(place.whatsapp) : "";

  return (
    <article
      className={`place-card${place.visibility === "destacado" ? " is-featured" : ""}${place.visibility === "aliado" ? " is-ally" : ""}`}
      aria-labelledby="ficha-titulo"
    >
      <div className="place-card-top">
        <p className="chapter-kicker">{categoryLabel[place.category]}</p>
        <button type="button" className="place-card-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
      <h3 id="ficha-titulo" tabIndex={-1}>
        {place.name}
      </h3>
      <div className="guide-badges">
        {place.origin === "demostracion" ? <em>Demostración</em> : null}
        <em className={place.visibility === "destacado" ? "is-featured" : undefined}>
          {visibilityLabel[place.visibility]}
        </em>
      </div>
      <p className="place-card-summary">{place.summary}</p>

      {photo ? (
        <div className="place-card-photo">
          <Photo image={photo} sizes="(max-width: 959px) 100vw, 24rem" />
          {photos.length > 1 ? (
            <div className="place-card-shots" role="tablist" aria-label="Fotografías">
              {photos.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={index === photoIndex}
                  onClick={() => setPhotoIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <dl className="place-card-facts">
        {allows(place, "description") && place.description ? (
          <div className="is-wide">
            <dt>Descripción</dt>
            <dd>{place.description}</dd>
          </div>
        ) : null}
        {allows(place, "address") && place.address ? (
          <div>
            <dt>Dirección</dt>
            <dd>{place.address}</dd>
          </div>
        ) : null}
        {allows(place, "hours") && place.hours ? (
          <div>
            <dt>Horario</dt>
            <dd>{place.hours}</dd>
          </div>
        ) : null}
        {allows(place, "phone") && place.phone ? (
          <div>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${digits(place.phone)}`}>{place.phone}</a>
            </dd>
          </div>
        ) : null}
        {allows(place, "whatsapp") && whatsappDigits ? (
          <div>
            <dt>WhatsApp</dt>
            <dd>
              <a href={`https://wa.me/${whatsappDigits}`} rel="noreferrer">
                Escribir
              </a>
            </dd>
          </div>
        ) : null}
        {allows(place, "website") && place.website ? (
          <div>
            <dt>Sitio web</dt>
            <dd>
              <a href={place.website} rel="noreferrer">
                {place.website.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        ) : null}
        {allows(place, "social") && place.social && place.social.length > 0 ? (
          <div className="is-wide">
            <dt>Redes</dt>
            <dd>
              <ul className="place-card-links">
                {place.social.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        {allows(place, "coordinates") && place.coordinates ? (
          <div>
            <dt>Coordenadas</dt>
            <dd>{formatCoordinates(place.coordinates)}</dd>
          </div>
        ) : null}
        {allows(place, "directions") && (place.directions || place.coordinates) ? (
          <div className="is-wide">
            <dt>Cómo llegar</dt>
            <dd>
              {place.directions ? <p>{place.directions}</p> : null}
              {place.coordinates ? (
                <a
                  className="link-arrow"
                  href={directionsUrl(place.coordinates)}
                  rel="noreferrer"
                >
                  Indicaciones
                </a>
              ) : null}
            </dd>
          </div>
        ) : null}
      </dl>
      {place.locationNote ? <p className="place-card-note">{place.locationNote}</p> : null}
    </article>
  );
}

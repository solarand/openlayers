import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

import Map from "ol/Map";
import View from "ol/View";

import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

import { fromLonLat } from "ol/proj";

import { unByKey } from "ol/Observable";

import Popup from "ol-popup";
import "ol-popup/dist/ol-popup.css";

import { Button } from "antd";

import { useSelector } from "react-redux";

import type { RootState } from "../store/store";
import type { MapObject } from "../store/slices/mapSlice";

import PopupContent from "./popupContent";

import "ol/ol.css";

interface Props {
  onAddClick: () => void;
}

const MapComponent: React.FC<Props> = ({ onAddClick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const mapInstance = useRef<Map | null>(null);

  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  const popupRef = useRef<Popup | null>(null);

  const objects = useSelector((state: RootState) => state.map.objects);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });

    vectorLayerRef.current = vectorLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([39.7015, 47.2357]),
        zoom: 12,
      }),
    });

    const popup = new Popup({
      positioning: "bottom-center",
      offset: [0, -20],
      autoPan: false,
    });

    popupRef.current = popup;

    map.addOverlay(popup);

    mapInstance.current = map;

    const pointerMoveKey = map.on("pointermove", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);

      if (feature) {
        const coords = (feature.getGeometry() as Point).getCoordinates();

        const popupContainer = document.createElement("div");

        const root = ReactDOM.createRoot(popupContainer);

        root.render(
          <PopupContent
            name={feature.get("name")}
            description={feature.get("description")}
          />,
        );

        popup.show(coords, popupContainer);
      } else {
        popup.hide();
      }
    });

    return () => {
      unByKey(pointerMoveKey);

      map.setTarget(undefined);

      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const source = vectorLayerRef.current?.getSource();

    if (!source) return;

    source.clear();

    objects.forEach((obj: MapObject) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([obj.lon, obj.lat])),
        name: obj.name,
        description: obj.description,
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: "/gps.webp",
            scale: 0.08,
            anchor: [0.5, 1],
          }),
        }),
      );

      source.addFeature(feature);
    });
  }, [objects]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <Button
        type="primary"
        onClick={onAddClick}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        Добавить объект
      </Button>
    </div>
  );
};

export default MapComponent;

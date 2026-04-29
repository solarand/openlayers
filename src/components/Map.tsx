import React, { useEffect, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

import Overlay from "ol/Overlay";

import { fromLonLat } from "ol/proj";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { MapObject } from "../store/slices/mapSlice";

import { Button } from "antd";

interface Props {
  onAddClick: () => void;
}

const MapComponent: React.FC<Props> = ({ onAddClick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const mapInstance = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupOverlayRef = useRef<Overlay | null>(null);

  const objects = useSelector((state: RootState) => state.map.objects);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });

    vectorLayerRef.current = vectorLayer;

    const popupEl = document.createElement("div");
    popupEl.style.background = "white";
    popupEl.style.padding = "8px 12px";
    popupEl.style.borderRadius = "8px";
    popupEl.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    popupEl.style.position = "relative";
    popupEl.style.minWidth = "120px";
    popupEl.style.display = "none";

    popupRef.current = popupEl;

    const popupOverlay = new Overlay({
      element: popupEl,
      positioning: "bottom-center",
      offset: [0, -10],
      stopEvent: false,
    });

    popupOverlayRef.current = popupOverlay;

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

    map.addOverlay(popupOverlay);

    mapInstance.current = map;

    return () => {
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
            src: "https://cdn-icons-png.flaticon.com/512/6618/6618280.png",
            scale: 0.05,
            anchor: [0.5, 1],
          }),
        }),
      );

      source.addFeature(feature);
    });

    const map = mapInstance.current;
    const popup = popupOverlayRef.current;
    const popupEl = popupRef.current;

    if (!map || !popup || !popupEl) return;

    map.on("pointermove", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);

      if (feature) {
        const coords = (feature.getGeometry() as Point).getCoordinates();

        popupEl.innerHTML = `
          <b>${feature.get("name")}</b><br/>
          ${feature.get("description") || ""}
        `;

        popupEl.style.display = "block";
        popup.setPosition(coords);
      } else {
        popupEl.style.display = "none";
        popup.setPosition(undefined);
      }
    });
  }, [objects]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

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

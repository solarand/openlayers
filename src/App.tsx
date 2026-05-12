import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { type RootState } from "./store/store";

import MapComponent from "./components/Map";
import AddObjectModal from "./components/addModal";

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const objects = useSelector((state: RootState) => state.map.objects);

  useEffect(() => {
    localStorage.setItem("mapObjects", JSON.stringify(objects));
  }, [objects]);

  return (
    <>
      <MapComponent onAddClick={() => setModalOpen(true)} />

      <AddObjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default App;

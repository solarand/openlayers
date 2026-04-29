import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addObject } from "./store/slices/mapSlice";
import MapComponent from "./components/Map";
import AddObjectModal from "./components/addModal";
import type { AppDispatch } from "./store/store";

const App: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleCreate = (obj: Parameters<typeof addObject>[0]) => {
    dispatch(addObject(obj));
    setModalVisible(false);
  };

  return (
    <>
      <MapComponent onAddClick={() => setModalVisible(true)} />
      <AddObjectModal
        visible={modalVisible}
        onCreate={handleCreate}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default App;

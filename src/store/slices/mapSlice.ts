import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MapObject {
  name: string;
  description: string;
  lat: number;
  lon: number;
}

interface MapState {
  objects: MapObject[];
}

const initialState: MapState = {
  objects: JSON.parse(localStorage.getItem("mapObjects") || "[]"),
};

const mapSlice = createSlice({
  name: "map",

  initialState,

  reducers: {
    addObject: (state, action: PayloadAction<MapObject>) => {
      state.objects.push(action.payload);
    },
  },
});

export const { addObject } = mapSlice.actions;

export default mapSlice.reducer;

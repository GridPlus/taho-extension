import { createSlice } from "@reduxjs/toolkit"
import { createBackgroundAsyncThunk } from "./utils"
import { type GridPlusAddress } from "../services/gridplus"

export type GridPlusState = {
  importableAddresses: string[]
  activeAddresses: GridPlusAddress[]
}

export const initialState: GridPlusState = {
  importableAddresses: [],
  activeAddresses: [],
}

const gridplusSlice = createSlice({
  name: "gridplus",
  initialState,
  reducers: {
    resetGridPlusState: (immerState) => {
      immerState.importableAddresses = []
      immerState.activeAddresses = []
    },
    setImportableAddresses: (
      immerState,
      { payload: importableAddresses }: { payload: string[] },
    ) => {
      immerState.importableAddresses = importableAddresses
    },
    setActiveAddresses: (
      immerState,
      { payload: activeAddresses }: { payload: GridPlusAddress[] },
    ) => {
      immerState.activeAddresses = activeAddresses
    },
  },
})

export const {
  resetGridPlusState,
  setImportableAddresses,
  setActiveAddresses,
} = gridplusSlice.actions

export default gridplusSlice.reducer

export const connectGridplus = createBackgroundAsyncThunk(
  "gridplus/connect",
  async (
    { deviceId, password }: { deviceId?: string; password?: string },
    { extra: { main } },
  ) => {
    return main.connectGridplus({ deviceId, password })
  },
)

export const pairGridplusDevice = createBackgroundAsyncThunk(
  "gridplus/pairDevice",
  async ({ pairingCode }: { pairingCode: string }, { extra: { main } }) => {
    return main.pairGridplusDevice({ pairingCode })
  },
)

export const fetchGridPlusAddresses = createBackgroundAsyncThunk(
  "gridplus/fetchAddresses",
  async (
    {
      n = 10,
      startPath = [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
    }: { n?: number; startPath?: number[] },
    { dispatch, extra: { main } },
  ) => {
    return dispatch(
      setImportableAddresses(
        await main.fetchGridPlusAddresses({ n, startPath }),
      ),
    )
  },
)

export const importGridPlusAddresses = createBackgroundAsyncThunk(
  "gridplus/importAddresses",
  async (
    { addresses }: { addresses: GridPlusAddress[] },
    { extra: { main } },
  ) => {
    return main.importGridPlusAddresses({ addresses })
  },
)

export const initializeActiveAddresses = createBackgroundAsyncThunk(
  "gridplus/initializeActiveAddresses",
  async (_, { extra: { main }, dispatch }) => {
    const activeAddresses = await main.readActiveGridPlusAddresses()
    return dispatch(setActiveAddresses(activeAddresses))
  },
)
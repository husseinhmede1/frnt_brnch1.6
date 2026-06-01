import { JobModel } from "../models/jobs/JobModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface schedule {
  openSchedule: boolean;
}
interface reload {
  reloadData: boolean;
}
export interface scheduleState {
  value: schedule;
  reload: reload;
  value1: JobModel;
  isPendingAct: boolean;
  pendingActId: number;
}

const initialState: scheduleState = {
  value: {
    openSchedule: false,
  },
  reload: {
    reloadData: true,
  },
  value1: {
    ...new JobModel(),
    frequency: 0,
  },
  isPendingAct: localStorage.getItem("isPendingAct")? JSON.parse(localStorage.getItem("isPendingAct") as string): false,
  pendingActId: localStorage.getItem("pendingActId")? Number(localStorage.getItem("pendingActId")): 0
};

export const jobSchedule = createSlice({
  name: "jobSchedule",
  initialState,
  reducers: {
    updateJobState: (state, action: PayloadAction<schedule>) => {
      state.value = action.payload;
    },
    updateJobReload: (state, action: PayloadAction<reload>) => {
      state.reload = action.payload;
    },
    scheduleDetails: (state, action: PayloadAction<JobModel>) => {
      state.value1 = action.payload;
    },
    changePendingState: (state, action: PayloadAction<boolean>) => {
      state.isPendingAct = action.payload;
    },
    updatePendingActId: (state, action: PayloadAction<number>) => {
      state.pendingActId = action.payload;
    }
  },
});

export const { updateJobReload, updateJobState, scheduleDetails, changePendingState, updatePendingActId } = jobSchedule.actions;

export default jobSchedule.reducer;

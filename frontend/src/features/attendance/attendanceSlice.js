import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api";

/* -------------------- EMPLOYEE THUNKS -------------------- */

// Get today's status
export const fetchTodayStatus = createAsyncThunk(
  "attendance/fetchTodayStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${API}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch today's status");
    }
  }
);

// Check-in
export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(
        `${API}/attendance/checkin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.attendance;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Check-in failed"
      );
    }
  }
);

// Check-out
export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(
        `${API}/attendance/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.attendance;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Check-out failed"
      );
    }
  }
);

// Get attendance history
export const fetchHistory = createAsyncThunk(
  "attendance/fetchHistory",
  async ({ month, year }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(
        `${API}/attendance/my-history?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.records;
    } catch (err) {
      return rejectWithValue("Failed to fetch history");
    }
  }
);

// Monthly summary
export const fetchSummary = createAsyncThunk(
  "attendance/fetchSummary",
  async ({ month, year }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(
        `${API}/attendance/my-summary?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch summary");
    }
  }
);


/* -------------------- SLICE -------------------- */

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    today: null,
    history: [],
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* TODAY STATUS */
      .addCase(fetchTodayStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(fetchTodayStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CHECK-IN */
      .addCase(checkIn.fulfilled, (state, action) => {
        state.today = { ...state.today, checkInTime: action.payload.checkInTime, status: "present" };
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* CHECK-OUT */
      .addCase(checkOut.fulfilled, (state, action) => {
        state.today = {
          ...state.today,
          checkOutTime: action.payload.checkOutTime,
          totalHours: action.payload.totalHours,
        };
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* HISTORY */
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SUMMARY */
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;

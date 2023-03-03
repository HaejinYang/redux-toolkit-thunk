import React from "react";
import {useDispatch, Provider, useSelector} from "react-redux";
import {createSlice, configureStore, createAsyncThunk} from "@reduxjs/toolkit";
import "./style.css";

const asyncUpFetch = createAsyncThunk(
  'counter/fetch',
  async () => {
    const resp = await fetch('https://api.countapi.xyz/hit/opesaljkdfslkjfsadf.com/visits')
    const data = await resp.json();

    return data.value;
  }
)

const counterSlice = createSlice({
  name: "counter",
  initialState: {count: 0, status: "welcome"},
  reducers: {
    up: (state, action) => {
      state.count = state.count + action.step;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(asyncUpFetch.pending, (state, action) => {
      state.status = "PENDING";
    });
    builder.addCase(asyncUpFetch.fulfilled, (state, action) => {
      state.status = "COMPLETE";
      state.count = action.payload;
    });
    builder.addCase(asyncUpFetch.rejected, (state, action) => {
      state.status = "FAILED";
    });
  }
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})

const Counter = () => {
  const count = useSelector(state => state.counter.count);
  const status = useSelector(state => state.counter.status);
  const dispatch = useDispatch();
  return (
    <div>
      <input type = "button" value="Up" onClick={() => {
        dispatch({type:'counter/up', step: 2});
      }}></input><br/>
      <input type = "button" value="AsyncFetch" onClick={() => {
        dispatch(asyncUpFetch());
      }}></input><br/>
      {count} | {status}
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Provider store={store}>
      <Counter />
      </Provider>
    </div>
  );
}


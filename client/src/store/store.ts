import { configureStore } from "@reduxjs/toolkit";
import reducerJobs from "./reducer/todoListReducer"
const store = configureStore({
    reducer:{
        jobs:reducerJobs
    }
})

export default store
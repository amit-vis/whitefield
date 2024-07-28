import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducer/adminform_reducer";
import { employeeReducer } from "./reducer/employeeReducer";

export const store = configureStore({
    reducer:{
        user: userReducer,
        employee: employeeReducer
    }
})
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const adminRegister = createAsyncThunk("user/register", async (user, {rejectWithValue})=>{
    try {
        const {name, email, password} = user;
        const response = await axios.post("http://localhost:5000/create",{name, email, password});
        if(response.status === 200){
            const data = response.data;
            return data
        }else{
            const errorData = response.data;
            return rejectWithValue(errorData)
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
})

export const adminSignin = createAsyncThunk("user/loggedin", async (user, {rejectWithValue})=>{
    try {
        const {email, password} = user;
        const response = await axios.post("http://localhost:5000/logged-in",{email, password});
        if(response.status === 200){
            const data = response.data
            return data
        }else{
            const errorData = response.data;
            return rejectWithValue(errorData)
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const logoutUser = createAsyncThunk("user/signout", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.post("http://localhost:5000/logout",{},{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        if (response.status === 200) {
            const data = response.data
            return data
        } else {
            const errorData = response.data
            return rejectWithValue(errorData)
        }
    } catch (error) {
        if (error.response) {
            console.error("Server responded with error:", error.response.data); // Log server response
            return rejectWithValue(error.response.data);
        } else {
            console.error("Error message:", error.message); // Log error message
            return rejectWithValue(error.message);
        }
    }
})

export const getUserDetails = createAsyncThunk("user/details", async (_,{rejectWithValue})=>{
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:5000/get-user`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (response.status === 200) {
            const data = response.data
            return data
        } else {
            const errorData = response.data
            return rejectWithValue(errorData)
        }
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const initialstate = {
    status: "Idle",
    user:null,
    error: null
}

const userSlice = createSlice({
    name:"user-admin",
    initialState: initialstate,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(adminRegister.pending, (state)=>{
            state.status = "pending.."
        })
        .addCase(adminRegister.fulfilled, (state)=>{
            state.status = "succeeded"
        })
        .addCase(adminRegister.rejected, (state, action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(adminSignin.pending, (state)=>{
            state.status = "Pending"
        })
        .addCase(adminSignin.fulfilled, (state, action)=>{
            state.status = "succeeded"
            localStorage.setItem("token", action.payload.token)
        })
        .addCase(adminSignin.rejected, (state, action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(logoutUser.pending, (state)=>{
            state.status = "Pending"
        })
        .addCase(logoutUser.fulfilled, (state, action)=>{
            state.status = "succeeded"
        })
        .addCase(logoutUser.rejected, (state, action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(getUserDetails.pending, (state) => {
            state.status = "Pending"
        })
        .addCase(getUserDetails.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.user = action.payload.user
        })
        .addCase(getUserDetails.rejected, (state, action) => {
            state.status = "Failed"
            state.error = action.payload
        })
    }
});

export const userReducer = userSlice.reducer;
export const userSelector = (state)=>state.user;
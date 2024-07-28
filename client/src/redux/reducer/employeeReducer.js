import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createEmployee = createAsyncThunk("create/employee", async (employee, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:5000/employee/create",
            employee, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        if (response.status === 200) {
            const data = response.data;
            return data;
        } else {
            const errorData = response.data;
            return rejectWithValue(errorData);
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue({ message: error.message });
        }
    }
});

export const getEmployee = createAsyncThunk("get/employee", async ({search, page},{rejectWithValue})=>{
    try { 
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/employee/get-details",{
            headers:{
                "Authorization": `Bearer ${token}`
            },
            params:{
                search,
                page
            }
        });
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
            return rejectWithValue({ message: error.message });
        }
    }
})

export const getsingleData = createAsyncThunk("get/single", async (id,{rejectWithValue})=>{
    try { 
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/employee/single-data/${id}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
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
            return rejectWithValue({ message: error.message });
        }
    }
});

export const deleteEmployee = createAsyncThunk("delete/employee", async (id, {rejectedWithValue})=>{
    try { 
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:5000/employee/delete/${id}`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.status === 200){
            const data = response.data;
            return data
        }else{
            const errorData = response.data;
            return rejectedWithValue(errorData)
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectedWithValue(error.response.data);
        } else {
            return rejectedWithValue({ message: error.message });
        }
    }
})

export const editEmployee = createAsyncThunk("edit/employee", async ({id,employee}, {rejectWithValue})=>{
    try { 
        const token = localStorage.getItem("token");
        const response = await axios.patch(`http://localhost:5000/employee/update/${id}`,employee,{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
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
            return rejectWithValue({ message: error.message });
        }
    }
})

const initialState = {
    status:"idle",
    error: null,
    employeeData: [],
    singleEmp: null,
    currentPage: null,
    totalPage: null
}

const employeeSlice = createSlice({
    name: "emplyee",
    initialState: initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(createEmployee.pending, (state)=>{
            state.status = "Pending.."
        })
        .addCase(createEmployee.fulfilled, (state)=>{
            state.status = "Succeeded"
        })
        .addCase(createEmployee.rejected, (state, action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(getEmployee.pending, (state)=>{
            state.status = "Pending.."
        })
        .addCase(getEmployee.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.employeeData = action.payload.employees
            state.currentPage = action.payload.currentPage
            state.totalPage = action.payload.totalPages
        })
        .addCase(getEmployee.rejected, (state,action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(getsingleData.pending, (state)=>{
            state.status = "Pending.."
        })
        .addCase(getsingleData.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.singleEmp = action.payload
        })
        .addCase(getsingleData.rejected, (state,action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(deleteEmployee.pending, (state)=>{
            state.status = "Pending.."
        })
        .addCase(deleteEmployee.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.employeeData = state.employeeData.filter(emp=>emp._id !== action.payload._id)
        })
        .addCase(deleteEmployee.rejected, (state,action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
        .addCase(editEmployee.pending, (state)=>{
            state.status = "Pending.."
        })
        .addCase(editEmployee.fulfilled, (state, action)=>{
            state.status = "succeeded"
            const updateddata = action.payload.employee;
            const index = state.employeeData.findIndex(emp=>emp._id === updateddata._id);
            if(index>=0){
                state.employeeData[index] = updateddata;
            }
        })
        .addCase(editEmployee.rejected, (state,action)=>{
            state.status = "Failed"
            state.error = action.payload
        })
    }
});

export const employeeReducer = employeeSlice.reducer;
export const employeeSelector = (state)=>state.employee;
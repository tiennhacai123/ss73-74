import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Job } from "../../interface";
import axios from "axios";

const state:Job[] = []

// hàm render jobs
export const getJobs:any = createAsyncThunk("jobs/getJobs",
    async ()=>{
        const response = await axios.get("  http://localhost:8080/jobs")
        return response.data
    }
)

// hàm thực hiện thêm job
export const addJob:any = createAsyncThunk("jobs/addJob",
    async (job)=>{
        const response = await axios.post("  http://localhost:8080/jobs",job)
        return response.data
    }
)

//hàm xóa công việc
export const deleteJob:any = createAsyncThunk("jobs/deleteJob",
    async (id)=>{
        const response = await axios.delete(`  http://localhost:8080/jobs/${id}`)
        return id
    }
)

/// Change job status
export const changeStatus:any = createAsyncThunk("jobs/changeStatus", async ({ id, status }: { id: number, status: boolean }) => {
    const response = await axios.patch(`  http://localhost:8080/jobs/${id}`, { status });
    return response.data;
  });
  
// hàm chỉnh sửa công việc
export const updateJob:any = createAsyncThunk("jobs/updateJob",
    async ({ id, name }: { id: number; name: string }) => {
      const response = await axios.patch(`  http://localhost:8080/jobs/${id}`, { name });
      return response.data;
    }
  )
//Lọc công việc đã hoàn thành
export const filterComplete:any = createAsyncThunk("jobs/filterComplete",
    async ()=>{
        const response = await axios.get("  http://localhost:8080/jobs")
        return response.data
    }
)
const reducerJobs = createSlice({
    name:"reducerJobs",
    initialState:{
        jobs:state
    },
    reducers:{

    },
    extraReducers(builder) {
        builder
        .addCase(getJobs.pending, (state, action)=>{})
        // lấy dữ liệu ra
        .addCase(getJobs.fulfilled,(state,action)=>{
            //lấy dữ liệu thành công
            state.jobs = action.payload
        })
        .addCase(getJobs.rejected,()=>{})
        // thêm công việc
        .addCase(addJob.fulfilled,(state,action)=>{
            state.jobs.push(action.payload)
        })
        // xóa công việc
        .addCase(deleteJob.fulfilled,(state,action)=>{
            state.jobs = state.jobs.filter((job)=> job.id !== action.payload)
        })
        // hàm cập nhật lại trạng thái
        .addCase(changeStatus.fulfilled,(state,action)=>{
            const index = state.jobs.findIndex((job)=> job.id === action.payload.id)
            if(index !== -1){
                state.jobs[index] = action.payload
            }
        })
        // hàm cập nhật lại công việc
        .addCase(updateJob.fulfilled,(state,action)=>{
            const index = state.jobs.findIndex((job)=> job.id === action.payload.id)
            if(index !== -1){
                state.jobs[index] = action.payload
            }
        })
        // hàm lọc công việc hoàn thành
        .addCase(filterComplete.fulfilled,(state,action)=>{
            
        })
    },
})

export default reducerJobs.reducer
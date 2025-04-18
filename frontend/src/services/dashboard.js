import axios from "axios"

const fetchDashboardData = async()=>{
    try {
        const response = await axios.get(`/api/v1/dashboard/stats`, {
            withCredentials: true
        })
        console.log(response.data.data);
        if(response.status === 200){
            return response.data.data;
            
            
        }
    } catch (error) {
        console.error("Error in fetching dashboard data", error)
    }
}

export{
    fetchDashboardData
}
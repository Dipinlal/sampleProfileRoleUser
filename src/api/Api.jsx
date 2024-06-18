import axios from "axios"
import { baseUrlWEB } from "../config";


const api = axios.create({
    baseURL: baseUrlWEB,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Function to refresh the access token
const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      const payload = { refershToken: refreshTokenValue };
      const response = await axios.get(`${baseUrlWEB}Security/RegenerateTokens`, {
        params: payload,
      });
  
      const { accessToken, refreshToken } = response?.data;
  
      // Update the local storage with the new tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
  
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
  
      // Clear tokens from local storage in case of an error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
  
      throw error;
    }
  };
  
// Interceptor for API requests
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  
// Interceptor for API responses
api.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          // Try to refresh the token
          const newAccessToken = await refreshToken();
          // Retry the original request with the new access token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios.request(error.config);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  
export const getLogin=async(payload)=>{
    try {
        const response = await api.post("/Login/login", payload);
        return response;
    } catch (error) {
        console.log( "login api",error);
        throw error;
    }
}


export const getLoginCompany = async (payload) => {
    try {
      const response = await api.get("/Login/GetCompany", {
        params: payload,
      });
      return response;
    } catch (error) {
      console.error("getLoginCompany", error);
      throw error;
    }
  };
  
  const makeAuthorizedRequest = async (method, url, params) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
  
      let response;
      switch (method.toLowerCase()) {
        case "get":
          response = await api.get(url, { headers, params });
          break;
        case "post":
          response = await api.post(url, params, { headers });
          break;
        case "delete":
          response = await api.delete(url, { headers, params });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
  
      return response;
    } catch (error) {
      console.error(`Error in ${url}`, error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  };
  




export const GetMenuData= async()=>{
return makeAuthorizedRequest("get","Profile/GetMenuData")
}

export const GetProfileSummary= async()=>{
  return makeAuthorizedRequest("get","Profile/GetProfileSummary")
  }

  
export const GetActions= async(payload)=>{
   return makeAuthorizedRequest("get","Profile/GetActions",payload );
  }

  
export const UpsertProfile= async(data,payload)=>{
  return makeAuthorizedRequest("post",`Profile/UpsertProfile?profileId=${data.profileId}&profileName=${data.profileName}`,payload);

 }

 export const GetProfileDetails= async(payload)=>{
   return makeAuthorizedRequest("get","Profile/GetProfileDetails",payload);
  }

  
 export const DeleteProfile= async(payload)=>{
  return makeAuthorizedRequest("delete","Profile/DeleteProfile",payload);
 }



///ROLE API HERE----------------------------------------------------------------------------------------------------------------------------------------
 
 export const GetRoleSummary= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetRoleSummary",payload);
 }

 
 export const GetProfiles= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetProfiles",payload);
 }

 
 export const GetRoleProfile= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetRoleProfile",payload);
 }
 export const GetRoleDetails= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetRoleDetails",payload);
 }
 
 export const GetRoleActions= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetActions",payload);
 }

 
 export const GetMasters= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetMasters",payload);
 } 
 export const GetMasterData= async(data)=>{
  return makeAuthorizedRequest("get",`Role/GetMasterData?masterId=${data.masterId}&searchCondition=${data.searchCondition}&typeId=${data.typeId}`);
 }

 export const GetEntryRestriction= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetEntryRestriction",payload);
 }

 export const GetTransactionRights= async(payload)=>{
  return makeAuthorizedRequest("get","Role/GetTransactionRights",payload);
 }

 export const UpsertRole= async(payload)=>{
  return makeAuthorizedRequest("post","Role/UpsertRole",payload);
 }
 export const DeleteRole= async(payload)=>{
  return makeAuthorizedRequest("get","Role/DeleteRole",payload);
 }
 


//Users------------------------------------------------------------------------------------------
export const GetUserSummary= async(payload)=>{
  return makeAuthorizedRequest("get","Users/GetUserSummary",payload);
 }
 export const GetRoles= async(payload)=>{
  return makeAuthorizedRequest("get","Users/GetRoles",payload);
 }
 export const DeleteUser= async(payload)=>{
  return makeAuthorizedRequest("delete","Users/DeleteUser",payload);
 }

 export const UpsertUser= async(payload)=>{
  return makeAuthorizedRequest("post","Users/UpsertUser",payload);
 }

 export const GetUserDetails= async(payload)=>{
  return makeAuthorizedRequest("get","Users/GetUserDetails",payload);
 }
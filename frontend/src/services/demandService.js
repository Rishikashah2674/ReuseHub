import axios from "axios";

const API_URL = "http://localhost:5000/api/demands";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createDemand = async (demandData) => {
  const response = await axios.post(API_URL, demandData, getAuthHeader());
  return response.data;
};

export const getAllDemands = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getMyDemands = async () => {
  const response = await axios.get(`${API_URL}/my`, getAuthHeader());
  return response.data;
};

export const updateDemand = async (id, demandData) => {
  const response = await axios.put(`${API_URL}/${id}`, demandData, getAuthHeader());
  return response.data;
};

export const deleteDemand = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};
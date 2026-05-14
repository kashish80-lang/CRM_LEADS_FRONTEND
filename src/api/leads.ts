import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
});

export const getLeads = async () => {
  const response = await api.get("/leads");
  return response.data;
};

export const createLead = async (leadData: any) => {
  const response = await api.post("/leads", leadData);
  return response.data;
};

export const deleteLead = async (id: number) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

export const updateLead = async ({
  id,
  data,
}: {
  id: number;
  data: any;
}) => {

  const response = await api.put(
    `/leads/${id}`,
    data
  );

  return response.data;
};
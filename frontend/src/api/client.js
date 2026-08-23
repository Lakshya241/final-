import axios from 'axios';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchAcquisitions = async (filterParams) => {
  const res = await apiClient.post('/acquisitions/search', filterParams);
  return res.data;
};

export const runAnalysis = async (analysisReq) => {
  const res = await apiClient.post('/analysis/run', analysisReq);
  return res.data;
};

export const getLatestAnalysis = async () => {
  const res = await apiClient.get('/analysis/latest');
  return res.data;
};

export const validateChangeEvent = async (validationReq) => {
  const res = await apiClient.post('/validation/validate', validationReq);
  return res.data;
};

export const runSensitivityExperiment = async (expReq) => {
  const res = await apiClient.post('/experiments/run', expReq);
  return res.data;
};

export const getExperiment = async (expId) => {
  const res = await apiClient.get(`/experiments/${expId}`);
  return res.data;
};

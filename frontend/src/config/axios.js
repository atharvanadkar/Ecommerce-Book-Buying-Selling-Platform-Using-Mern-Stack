import axios from 'axios'

// Use environment variable with fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

export const axiosi = axios.create({
  withCredentials: true,
  baseURL: API_URL
})
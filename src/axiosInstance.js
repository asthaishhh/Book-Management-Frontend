import axios from 'axios';

const baseUrl = axios.create({
  baseURL: 'http://localhost:8000/book/',
  headers: {
    'Content-Type': 'application/json'
  }
});
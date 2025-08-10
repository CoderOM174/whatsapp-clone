// src/api/messages.js
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export const getChats = () => axios.get(`${API}/messages/chats`);
export const getMessages = (wa_id) => axios.get(`${API}/messages/${wa_id}`);
export const sendMessage = (data) => axios.post(`${API}/messages`, data);

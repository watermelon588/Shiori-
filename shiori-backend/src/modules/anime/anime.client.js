import axios from 'axios';

const ANILIST_URL = "https://graphql.anilist.co";


export const anilistClient = axios.create({
  baseURL: ANILIST_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
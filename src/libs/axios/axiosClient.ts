import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_MAGENTO_TOKEN;
const baseURL = process.env.NEXT_PUBLIC_MAGENTO_BASE_URL;

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

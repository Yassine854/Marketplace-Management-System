import axios from "axios";
const TOKEN = process.env.MAGENTO_TOKEN;

export const axiosClient = axios.create({
  baseURL: "https://accept.kamioun.com/rest/default/V1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

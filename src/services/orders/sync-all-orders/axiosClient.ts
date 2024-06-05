import axios from "axios";
const TOKEN = "pd2as4cqycmj671bga4egknw2csoa9b6";

export const axiosClient = axios.create({
  baseURL: "https://accept.kamioun.com/rest/default/V1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

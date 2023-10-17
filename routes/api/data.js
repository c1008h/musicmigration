const axios = require("axios");
const token = process.env.BEARER_TOKEN;

const data = axios.get(
  "https://api.spotify.com/v1/me/top/tracks?limit=50",
  {
    headers: {
      Authorization: "Bearer " + {token},
    },
  }
);

console.log(data)
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const fs = require("fs");

const login = async () => {
  const loginConfig = {
    method: "get",
    url:
      "https://www.problemator.fi/t/problematorapi/v01/dologin?username=" +
      process.env.USERNAME +
      "&password=" +
      process.env.PASSWORD,
  };
  let response = await axios(loginConfig as any);
  const session = response.headers["set-cookie"][0].split(" ")[0];
  const auth = response.headers["set-cookie"][1].split(" ")[0].split("=")[1];
  const routeConfig = {
    method: "get",
    url:
      "https://www.problemator.fi/t/problematorapi/v01/problems/?react=true&loc=3",
    headers: {
      authID: auth,
      Cookie: session + auth,
    },
  };
  await axios(routeConfig as any)
    .then((response) => {
      let result = JSON.stringify(response.data);
      fs.writeFileSync("./json/herttoniemi_reitit.json", result);
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default login;

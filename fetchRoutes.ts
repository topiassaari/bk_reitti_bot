const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const fetchRoutes = async () => {
  await axios
    .get(
      "https://www.problemator.fi/t/problematorapi/v01/dologin?username=" +
        process.env.USERNAME +
        "&password=" +
        process.env.PASSWORD
    )
    .then((response: any) => {
      const session = response.headers["set-cookie"][0].split(" ")[0];
      const auth = response.headers["set-cookie"][1]
        .split(" ")[0]
        .split("=")[1];
      const loginInfo = [session, auth];
      return loginInfo;
    })
    .then((loginInfo: any) => {
      const gyms = [
        { name: "pasila", id: 1 },
        { name: "konala", id: 2 },
        { name: "herttoniemi", id: 3 },
        { name: "espoo", id: 132 },
      ];

      gyms.forEach((gym) => {
        axios
          .get(
            "https://www.problemator.fi/t/problematorapi/v01/problems/?react=true&loc=" +
              gym.id,
            {
              headers: {
                authID: loginInfo[0],
                Cookie: loginInfo[0] + loginInfo[1],
              },
            }
          )
          .then((response: any) => {
            let result = JSON.stringify(response.data);
            fs.writeFileSync("./json/" + gym.name + "_reitit.json", result);
            console.log(result);
          })
          .catch((error: any) => {
            console.log(error);
          });
      });
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export default fetchRoutes;

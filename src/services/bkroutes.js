const axios = require("axios");

const login = async (username, password) => {
  const result = await axios
    .get(
      `https://www.problemator.fi/t/problematorapi/v01/dologin?username=${username}&password=${password}`
    )
    .then((response) => {
      const session = response.headers["set-cookie"][0].split(" ")[0];
      const auth = response.headers["set-cookie"][1]
        .split(" ")[0]
        .split("=")[1];
      const login = [session, auth];
      return login;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};
const getRoutes = async (loginInfo, id) => {
  const routes = await axios
    .get(
      "https://www.problemator.fi/t/problematorapi/v01/problems/?react=true&loc=" +
        id,
      {
        headers: {
          authID: loginInfo[0],
          Cookie: loginInfo[0] + loginInfo[1],
        },
      }
    )
    .catch((e) => {
      console.log(e);
    });
  return routes.data;
};

module.exports = { login, getRoutes };

const fs = require("fs");

//parse new routes
const parseNewRoutes = (gym: any) => {
  var gym = JSON.parse(fs.readFileSync("./json/" + gym + "_reitit.json"));
  var uudetReitit: any;
  Object.entries(gym).forEach((sector: any) => {
    sector[1].problems.forEach((problem: any) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      if (
        addeddate.includes("second") ||
        addeddate.includes("minute") ||
        addeddate.includes("hour")
      ) {
        uudetReitit += grade + " " + color + " " + wall + " \n";
        return uudetReitit;
      } else {
        return null;
      }
    });
  });
  var NewRoutes;
  if (uudetReitit !== undefined) {
    NewRoutes = uudetReitit.replace("undefined", "");
  } else {
    NewRoutes = "eioo";
  }
  fs.writeFileSync("./json/uudet" + gym.name + "_uudet_reitit.json", NewRoutes);
  return NewRoutes;
};
export default parseNewRoutes;

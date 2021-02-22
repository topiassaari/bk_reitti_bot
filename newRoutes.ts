const fs = require("fs");

//parse new routes
const parseNewRoutes = (timeSpan: any) => {
  var herttoniemi = JSON.parse(
    fs.readFileSync("./json/herttoniemi_reitit.json")
  );
  var uudetReitit: any;
  Object.entries(herttoniemi).forEach((sector: any) => {
    sector[1].problems.forEach((problem: any) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      if (addeddate.includes(timeSpan)) {
        uudetReitit += grade + " " + color + " " + wall + " \n";
        return uudetReitit;
      } else {
        return null;
      }
    });
  });
  var herttoniemiNewRoutes;
  if (uudetReitit !== undefined) {
    herttoniemiNewRoutes = uudetReitit.replace("undefined", "");
  } else {
    herttoniemiNewRoutes = "eioo";
  }
  console.log(herttoniemiNewRoutes);
  return herttoniemiNewRoutes;
};

export default parseNewRoutes;

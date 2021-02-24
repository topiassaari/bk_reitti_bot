const fs = require("fs");

//parse new routes from one of the gyms
const parseNewRoutes = (gym: any) => {
  //get the json generated in fetchRoutes
  var gymData = JSON.parse(fs.readFileSync("./json/" + gym + "_reitit.json"));
  let newRoutes: any;
  //go through that data
  Object.entries(gymData).forEach((sector: any) => {
    sector[1].problems.forEach((problem: any) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      //if a route has been added within the last 9h...
      if (
        addeddate.includes("second") ||
        addeddate.includes("minute") ||
        addeddate.includes([1 - 9] + " hour")
      ) {
        //...add it to a string of new routes
        newRoutes += grade + " " + color + " " + wall + " \n";
        return newRoutes;
      } else {
        //...or if not, don't
        return null;
      }
    });
  });
  //make the final output
  let todaysRoutes;
  //if there are new routes, remove any weird undefineds that might be left from the fetched data
  if (newRoutes !== undefined) {
    todaysRoutes = newRoutes.replace("undefined", "");
  }
  //and if there are no new routes, return a short string saying there are no routes
  else {
    todaysRoutes = "eioo";
  }
  return todaysRoutes;
};
export default parseNewRoutes;
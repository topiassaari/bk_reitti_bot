const fs = require("fs");

//parse new routes from one of the gyms
const parseNewRoutes = (gym: any, timespan: any) => {
  //get the json generated in fetchRoutes
  var gymData = JSON.parse(fs.readFileSync("./json/" + gym + "_reitit.json"));
  var newRoutes: any;
  var sectorOfNewRoutes = "";
  //go through that data
  Object.entries(gymData).forEach((sector: any) => {
    sector[1].problems.forEach((problem: any) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      const name = problem.walldesc;
      //if a route has been added within the last 2h... (for automatic group chat post)
      if (
        timespan == "now" &&
        (addeddate.includes("sec") ||
          addeddate.includes("min") ||
          addeddate.match("1 hour ago"))
      ) {
        //...add it to a string of new routes
        if (!sectorOfNewRoutes.includes(name + " (" + wall + ")\n")) {
          sectorOfNewRoutes += name + " (" + wall + ")\n";
        }
        newRoutes += grade + " " + color + " " + wall + " \n";
        return newRoutes && sectorOfNewRoutes;
      }
      //if a route has been added within the last 9h... (for bot commands), its a bit ugly but fuck it
      else if (
        timespan == "today" &&
        (addeddate.includes("sec") ||
          addeddate.includes("min") ||
          addeddate.match(/\d hours? ago/))
      ) {
        //...add it to a string of new routes
        if (!sectorOfNewRoutes.includes(name + " (" + wall + ")\n")) {
          sectorOfNewRoutes += name + " (" + wall + ")\n";
        }
        newRoutes += grade + " " + color + " " + wall + " \n";

        return newRoutes && sectorOfNewRoutes;
      } else {
        //...or if not, don't
        return null;
      }
    });
  });
  //make the final output
  var todaysRoutes;
  //if there are new routes, remove any weird undefineds that might be left from the fetched data
  if (newRoutes !== undefined) {
    todaysRoutes =
      sectorOfNewRoutes + "\n" + newRoutes.replace("undefined", "");
  }
  //and if there are no new routes, return a short string saying there are no routes
  else {
    todaysRoutes = "eioo";
  }
  return todaysRoutes;
};
export default parseNewRoutes;

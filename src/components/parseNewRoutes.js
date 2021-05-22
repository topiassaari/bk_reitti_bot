const parseNewRoutes = (gym) => {
  var newRoutes;
  var sectorOfNewRoutes = "";
  Object.entries(gym.routes).forEach((sector) => {
    sector[1].problems.forEach((problem) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      const name = problem.walldesc;
      //if a route has been added within the last 2h... (for automatic group chat post)
      if (
        addeddate.includes("sec") ||
        addeddate.includes("min") ||
        addeddate.match(/\d hours? ago/)
      ) {
        //...add it to a string of new routes
        if (!sectorOfNewRoutes.includes(`${name} (${wall})\n`)) {
          sectorOfNewRoutes += `${name} (${wall})\n`;
        }
        newRoutes += `${grade} ${color} ${wall}\n`;
        return newRoutes && sectorOfNewRoutes;
      } else {
        return null;
      }
    });
  });
  //make the final output
  let todaysRoutes;
  //if there are new routes, remove any weird undefineds that might be left from the fetched data
  if (newRoutes !== undefined) {
    todaysRoutes = `${sectorOfNewRoutes}\n${newRoutes.replace(
      "undefined",
      ""
    )}`;
  }
  //and if there are no new routes, return a short string saying there are no routes
  else {
    todaysRoutes = "eioo";
  }
  return todaysRoutes;
};

module.exports = parseNewRoutes;

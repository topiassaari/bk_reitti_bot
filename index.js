const parseNewRoutes = require("./src/components/parseNewRoutes");
const routeService = require("./src/services/bkroutes");
const getToday = require("./src/utils/date");
const gyms = require("./src/utils/initialGyms");
const dotenv = require("dotenv");
const cron = require("node-cron");
const express = require("express");
const { Telegraf } = require("telegraf");

dotenv.config();
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

const init = (gyms) => {
  routeService
    .login(process.env.USERNAME, process.env.PASSWORD)
    .then((loginInfo) => {
      gyms.forEach((gym) => {
        routeService.getRoutes(loginInfo, gym.id).then((routes) => {
          gym.routes = routes;
        });
      });
      return gyms;
    })
    .then((gyms) => {
      bot.start((ctx) => ctx.reply("bk uudet reitit"));
      bot.command("/id", (ctx) => {
        ctx.reply(JSON.stringify(ctx.message));
      });
      gyms.forEach((gym) => {
        bot.command("/" + gym.name, (ctx) => {
          if (gym.routes) {
            ctx.reply(`${getToday()}\n${gym.name}\n\n${parseNewRoutes(gym)}`);
          }
        });
      });
      process.once("SIGINT", () => bot.stop("SIGINT"));
      process.once("SIGTERM", () => bot.stop("SIGTERM"));

      bot.launch();
    });
};

cron.schedule("00 19 * * MON-FRI", () => {
  routeService
    .login(process.env.USERNAME, process.env.PASSWORD)
    .then((loginInfo) => {
      gyms.forEach((gym) => {
        routeService.getRoutes(loginInfo, gym.id).then((routes) => {
          gym.routes = routes;
          var newRoutes = parseNewRoutes(gym);
          if (newRoutes !== "eioo") {
            bot.telegram.sendMessage(
              process.env.CHAT,
              `${getToday()}\n${gym.name}\n\n${newRoutes}`
            );
            console.log(`${getToday()}\n${gym.name}\n\n${newRoutes}`);
          } else {
            console.log(`no new routes at ${gym.name} today (${getToday()})`);
          }
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
});
init(gyms);
app.listen(8080);

import { Telegraf } from "telegraf";
import fetchRoutes from "./fetchRoutes";
import parseNewRoutes from "./parseNewRoutes";
const dotenv = require("dotenv");
const fs = require("fs");
const cron = require("node-cron");
const express = require("express");

//init server, create a folder for the route data, fetch all route data and list possible gyms
dotenv.config();
const app = express();
app.listen(8080);
fs.mkdirSync("./json");
fetchRoutes();
const namesOfGyms = ["pasila", "konala", "herttoniemi", "espoo"];

const getToday = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var ddmmyyyy = dd + "/" + mm + "/" + yyyy;
  return ddmmyyyy;
};

// set up bot
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(process.env.BOT_TOKEN);

//set up bot commands
bot.start((ctx) => ctx.reply("bk uudet reitit"));
bot.command("/id", (ctx) => {
  ctx.reply(JSON.stringify(ctx.message));
});
namesOfGyms.forEach((gym) => {
  bot.command("/" + gym, (ctx) => {
    ctx.reply(getToday() + "\n" + gym + "\n\n" + parseNewRoutes(gym, "today"));
  });
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//every day, get the newest routes, and if there are any, post them to the groupchat
cron.schedule("00 7-17/2 * * MON-FRI", () => {
  fetchRoutes().then(() => {
    namesOfGyms.forEach((gym) => {
      var routes = parseNewRoutes(gym, "now");
      console.log(routes);
      if (routes !== "eioo") {
        bot.telegram.sendMessage(
          process.env.CHAT,
          getToday() + "\n" + gym + "\n\n" + routes
        );
      } else {
        console.log("no new routes to post today");
      }
    });
  });
});

bot.launch();

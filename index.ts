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
    ctx.reply(gym + ": \n\n" + parseNewRoutes(gym));
  });
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//every day, get the newest routes, and if there are any, post them to the groupchat
cron.schedule("00 14 * * *", () => {
  fetchRoutes();
  namesOfGyms.forEach((gym) => {
    if (parseNewRoutes(gym) !== "eioo") {
      bot.telegram.sendMessage(
        process.env.CHAT,
        gym + ", tänään:\n\n" + parseNewRoutes(gym)
      );
    } else {
      console.log("no new routes to post today");
    }
  });
});

bot.launch();

import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import fetchRoutes from "./fetchRoutes";
import parseNewRoutes from "./parseNewRoutes";
const fs = require("fs");
const cron = require("node-cron");
const express = require("express");
dotenv.config();

//init
const app = express();
app.listen(8080);
fs.mkdirSync("./json");
fetchRoutes();

// set up bot
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("bk uudet reitit"));
bot.command("/id", (ctx) => {
  ctx.reply(JSON.stringify(ctx.message));
});

var namesOfGyms = ["pasila", "konala", "herttoniemi", "espoo"];

namesOfGyms.forEach((gym) => {
  bot.command("/" + gym, (ctx) => {
    ctx.reply(gym + ": \n\n" + parseNewRoutes(gym));
  });
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//start cron process
cron.schedule("00 14 * * *", () => {
  fetchRoutes();
  namesOfGyms.forEach((gym) => {
    if (parseNewRoutes(gym) !== "eioo") {
      bot.telegram.sendMessage(
        process.env.CHAT,
        gym + ", tänään:" + parseNewRoutes(gym)
      );
    } else {
      console.log("no new routes to post");
    }
  });
});

bot.launch();

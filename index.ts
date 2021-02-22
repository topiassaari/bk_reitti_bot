import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import login from "./login";
import parseNewRoutes from "./newRoutes";
const fs = require("fs");
const cron = require("node-cron");
const express = require("express");
dotenv.config();

//set up server and directory for data
const app = express();
app.listen(8080);
fs.mkdirSync("./json");

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
bot.command("/day", (ctx) => {
  ctx.reply("Tänään:\n" + parseNewRoutes("hour"));
});
bot.command("/week", (ctx) => {
  ctx.reply(
    "Tänään:\n" +
      parseNewRoutes("hour") +
      "\n \n \nTällä viikolla:\n" +
      parseNewRoutes("day")
  );
});
bot.command("/month", (ctx) => {
  ctx.reply(
    "Tänään:\n" +
      parseNewRoutes("hour") +
      "\n\n\nTällä viikolla:\n" +
      parseNewRoutes("day") +
      "\n\n\nTässä kuussa:\n" +
      parseNewRoutes("week")
  );
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//start cron process
cron.schedule("30 14 * * *", function () {
  login();
  if (parseNewRoutes("hour") !== "eioo") {
    bot.telegram.sendMessage(process.env.CHAT, parseNewRoutes("hour"));
  } else {
    console.log("no new routes to post");
  }
});

login();
bot.launch();

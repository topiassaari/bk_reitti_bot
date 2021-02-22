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
  ctx.reply("Tänään:\n" + parseNewRoutes("hours"));
});
bot.command("/week", (ctx) => {
  ctx.reply(
    "Tänään:\n" +
      parseNewRoutes("hours") +
      "\n \n \nTällä viikolla:\n" +
      parseNewRoutes("days")
  );
});
bot.command("/month", (ctx) => {
  ctx.reply(
    "Tänään:\n" +
      parseNewRoutes("hours") +
      "\n\n\nTällä viikolla:\n" +
      parseNewRoutes("days") +
      "\n\n\nTässä kuussa:\n" +
      parseNewRoutes("weeks")
  );
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//start cron process
cron.schedule("00 16 * * *", function () {
  login();
  if (parseNewRoutes("hours") !== "eioo") {
    bot.telegram.sendMessage(process.env.CHAT, parseNewRoutes("hours"));
  } else {
    console.log("no new routes to post");
  }
});

login();
bot.launch();

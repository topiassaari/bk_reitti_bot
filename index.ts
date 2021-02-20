import { Telegraf } from "telegraf";
import axios from "axios";
import * as dotenv from "dotenv";
import { CronJob } from "cron";
dotenv.config();

// set up bot
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("bk herttoniemi uudet reitit"));
bot.command("/id", (ctx) => {
  ctx.reply(JSON.stringify(ctx.message));
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//login to problemator
const login = async () => {
  const loginConfig = {
    method: "get",
    url:
      "https://www.problemator.fi/t/problematorapi/v01/dologin?username=" +
      process.env.USERNAME +
      "&password=" +
      process.env.PASSWORD,
  };
  let response = await axios(loginConfig as any);
  const session = response.headers["set-cookie"][0].split(" ")[0];
  const auth = response.headers["set-cookie"][1].split(" ")[0].split("=")[1];
  const routeConfig = {
    method: "get",
    url:
      "https://www.problemator.fi/t/problematorapi/v01/problems/?react=true&loc=3",
    headers: {
      authID: auth,
      Cookie: session + auth,
    },
  };
  await axios(routeConfig as any)
    .then((response) => {
      const results = response.data;
      return newRoutes(results);
    })
    .catch((error) => {
      console.log(error);
    });
};

//parse new routes
const newRoutes = (gym: any) => {
  var uudetReitit;
  Object.entries(gym).forEach((sector: any) => {
    sector[1].problems.forEach((problem: any) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      if (addeddate.includes("hours ago")) {
        uudetReitit += grade + " " + color + " " + wall + " \n";
      } else {
        return null;
      }
    });
  });
  if (uudetReitit !== undefined) {
    console.log(uudetReitit.replace("undefined", ""));
    bot.telegram.sendMessage(process.env.CHAT, uudetReitit);
    return uudetReitit;
  } else {
    console.log("nothing to post");
    return null;
  }
};

//run it
var job = new CronJob("00 16 * * *", login());
job.start();
bot.launch();

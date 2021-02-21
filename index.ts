import { Telegraf } from "telegraf";
import axios from "axios";
import * as dotenv from "dotenv";
import { CronJob } from "cron";
dotenv.config();

//login to problemator
const login = async () => {
  let response = await axios.get(
    "https://www.problemator.fi/t/problematorapi/v01/dologin?username=" +
      process.env.USERNAME +
      "&password=" +
      process.env.PASSWORD
  );
  const session = response.headers["set-cookie"][0].split(" ")[0];
  const auth = response.headers["set-cookie"][1].split(" ")[0].split("=")[1];

  await axios
    .get(
      "https://www.problemator.fi/t/problematorapi/v01/problems/?react=true&loc=3",
      {
        headers: {
          authID: auth,
          Cookie: session + auth,
        },
      }
    )
    .then((response) => {
      const results = response.data;
      return results;
    })
    .catch((error) => {
      console.log(error);
    });
};

var problematorinfo = login();

//parse new routes
const newRoutes = (gym: any) => {
  var uudetReitit;
  Object.entries(gym).forEach((sector: any) => {
    sector[1].problems.forEach((problem: any) => {
      const grade = problem.gradename;
      const wall = problem.wallchar;
      const color = problem.colour;
      const addeddate = problem.addedrelative;
      if (addeddate.includes("days ago")) {
        uudetReitit += grade + " " + color + " " + wall + " \n";
      } else {
        return null;
      }
    });
  });
  if (uudetReitit !== undefined) {
    var reitit = "Herttoniemi \n \n" + uudetReitit.replace("undefined", "");
    console.log(reitit);
    return reitit;
  } else {
    return null;
  }
};

var newStuff = newRoutes(problematorinfo);

// set up bot
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(process.env.BOT_TOKEN);
//commands
bot.start((ctx) => ctx.reply("botti päällä"));
bot.command("/id", (ctx) => {
  ctx.reply(JSON.stringify(ctx.message));
});
bot.command("/uudet", (ctx) => {
  if (newStuff) {
    ctx.reply(newStuff);
  } else {
    ctx.reply("ei mitään uutta");
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//run it
var job = new CronJob("00 16 * * *", () => {
  //bot.telegram.sendMessage(process.env.CHAT, newStuff);
  console.log(newStuff);
});
var testjob = new CronJob("* * * * *", console.log("pimpom"));

job.start();
testjob.start();
bot.launch();

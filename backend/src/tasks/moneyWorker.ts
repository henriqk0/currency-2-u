import { redisConfig } from "../config/redis";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { NumberTuple, ConversionTableDictFormatted } from "../types/acronymWithValueTuple";
import { Queue } from 'bullmq';
import { EmailJobData } from "../types/emailJobData";

const puppeteer = require("puppeteer")

const mailQueue = new Queue('email-notifications', redisConfig);

const userService = new UserService(new UserRepository);

export async function pickCurrencyValuesAndFillEmailQueue () {
  const conversionTable: ConversionTableDictFormatted = await obtainConversionTable();

  const users = await userService.getAllUsers();

  users.forEach(async user => {
    const userInLabel = user.currencyInLabel 
    const userInValue = user.currencyInValue 

    const userOutLabel = user.currencyOutLabel 
    const userOutValue = user.currencyOutValue 
    const userToSell = user.toSell 

    const currentUserDesirableCurrencyValues = conversionTable[userOutLabel]![userInLabel]
    
    const isSandable: boolean = await userService.canSendEmail(user.id)

    if ( 
      isSandable &&
      (
        userToSell &&
        userOutValue / userInValue < currentUserDesirableCurrencyValues![1] / currentUserDesirableCurrencyValues![0] ) ||
      (
        !userToSell &&
        userOutValue / userInValue > currentUserDesirableCurrencyValues![1] / currentUserDesirableCurrencyValues![0] )
    ) {
      const job: EmailJobData = {email: user.email, data: currentUserDesirableCurrencyValues!}

      mailQueue.addBulk([{
        name: 'send-notification',
        data: job
      }]);
    }
  });
}

async function obtainConversionTable(): Promise<ConversionTableDictFormatted> {
  const brBTC: NumberTuple = await runScrapper("BTC", "BRL")
  // some are failing, perhaps because they happen too quickly or due to limitations of virtualization
  const brUSD: NumberTuple = await runScrapper("USD", "BRL")
  const brEUR: NumberTuple = await runScrapper("EUR", "BRL")
  const usaETH: NumberTuple = await runScrapper("ETH", "USD")

  const brETH: NumberTuple = [ 1, usaETH[1] * brUSD[1] ]     

  const btcBRL: NumberTuple = [ 1, 1 / brBTC[1] ]

  const eurBRL: NumberTuple = [ 1, 1 / brEUR[1] ]
  const eurUSD: NumberTuple = [ 1, brEUR[1]/brUSD[1] ]
  const eurBTC: NumberTuple = [ 1, brBTC[1]/brEUR[1] ]
  const eurETH: NumberTuple = [ 1, brETH[1]/brEUR[1] ]

  const usaBRL: NumberTuple = [ 1, 1 / brUSD[1] ]
  const usaEUR: NumberTuple = [ 1, brUSD[1]/brEUR[1] ]
  const usaBTC: NumberTuple = [ 1, brBTC[1]/brUSD[1] ]

  const btcUSD: NumberTuple = [ 1,  1 / usaBTC[1]]
  const btcETH: NumberTuple = [ 1,  usaETH[1] / usaBTC[1] ]
  const btcEUR: NumberTuple = [ 1,  usaETH[1] / usaBTC[1] ]

  const ethUSD: NumberTuple = [ 1, 1 / usaETH[1] ]
  const ethEUR: NumberTuple = [ 1, 1 / eurETH[1] ]
  const ethBTC: NumberTuple = [ 1, 1 / btcETH[1] ]
  const ethBRL: NumberTuple = [ 1, 1 / brETH[1] ]

  const conversionTable: ConversionTableDictFormatted = {
    BRL: {
      BTC: brBTC,
      USD: brUSD,
      EUR: brEUR,
      ETH: brETH,
    },
    USD: {
      BTC: usaBTC,
      BRL: usaBRL,
      EUR: usaEUR,
      ETH: usaETH,
    },
    EUR: {
      BTC: eurBTC,
      USD: eurUSD,
      BRL: eurBRL,
      ETH: eurETH,
    },
    ETH: {
      BTC: ethBTC,
      USD: ethUSD,
      EUR: ethBRL,
      BRL: ethBRL,
    },
    BTC: {
      BRL: btcBRL,
      USD: btcUSD,
      EUR: btcEUR,
      ETH: btcETH,
    },
  }

  return conversionTable
}

async function runScrapper(fromAcronym: string, toAcronym: string): Promise<NumberTuple> {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',     
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.goto(`https://www.oanda.com/currency-converter/pt/?from=${fromAcronym}&to=${toAcronym}&amount=1`);

    const values = await page.evaluate(() => {
      const values = Array.from(document.querySelectorAll(".MuiGrid-root"))

      const data = values.map((value) => ({
        value: value.querySelector(".MuiFilledInput-input")?.getAttribute("value"),
      }));

      const a = data
        .filter((v) => v.value)
        .filter((v, i, self) => 
          self.findIndex(x => x.value === v.value) === i // to select only the first value
        );

      return a;
    });

    console.log(values);
    return [values[0].value, values[1].value];
    
  } catch (error) { 
    console.error("Cannot obtain money values")
    return [0, 0]
  } finally {
    await browser.close()
  }
}

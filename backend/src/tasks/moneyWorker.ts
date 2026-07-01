import { redisConnectionProd } from "../config/redisConnection";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { NumberTuple, ConversionTableDictFormatted } from "../types/acronymWithValueTuple";
import { Queue } from 'bullmq';
import { EmailJobData } from "../types/emailJobData";

const puppeteer = require("puppeteer")

const mailQueue = new Queue('email-notifications', 
  {
    connection: redisConnectionProd
  }
);

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

    const currentUserDesirableCurrencyValues = conversionTable[userInLabel]![userOutLabel]!
    const rate = currentUserDesirableCurrencyValues[1] / currentUserDesirableCurrencyValues[0]
    
    if (!rate || !isFinite(rate)) return;

    const isSandable: boolean = await userService.canSendEmail(user.id)

    if ( 
      isSandable &&
      (
        (userToSell && userOutValue / userInValue < rate) ||
        (!userToSell && userOutValue / userInValue > rate)
      )
    ) {
      const job: EmailJobData = {email: user.email, data: currentUserDesirableCurrencyValues!}

      await userService.setNewLastSendedEmail(user.id)

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

  const conversionTable: ConversionTableDictFormatted = {
    BRL: {
      BTC: [1, 1 / brBTC[1]],
      USD: [1, 1 / brUSD[1]],
      EUR: [1, 1 / brEUR[1]],
      ETH: [1, 1 / brETH[1]],
    },
    USD: {
      BTC: [1, brUSD[1] / brBTC[1]],
      BRL: brUSD,
      EUR: [1, brUSD[1] / brEUR[1]],
      ETH: [1, 1 / usaETH[1]],
    },
    EUR: {
      BTC: [1, brEUR[1] / brBTC[1]],
      USD: [1, brEUR[1] / brUSD[1]],
      BRL: brEUR,
      ETH: [1, brEUR[1] / brETH[1]],
    },
    ETH: {
      BTC: [1, brETH[1] / brBTC[1]],
      USD: usaETH,
      EUR: [1, brETH[1] / brEUR[1]],
      BRL: brETH,
    },
    BTC: {
      BRL: brBTC,
      USD: [1, brBTC[1] / brUSD[1]],
      EUR: [1, brBTC[1] / brEUR[1]],
      ETH: [1, brBTC[1] / brETH[1]],
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
    await page.goto(`https://www.google.com/finance/quote/${fromAcronym}-${toAcronym}`);

    const value = await page.$eval('div.N6SYTe span[jsname="Pdsbrc"]', (el: { textContent: string; }) => el.textContent.trim());

    const currencyNumber = Number(value.replace(/,/g, ''));

    console.log(`[ 1, ${currencyNumber} ]`)

    return [1, currencyNumber];
    
  } catch (error) { 
    console.error("Cannot obtain money values")
    return [0, 0]
  } finally {
    await browser.close()
  }
}

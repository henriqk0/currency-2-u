const Queue = require('bull');
const puppeteer = require("puppeteer")

// const urlBrBTC = "https://www.oanda.com/currency-converter/pt/?from=BTC&to=BRL&amount=1" // put this at .env
// const urlBrUSD = "https://www.oanda.com/currency-converter/pt/?from=USD&to=BRL&amount=1" // put this at .env
// const urlBrEUR = "https://www.oanda.com/currency-converter/pt/?from=EUR&to=BRL&amount=1" // put this at .env
// const urlUsaETH = "https://www.oanda.com/currency-converter/pt/?from=ETH&to=USD&amount=1" // put this at .env

async function runWithComparisons() {
  const brBTC: number[] = await runScrapper("BTC", "BRL")
  const brUSD: number[] = await runScrapper("USD", "BRL")
  const brEUR: number[] = await runScrapper("EUR", "BRL")
  const usaETH: number[] = await runScrapper("ETH", "USD")
}

async function runScrapper(fromAcronym: string, toAcronym: string): Promise<number[]> {
  const browser = await puppeteer.launch({
    headless: false,
  });

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

  await browser.close();

  console.log(values);
  return [values[0].value, values[1].value];
}

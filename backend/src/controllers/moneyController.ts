import { Request, Response } from 'express'; 
const puppeteer = require("puppeteer")


const url = "https://www.oanda.com/currency-converter/pt/?from=BTC&to=BRL&amount=1" // put this at .env


class MoneyController {

  async fetchCurrentValues(req: Request, res: Response): Promise<void> {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    await page.goto(url);

    const values = await page.evaluate(() => {
      const values = Array.from(document.querySelectorAll(".MuiGrid-root"))
      // const posts = Array.from(document.querySelectorAll(".post-item"));

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

    res.json(values);
  }
}

const moneyController = new MoneyController();

export default moneyController;

// async function getMoney(req: Request, res: Response, next: NextFunction) {
//   try {
//     const fetched = await scrapper();
//     res.status(200).json({ fetched });
    
//   } catch {
//     res.status(500).json({
//       message: "Error fetching"
//     })
//   }
// }

async function scrapper() {


}
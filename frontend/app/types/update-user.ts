export interface IUpdateUserData {
  currencyInLabel: "USD" | "EUR" | "BRL" | "BTC" | "ETH";
  currencyInValue: number;
  currencyOutLabel: "USD" | "EUR" | "BRL" | "BTC" | "ETH";
  currencyOutValue: number;
  minIntervalSend: number;
  toSell: boolean;
}

export type UpdateProps = {
  token: string,
  id: string,
  userData: IUpdateUserData
}
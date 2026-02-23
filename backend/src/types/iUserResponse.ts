interface IUserResponse { 
  id: string;
  email: string;
  currencyInLabel: string;
  currencyInValue: number;
  currencyOutLabel: string;
  currencyOutValue: number;
  minIntervalSend: number;
  toSell: boolean;
}


export default IUserResponse;
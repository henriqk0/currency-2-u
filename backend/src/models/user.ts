import { Acronyms } from "../generated/prisma/enums";

export default class User {
  id!: string;
  email!: string;
  password!: string;
  currencyInLabel!: Acronyms;
  currencyInValue!: number;
  currencyOutLabel!: Acronyms;
  currencyOutValue!: number;
  lastSend!: Date | null;
  minIntervalSend!: number;
  toSell!: boolean;

  constructor(props: Omit<User, 'id'>, id?: string) {
    Object.assign(this, props);
    if (id) {
      this.id = id;
    }
  }
}

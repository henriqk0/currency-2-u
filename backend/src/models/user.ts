import { PrismaClient } from "@prisma/client/extension";

const userData = PrismaClient.User


export default class User {
  id!: string;
  email!: string;
  password!: string;
  currencyInLabel!: string;
  currencyInValue!: number;
  currencyOutLabel!: string;
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

type CheckUserConsistency = typeof userData extends User ? true : false;

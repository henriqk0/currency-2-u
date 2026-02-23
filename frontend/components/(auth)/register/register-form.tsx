"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link"
import { useState } from "react";
import { redirect } from "next/navigation"
import { CurrencyInputGroup } from "./currency-input-group"
import { useBoolean } from "@/hooks/use-boolean"
import { Switch } from "@/components/ui/switch"


interface ICreateUserData {
  email: string;
  password: string;
  currencyInLabel: string;
  currencyInValue: number;
  currencyOutLabel: string;
  currencyOutValue: number;
  minIntervalSend: number;
  toSell: boolean;
}

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currencyInLabel, setCurrencyInLabel] = useState<"USD" | "EUR" | "BRL" | "BTC" | "ETH">("USD"); // use zod to validate this
  const [currencyInValue, setCurrencyInValue] = useState("");
  const [currencyOutLabel, setCurrencyOutLabel] = useState<"USD" | "EUR" | "BRL" | "BTC" | "ETH">("USD");
  const [currencyOutValue, setCurrencyOutValue] = useState("");
  const [minIntervalSend, setMinIntervalSend] = useState(0);

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const { value, toggle } = useBoolean(true)


  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setLoading(true);

    try {
      const bodyRequest: ICreateUserData = {
        email: email,
        password: password,
        currencyInLabel: currencyInLabel,
        currencyInValue: Number(currencyInValue),
        currencyOutLabel: currencyOutLabel,
        currencyOutValue: Number(currencyOutValue),
        minIntervalSend: Number(minIntervalSend),
        toSell: value 
      } 

      console.log(bodyRequest)

      const response = await fetch(`/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify( bodyRequest ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login error");
      }

      localStorage.setItem('token', JSON.stringify(data))
      const auth = JSON.parse(localStorage.getItem('token')!) 
      console.log(auth.user, auth.token)

      console.log("Success login:", data);

      redirect('/profile')

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-right flex-col justify-center px-8 min-w-[80%]"
    >
      <h3 className="mb-8 text-lg font-bold ">Get Started on Currency2You</h3>

      <div className="flex flex-col items-center">

        <Field className="mb-5">
          <FieldLabel htmlFor="currencyInValue-input">Currency from</FieldLabel>

          <CurrencyInputGroup
            value={currencyInValue}
            currency={currencyInLabel}
            onValueChange={setCurrencyInValue}
            onCurrencyChange={setCurrencyInLabel}
          />
        </Field>

        <Field className="mb-5">
          <FieldLabel htmlFor="currencyOutValue-input">Currency to</FieldLabel>

          <CurrencyInputGroup
            value={currencyOutValue}
            currency={currencyOutLabel}
            onValueChange={setCurrencyOutValue}
            onCurrencyChange={setCurrencyOutLabel}
          />
        </Field>

        <Field orientation="horizontal" className="max-w-sm mb-5">
          <FieldContent>
            <FieldLabel htmlFor="switch-focus-mode">
              To sell
            </FieldLabel>
            <FieldDescription>
              You will be notified by email if the value is higher than desired. If false, the opposite will occur.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-focus-mode" checked={value} onCheckedChange={toggle} />
        </Field>

        <Field className="mb-5">
          <FieldLabel htmlFor="interval-input">Mininum Interval</FieldLabel>
          <Input
            id="interval-input"
            type="number"
            placeholder="Enter a day number"
            value={minIntervalSend}
            onChange={(e) => setMinIntervalSend(Number(e.target.value))}
          />
          <FieldDescription>
            Choose a minimum number of days between emails.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="email-input">Email</FieldLabel>

          <Input
            id="email-input"
            placeholder="Email"
            className="mb-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password-input">Password</FieldLabel>

          <InputGroup className="mb-5">
            <InputGroupInput
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputGroupAddon
              align="inline-end"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Button type="submit" className="w-full mt-5" disabled={loading}>
          {loading ? <span className="flex flex-row items-center gap-1"><Spinner/>Registering...</span>: "Submit"}
        </Button>

        <Link href="/" className="w-full mt-6">
          <Button variant="outline" className="w-[100%]">I already have an account</Button>
        </Link>
      </div>
    </form>
  )
}

export { RegisterForm }
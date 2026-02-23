"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bitcoin, DiamondMinus } from "lucide-react"

const currencies = {
  USD: { symbol: "$", label: "USD" },
  EUR: { symbol: "€", label: "EUR" },
  BRL: { symbol: "R$", label: "BRL" },
  BTC: { symbol: <Bitcoin/>, label: "BTC" },
  ETH: { symbol: <DiamondMinus/>, label: "ETH" },
}

type Props = {
  value: string
  currency: keyof typeof currencies
  onValueChange: (value: string) => void
  onCurrencyChange: (currency: keyof typeof currencies) => void
}

export function CurrencyInputGroup({
  value,
  currency,
  onValueChange,
  onCurrencyChange,
}: Props) {
  const current = currencies[currency]

  return (
    <div className="flex w-full max-w-sm">
      
      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm h-[36px]">
        {current.symbol}
      </div>

      <Input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="0.00"
        className="rounded-none border-x-0 focus-visible:ring-0"
      />

      <div className="border border-l-0 rounded-r-md h-[36px]">
        <Select
          value={currency}
          onValueChange={(val) =>
            onCurrencyChange(val as keyof typeof currencies)
          }
        >
          <SelectTrigger className="h-10 border-0 rounded-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(currencies).map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
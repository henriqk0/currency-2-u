"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Field,
  FieldGroup
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { startTransition, useState } from "react";
import { CurrencyInputGroup } from "../register/currency-input-group"
import { useBoolean } from "@/hooks/use-boolean"
import { Switch } from "@/components/ui/switch"
import { showToast } from "nextjs-toast-notify"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { IUpdateUserData, UpdateProps } from "@/app/types/update-user"
import { updateData } from "@/app/actions/update-user"


function UpdateUserForm({token, id, userData }: UpdateProps) {
  const [currencyInLabel, setCurrencyInLabel] = useState<"USD" | "EUR" | "BRL" | "BTC" | "ETH">(userData.currencyInLabel);
  const [currencyInValue, setCurrencyInValue] = useState(userData.currencyInValue);
  const [currencyOutLabel, setCurrencyOutLabel] = useState<"USD" | "EUR" | "BRL" | "BTC" | "ETH">(userData.currencyOutLabel);
  const [currencyOutValue, setCurrencyOutValue] = useState(userData.currencyOutValue);
  const [minIntervalSend, setMinIntervalSend] = useState(userData.minIntervalSend);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { value, toggle } = useBoolean(true)

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setLoading(true);

    startTransition(async () => {
      try {
        const bodyRequest: IUpdateUserData = {
          currencyInLabel: currencyInLabel,
          currencyInValue: Number(currencyInValue),
          currencyOutLabel: currencyOutLabel,
          currencyOutValue: Number(currencyOutValue),
          minIntervalSend: Number(minIntervalSend),
          toSell: value 
        } 

        const updateProps: UpdateProps = { 
          id: id,
          token: token,
          userData: bodyRequest
        }

        await updateData(updateProps)

        showToast.success("Update successfully", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "fadeIn",
          icon: '',
          sound: true,
        });

        setOpen(false);

      } catch (error) {

        showToast.error(`${error}`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "fadeIn",
          icon: '',
          sound: true,
        });

      } finally {
        setLoading(false);
      }
    }) 
  }
  
  return (
    <Dialog
      open={open}  
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="flex items-right flex-col justify-center"
        >
          <DialogHeader className="pb-5">
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="currencyIn-input">Currency in {currencyInLabel}</Label>
              <CurrencyInputGroup
                idInput="currencyIn-input"
                value={currencyInValue}
                currency={currencyInLabel}
                onValueChange={setCurrencyInValue}
                onCurrencyChange={setCurrencyInLabel}
              />
            </Field>

            <Field>
              <Label htmlFor="currencyOut-input">Currency out</Label>
              <CurrencyInputGroup
                idInput="currencyOut-input"
                value={currencyOutValue}
                currency={currencyOutLabel}
                onValueChange={setCurrencyOutValue}
                onCurrencyChange={setCurrencyOutLabel}
              />
            </Field>

            <Field>
              <Label htmlFor="to-sell-to-buy">To sell / To buy</Label>
              <Switch id="to-sell-to-buy" checked={value} onCheckedChange={toggle} />
            </Field>

            <Field>
              <Label htmlFor="interval-input">Minimal days between emails</Label>
              <Input
                id="interval-input"
                type="number"
                value={minIntervalSend}
                onChange={(e) => setMinIntervalSend(Number(e.target.value))}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <span className="flex flex-row items-center gap-1"><Spinner/>Saving...</span>: "Save changes"}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}

export { UpdateUserForm }
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { EyeOffIcon } from "lucide-react"
import Image from 'next/image'
import Link from "next/link"



const imageStyle = {
  width: 'auto',
  height: 'auto',
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center lg:flex-row">
      <div className="w-[100%] h-[15vh] bg-linear-to-r from-neutral-200 to-neutral-400/70 lg:w-[60%] lg:h-[100vh]">
        <div className="flex h-[100%] flex-col">
          <span className="flex text-2xl p-4 font-light h-full items-center justify-center lg:px-0 font-spam-header">Monitor and be alerted about currency values</span>

          <Image 
            alt="SideArt"
            className="hidden lg:block"
            src="/money_stacks.png"
            width={100}
            height={100}
            sizes="100vw"
            style={imageStyle}
            unoptimized 
          />
        </div>
      </div>
      
      <div className="h-[85vh] lg:w-[40%] lg:h-[100vh] flex items-right justify-center font-sans">

        <div className="flex items-right flex-col justify-center px-8 min-w-[80%]">
          <h3 className="mb-8 text-lg font-bold ">Log into Currency2You</h3>

          <div className="flex flex-col items-center">
            <Input placeholder="Email" className="mb-3"></Input>

            <Field>
              <InputGroup>
                <InputGroupInput
                  id="inline-end-input"
                  type="password"
                  placeholder="Password"
                />
                <InputGroupAddon align="inline-end">
                  <EyeOffIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Button className="w-full mt-5">Log in</Button>

            <Link href="/register" className="w-full mt-12">
              <Button variant="outline" className="w-[100%]">Create new account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

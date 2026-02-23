"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
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

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
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
      <h3 className="mb-8 text-lg font-bold ">Log into Currency2You</h3>

      <div className="flex flex-col items-center">
        <Input
          placeholder="Email"
          className="mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field>
          <InputGroup>
            <InputGroupInput
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
          {loading ? <span className="flex flex-row items-center gap-1"><Spinner/>Loading...</span>: "Log in"}
        </Button>

        <Link href="/register" className="w-full mt-12">
          <Button variant="outline" className="w-[100%]">Create new account</Button>
        </Link>
      </div>
    </form>
  )
}

export { LoginForm }
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UpdateUserForm } from "@/components/(auth)/patchUser/update-form";
import { DeleteUserForm } from "@/components/(auth)/deleteUser/delete-form";
import { Button } from "@/components/ui/button";
import { callLogout } from "@/app/api/auth/logout/route";


async function loadUserData() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value
  const userId = (await cookieStore).get("user")?.value

  try { 
    const realId = JSON.parse(userId!)

    const response = await fetch(process.env.API_URL + `/api/users/${realId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json()

    if (!token) {
      redirect("/login")
    }

    return data

  } catch (error) {

    if (typeof window !== "undefined") {
      showToast.error(`Login expired: ${error}`, {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "fadeIn",
        icon: '',
        sound: true,
      });
    }

    await callLogout()
  }
}

export default async function Profile() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  const user = await loadUserData()

  return (
    <div className="flex min-h-screen items-center justify-center">

      <div className="flex flex-col border-1 rounded-md p-6 gap-4 md:w-[50%] ">
        <div className="w-full items-center justify-center">
          <h4>Welcome!</h4>
          <p>{user.toSell ? `Now, you're desiring buy ${user.currencyInValue} ${user.currencyInLabel} for ${user.currencyOutValue} ${user.currencyOutLabel}` : `Now, you're desiring sell ${user.currencyInValue} ${user.currencyInLabel} for ${user.currencyOutValue} ${user.currencyOutLabel}`}</p>
        </div>
        <div className="flex flex-row justify-end px-3 gap-2">
          <UpdateUserForm token={token!} id={user.id} userData={user}></UpdateUserForm>
          <DeleteUserForm token={token!} id={user.id}></DeleteUserForm>
        </div>
      </div>
    </div>
  );
}

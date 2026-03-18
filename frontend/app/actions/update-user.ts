"use server";

import { revalidatePath } from "next/cache";
import { UpdateProps } from "../types/update-user";
import { getErrorMessage } from "@/lib/utils";


export async function updateData(props: UpdateProps) {
  const response = await fetch(process.env.API_URL + `/api/users/${props.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${props.token}`,
      },
      credentials: "include",
      body: JSON.stringify( props.userData ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  revalidatePath("/profile");
}
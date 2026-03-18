"use server";

import { revalidatePath } from "next/cache";
import { DeleteProps } from "../types/delete-user";
import { getErrorMessage } from "@/lib/utils";


export async function deleteData(props: DeleteProps) {
  const response = await fetch(process.env.API_URL + `/api/users/${props.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${props.token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Not JSON
    }
    throw new Error(getErrorMessage(data) || "Deletion error");
  }

  revalidatePath("/profile");
}
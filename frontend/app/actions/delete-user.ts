"use server";

import { revalidatePath } from "next/cache";
import { DeleteProps } from "../types/delete-user";


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

  if (response.status !== 204) {
    throw new Error("Deletion error");
  }

  revalidatePath("/profile");
}
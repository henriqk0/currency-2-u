import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    {
      headers: {
        "Cache-Control": "no-store", // to not cache cookie information after logout
      },
    }
  );

  response.cookies.set("token", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}


export async function callLogout() {
  await POST()

  redirect('/')
}
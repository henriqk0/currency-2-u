import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const apiResponse = await fetch(process.env.API_URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await apiResponse.json();

  if (!apiResponse.ok) {
    return NextResponse.json(data, { status: apiResponse.status });
  }

  const response = NextResponse.json({ user: data.user });

  response.cookies.set("token", data.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("user", JSON.stringify(data.user.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
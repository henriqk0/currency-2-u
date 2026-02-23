import { redirect } from "next/navigation";

async function loadUserData() {
  const auth = JSON.parse(localStorage.getItem('token')!) 

  console.log(auth.user, auth.token)

  const loggedUserId = auth.user.id

  const response = await fetch(`/api/users/${loggedUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        loggedUserId
      }),
    }
  );

  if (!response.ok) {
    redirect("/login")
  }

  return response.json()
}

export default async function Profile() {
  const config = await loadUserData();

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <div className="h-50 w-50">
        <h1>{ config.email }</h1>
      </div>
    </div>
  );
}

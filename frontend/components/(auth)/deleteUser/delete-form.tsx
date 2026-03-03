"use client"

import { deleteData } from "@/app/actions/delete-user";
import { callLogout } from "@/app/api/auth/logout/route";
import { DeleteProps } from "@/app/types/delete-user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { showToast } from "nextjs-toast-notify";
import { startTransition, useState } from "react";


function DeleteUserForm({token, id }: DeleteProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); 

    setLoading(true); 

    startTransition(async () => {
      try {
        const deleteProps: DeleteProps = { 
          id: id,
          token: token,
        }

        await deleteData(deleteProps)

        showToast.success("Successfully deleted", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "fadeIn",
          icon: '',
          sound: true,
        });

      } catch (error) {

        showToast.error(`${error}`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "fadeIn",
          icon: '',
          sound: true,
        });

        await callLogout()

      } finally {
        setLoading(false);
      }
    }) 
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Delete</Button>
      </DialogTrigger>

      <DialogContent>
        <form
          onSubmit={handleSubmit}
        >
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>

            <DialogFooter className="pt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? <span className="flex flex-row items-center gap-1"><Spinner/>Deleting...</span>: "Confirm"}
              </Button>
            </DialogFooter>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteUserForm }
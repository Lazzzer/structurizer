"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";

export function DeleteSection() {
  async function deleteAccount() {
    const res = await fetch("/api/account", {
      method: "DELETE",
    });
    if (res.ok) {
      signOut({
        callbackUrl: "/login",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Your account could not be deleted. Please try again.",
      });
    }
  }

  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
      <h2 className="font-bold text-red-800 text-lg">Delete Account</h2>
      <p className="text-red-500 text-sm">
        This action will permanently delete your account and all the data
        associated with it.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"} className="w-44 mt-4">
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all the data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteAccount();
              }}
            >
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

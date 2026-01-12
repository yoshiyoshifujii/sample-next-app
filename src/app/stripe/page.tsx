import { JSX } from "react";
import { Metadata } from "next";
import ElementsForm from "@/components/features/ElementsForm";

export const metadata: Metadata = {
  title: "Stripe",
};

export default function StripePage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ElementsForm />
      </main>
    </div>
  );
}

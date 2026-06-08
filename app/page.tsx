"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const auth = localStorage.getItem("vs_auth");
    if (auth) router.replace("/dashboard");
    else router.replace("/login");
  }, [router]);
  return null;
}

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailRedirectPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      router.replace(`/super-admin/users/platform/${userId}`);
    }
  }, [router, userId]);

  return null;
}

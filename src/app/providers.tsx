"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { AuthProvider as BackendAuthProvider } from "./contexts/AuthContext";
import { AuthProvider as FrontendAuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { AntdConfigProvider } from "@/lib/antd";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AntdRegistry>
        <BackendAuthProvider>
          <FrontendAuthProvider>
            <CartProvider>
              <AntdConfigProvider>{children}</AntdConfigProvider>
            </CartProvider>
          </FrontendAuthProvider>
        </BackendAuthProvider>
      </AntdRegistry>
    </SessionProvider>
  );
}

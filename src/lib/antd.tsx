"use client";

import type { ReactNode } from "react";
import { ConfigProvider, App } from "antd";
import thTH from "antd/locale/th_TH";

export const antdConfig = {
  locale: thTH,
  theme: {
    token: {
      // ปรับแต่ง theme ตามต้องการ
    },
  },
};

type AntdConfigProviderProps = {
  children: ReactNode;
};

export function AntdConfigProvider({ children }: AntdConfigProviderProps): JSX.Element {
  return (
    <ConfigProvider {...antdConfig}>
      <App>{children}</App>
    </ConfigProvider>
  );
}

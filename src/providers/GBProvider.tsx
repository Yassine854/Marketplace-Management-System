"use client";
import { GrowthBookPayload } from "@growthbook/growthbook";
import React, { PropsWithChildren } from "react";
import { getGBClient } from "@/libs/growthbook/growthbookClient";
import { GrowthBookProvider } from "@growthbook/growthbook-react";

function GBProvider({
  children,
  payload,
  attributes,
}: PropsWithChildren<{
  payload: GrowthBookPayload;
  attributes?: { [key: string]: string };
}>) {
  const gb = getGBClient(attributes ? { attributes } : {}).initSync({
    payload,
  });
  return <GrowthBookProvider growthbook={gb}>{children}</GrowthBookProvider>;
}

export default GBProvider;

"use client";
import { GrowthBookPayload } from "@growthbook/growthbook";
import React, { PropsWithChildren } from "react";
import { getGBClient } from "@/libs/growthbook/growthbookClient";
import { GrowthBookProvider } from "@growthbook/growthbook-react";

function GBProvider({
  children,
  payload,
}: PropsWithChildren<{ payload: GrowthBookPayload }>) {
  const gb = getGBClient().initSync({ payload });
  return <GrowthBookProvider growthbook={gb}>{children}</GrowthBookProvider>;
}

export default GBProvider;

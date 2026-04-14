import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import React from "react";

type StackHandlerProps = React.ComponentProps<typeof StackHandler>;

export default async function Handler(props: Omit<StackHandlerProps, "app">) {
  return <StackHandler fullPage app={stackServerApp} {...(await (props as any))} />;
}

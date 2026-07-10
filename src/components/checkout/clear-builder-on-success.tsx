"use client"

import * as React from "react"

import { useBuilderStore } from "@/store/builder-store"

/** Clears the persisted builder draft after a successful checkout. */
export function ClearBuilderOnSuccess() {
  const reset = useBuilderStore((s) => s.reset)

  React.useEffect(() => {
    reset()
  }, [reset])

  return null
}

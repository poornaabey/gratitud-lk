import { cn } from "@/lib/utils"

type ContainerProps = React.ComponentProps<"div"> & {
  size?: "default" | "narrow" | "wide"
}

const sizeClasses = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
} as const

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-10",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}

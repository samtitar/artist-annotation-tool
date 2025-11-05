
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type AsChild = { asChild?: boolean; className?: string }

/**
 * Heading components (H1..H6), Lead, Paragraph and Small.
 * Each component accepts `asChild` to render a custom element via Radix Slot,
 * a `className` to extend styles, and all native element props for the tag.
 */

export function H1({ asChild = false, className, ...props }: React.ComponentPropsWithoutRef<"h1"> & AsChild) {
    const Comp: any = asChild ? Slot : "h1"
    return (
        <Comp
            data-slot="h1"
            className={cn("text-2xl font-extrabold tracking-tight leading-tight lg:text-5xl", className)}
            {...props}
        />
    )
}

export function H2({ asChild = false, className, ...props }: React.ComponentPropsWithoutRef<"h2"> & AsChild) {
    const Comp: any = asChild ? Slot : "h2"
    return (
        <Comp
            data-slot="h2"
            className={cn("text-xl font-semibold tracking-tight leading-tight lg:text-4xl", className)}
            {...props}
        />
    )
}

export function H3({ asChild = false, className, ...props }: React.ComponentPropsWithoutRef<"h3"> & AsChild) {
    const Comp: any = asChild ? Slot : "h3"
    return (
        <Comp data-slot="h3" className={cn("text-xl font-semibold tracking-tight", className)} {...props} />
    )
}

export function H4({ asChild = false, className, ...props }: React.ComponentPropsWithoutRef<"h4"> & AsChild) {
    const Comp: any = asChild ? Slot : "h4"
    return (
        <Comp data-slot="h4" className={cn("text-lg font-medium tracking-tight", className)} {...props} />
    )
}

export function H5({ asChild = false, className, ...props }: React.ComponentPropsWithoutRef<"h5"> & AsChild) {
    const Comp: any = asChild ? Slot : "h5"
    return (
        <Comp data-slot="h5" className={cn("text-lg font-medium", className)} {...props} />
    )
}

export function H6({ asChild = false, className, ...props }: React.ComponentPropsWithoutRef<"h6"> & AsChild) {
    const Comp: any = asChild ? Slot : "h6"
    return (
        <Comp data-slot="h6" className={cn("text-base font-medium uppercase tracking-wide", className)} {...props} />
    )
}

export function Lead({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
    return <p data-slot="lead" className={cn("text-xl text-muted-foreground", className)} {...props} />
}

export function Paragraph({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
    return (
        <p
            data-slot="paragraph"
            className={cn("text-base leading-7 text-foreground [&:not(:first-child)]:mt-4", className)}
            {...props}
        />
    )
}

export function Small({ className, ...props }: React.ComponentPropsWithoutRef<"small">) {
    return <small data-slot="small" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { cn }


// `cn` is shadcn's compiled class-name merger — a drop-in replacement for
// `twMerge(clsx(...))`. The generated `components/ui/*` import it from the
// `cn` package directly; application code imports it from here so the helper
// has a single project-owned entry point.
export { cn } from "cn";

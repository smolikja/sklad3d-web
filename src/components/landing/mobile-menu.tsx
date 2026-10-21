"use client";

import { useState, type ReactNode } from "react";
import { MenuIcon, XIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

/**
 * Compact menu for small screens: the same destinations as the desktop
 * navigation plus the application and the language switch. Closes itself
 * after a link is chosen so the anchor scroll is visible.
 */
export function MobileMenu({
  copy,
  children,
}: {
  copy: Dictionary["nav"];
  /** Server-rendered language switcher. */
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="icon-lg" className="size-11 rounded-lg" />}
        aria-label={copy.menuOpen}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="w-full max-w-sm gap-0 p-6">
        <SheetHeader className="flex-row items-center justify-between p-0">
          <SheetTitle className="text-base">{copy.menuTitle}</SheetTitle>
          <SheetDescription className="sr-only">{copy.aria}</SheetDescription>
          <SheetClose
            render={<Button variant="ghost" size="icon-lg" className="size-11 rounded-lg" />}
            aria-label={copy.menuClose}
          >
            <XIcon />
          </SheetClose>
        </SheetHeader>
        <nav aria-label={copy.aria} className="mt-6">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-lg px-3 text-lg font-medium outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {copy[item.id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={siteConfig.applyHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-12 rounded-lg text-base font-semibold")}
        >
          {copy.apply}
        </a>
        <div className="mt-8 border-t pt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

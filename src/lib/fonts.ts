import { Archivo } from "next/font/google";

// One family, two widths: Archivo's `wdth` axis gives the expanded, signage-like
// section titles (`font-display`) and the normal-width reading text from the
// same file. `latin-ext` is required for Czech diacritics.
const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export const fontVariables = archivo.variable;

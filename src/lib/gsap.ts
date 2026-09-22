/* ---------------------------------------------------------------------
   LE SEUL endroit du projet ou l'on appelle registerPlugin (CLAUDE.md §6.1).
   Partout ailleurs :  import { gsap } from "@/lib/gsap";
   Jamais              import { gsap } from "gsap";
   Enregistrer un plugin deux fois ne casse rien, mais eparpiller les
   enregistrements fait qu'on ne sait plus lequel est charge ou non.
   --------------------------------------------------------------------- */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, SplitText, useGSAP);

export { gsap, ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, SplitText, useGSAP };

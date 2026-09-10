import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ---------------------------------------------------------------------
   Instance UNIQUE de Lenis (CLAUDE.md §6.5).

   Deux instances, ou une instance recreee a chaque montage en StrictMode,
   et deux boucles se disputent la position de defilement : le scroll
   devient saccade sans qu'aucune erreur n'apparaisse. D'ou le singleton.
   --------------------------------------------------------------------- */

let instance: Lenis | null = null;
let boucle: ((time: number) => void) | null = null;

export function demarrerLenis(): Lenis {
  if (instance) return instance;

  // autoRaf: false — ce n'est PAS Lenis qui pilote sa propre boucle,
  // c'est le ticker de GSAP. Une seule horloge pour tout le site.
  instance = new Lenis({ autoRaf: false });

  // 1. Chaque fois que Lenis bouge, ScrollTrigger recalcule.
  //    Sans ca, ScrollTrigger lit la position NATIVE du navigateur pendant
  //    que Lenis affiche une position LISSEE : tout se declenche trop tot.
  instance.on("scroll", ScrollTrigger.update);

  // 2. Le ticker GSAP fait avancer Lenis. GSAP compte en secondes,
  //    Lenis attend des millisecondes, d'ou le x1000.
  boucle = (time: number) => {
    instance?.raf(time * 1000);
  };
  gsap.ticker.add(boucle);

  // 3. lagSmoothing(0) : quand une image met trop de temps, GSAP compense
  //    normalement en "sautant" du temps. Sur un scroll pilote a la molette,
  //    cette compensation se voit comme un a-coup. On la coupe.
  gsap.ticker.lagSmoothing(0);

  return instance;
}

export function arreterLenis(): void {
  if (boucle) gsap.ticker.remove(boucle);
  instance?.destroy();
  instance = null;
  boucle = null;
}

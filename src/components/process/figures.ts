import type { FunctionComponent, SVGProps } from "react";

import F01 from "@/assets/process/01-sable.svg?react";
import F02 from "@/assets/process/02-four-arc.svg?react";
import F03 from "@/assets/process/03-purification.svg?react";
import F04 from "@/assets/process/04-czochralski.svg?react";
import F05 from "@/assets/process/05-sciage.svg?react";
import F06 from "@/assets/process/06-polissage.svg?react";
import F07 from "@/assets/process/07-photolithographie.svg?react";
import F08 from "@/assets/process/08-gravure.svg?react";
import F09 from "@/assets/process/09-dopage.svg?react";
import F10 from "@/assets/process/10-test-wafer.svg?react";
import F11 from "@/assets/process/11-decoupe.svg?react";
import F12 from "@/assets/process/12-packaging.svg?react";

/* ---------------------------------------------------------------------
   Les 12 figures de procede, indexees par leur repere (CONTENU.md §2).

   `?react` : vite-plugin-svgr transforme le fichier .svg en composant
   React. Le SVG est donc INLINE dans le DOM — c'est indispensable, car
   une balise <img src="...svg"> ne laisse pas atteindre les <path> qui
   sont a l'interieur, et DrawSVG n'aurait rien a animer.

   Les 12 imports sont statiques (et non un import() dynamique) : 15 Ko de
   trait au total apres nettoyage, ca ne justifie pas un chargement
   differe qui compliquerait le calcul des positions par ScrollTrigger.
   --------------------------------------------------------------------- */

type ComposantFigure = FunctionComponent<SVGProps<SVGSVGElement>>;

export const FIGURES: Readonly<Record<string, ComposantFigure>> = {
  "01": F01,
  "02": F02,
  "03": F03,
  "04": F04,
  "05": F05,
  "06": F06,
  "07": F07,
  "08": F08,
  "09": F09,
  "10": F10,
  "11": F11,
  "12": F12,
};

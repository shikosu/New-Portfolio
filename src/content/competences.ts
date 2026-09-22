import type { Blocs } from "@/content/types";

/* ---------------------------------------------------------------------
   Page 3, bloc 09 — Dopage : les competences et les outils.

   Regle de la ROADMAP : par niveau REEL de maitrise, aucune barre de
   pourcentage inventee. Le niveau ira dans le `repere` de chaque groupe
   (« autonome », « en apprentissage »…) — ⧖ A VALIDER PAR TOI, groupe
   par groupe. « Un niveau surevalue se demonte en trois questions. »

   CONTENU.md dit « 3 groupes maximum » mais en listait quatre : le
   numerique (Verilog, FPGA) a rejoint l'embarque.

   ⚠️ « Flot RTL→GDSII » a ete RETIRE de la liste proposee par CONTENU.md :
   le projet en est a la logique sequentielle, la synthese n'a pas
   commence. L'annoncer ici, c'est offrir la question qui le demonte.
   Il reviendra quand Yosys aura tourne.
   --------------------------------------------------------------------- */

export const BLOCS_COMPETENCES: Blocs = {
  "09": {
    entrees: [
      {
        titre: "Embarqué et numérique",
        items: ["C/C++", "Arduino", "ESP32", "I²C", "SPI", "UART", "Verilog", "FPGA"],
      },
      {
        titre: "Électronique",
        items: ["Datasheets", "Schématique", "LTspice", "KiCad", "Oscilloscope"],
      },
      {
        titre: "Réseau et systèmes",
        items: ["Cisco IOS", "Packet Tracer", "Linux", "Docker", "Auto-hébergement"],
      },
    ],
    brouillon: true,
  },
};

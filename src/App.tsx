import { BrowserRouter, Routes, Route } from "react-router";
import { Shell } from "@/components/layout/Shell";
import { Presentation } from "@/pages/Presentation";
import { Objectifs } from "@/pages/Objectifs";
import { Experience } from "@/pages/Experience";
import { Projets } from "@/pages/Projets";

/* Les 4 pages du parcours (CLAUDE.md §2). Toutes sont enfants de <Shell>,
   qui porte le fond, la navigation et l'instance Lenis : ils ne sont donc
   pas remontes a chaque changement de page. */

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Presentation />} />
          <Route path="objectifs" element={<Objectifs />} />
          <Route path="experience" element={<Experience />} />
          <Route path="projets" element={<Projets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

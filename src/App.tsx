import { BrowserRouter } from "react-router";
import { Shell } from "@/components/layout/Shell";

/* La coquille porte tout : le fond, la navigation, l'instance Lenis et
   l'orchestrateur de transitions. Les 4 routes (CLAUDE.md §2) sont
   declarees un cran plus bas, dans <TransitionPages>, et non ici.

   Pourquoi pas une route de mise en page avec <Outlet/> comme en phase 2 ?
   Parce que <Outlet/> rend TOUJOURS la page de l'adresse courante, alors
   que la phase 5 a justement besoin de garder l'ancienne a l'ecran le
   temps qu'elle sorte. Il faut donc pouvoir dire a React Router quelle
   adresse rendre — ce qui se fait avec <Routes location={...}>, et pas
   avec un Outlet. */

export function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

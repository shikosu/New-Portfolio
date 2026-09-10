/* Page vide de la phase 2 : elle existe, elle est navigable, elle n'anime
   rien. Le rail arrive en phase 3, le contenu en phase 6 (voir CONTENU.md). */

export function Objectifs() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-6">
      <p className="text-mono text-ink-soft font-mono uppercase">Page 2 · blocs 04–06</p>
      <h1 className="text-display font-display mt-2">Objectifs</h1>
      <p className="text-lead text-ink-soft mt-4 max-w-[45ch]">Tirage Czochralski, sciage du lingot, polissage CMP.</p>
    </section>
  );
}

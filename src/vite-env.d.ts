/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

/* Sans ce fichier, `import Figure from "...svg?react"` fait echouer
   `npm run typecheck` : Vite sait resoudre le suffixe `?react`, TypeScript
   non. Les deux lignes ci-dessus declarent les types de ces imports. */

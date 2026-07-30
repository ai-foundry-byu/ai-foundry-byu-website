import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    /**
     * Pin the workspace root to this directory.
     *
     * Without this, Turbopack infers the root by walking up looking for a
     * lockfile, and it picks the OUTERMOST one it finds. A stray
     * package-lock.json anywhere above this folder therefore silently
     * repoints the root, and the dev server then looks for tailwindcss in
     * that directory's node_modules, fails to resolve it, and crashes on
     * boot with a resolution error that says nothing about lockfiles.
     *
     * That happened on 2026-07-29: an npm command run from the home
     * directory left a package.json and package-lock.json there, and every
     * subsequent `next dev` died. The error surfaces as a missing Tailwind
     * import, which sends you looking in entirely the wrong place.
     *
     * Pinning it makes the project independent of whatever exists in parent
     * directories, which is what you want on any machine where this repo is
     * not at the top of the tree.
     */
    root: path.resolve(__dirname),
  },
}

export default nextConfig

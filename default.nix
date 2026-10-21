{ pkgs ? import
    (fetchTarball {
      name = "jpetrucciani-2026-10-20";
      url = "https://github.com/jpetrucciani/nix/archive/1b477d7aa81019d08fd92ea32e835988fa4849c8.tar.gz";
      sha256 = "0crw41kkvxdhpxklzg4xpx6v7y03150r7g2ygyignx4p061dszip";
    })
    { }

}:
let
  name = "ui";

  tools = with pkgs; {
    cli = [
      jfmt
      nixup
    ];
    bun = [ bun ];
    scripts = pkgs.lib.attrsets.attrValues scripts;
  };

  scripts = with pkgs; {
    dev = pog {
      name = "dev";
      description = "start the styleguide playground (vite, :3099)";
      script = ''
        if [ ! -d node_modules ]; then
          echo "→ Installing dependencies..."
          bun install
        fi
        bun run dev
      '';
    };

    check = pog {
      name = "check";
      description = "typecheck only (vue-tsc)";
      script = ''
        if [ ! -d node_modules ]; then
          echo "→ Installing dependencies..."
          bun install
        fi
        bun run typecheck
      '';
    };

    add = pog {
      name = "add";
      description = "add shadcn-vue primitives to src/components/ui, imports made relative";
      arguments = [{ name = "component"; }];
      script = ''
        if ! git diff --quiet -- package.json bun.lock; then
          echo "package.json/bun.lock have uncommitted changes — commit or stash first"
          exit 1
        fi
        bunx shadcn-vue@latest add "$@"

        # the CLI bumps deps we already have (across majors, too), and its
        # registry currently emits `import { cn } from "cn"` plus an unrelated
        # npm "cn" package. keep only genuinely new deps; restore the rest.
        git show HEAD:package.json > .package.json.before
        bun -e '
          const before = JSON.parse(await Bun.file(".package.json.before").text())
          const after = JSON.parse(await Bun.file("package.json").text())
          for (const k of ["dependencies", "devDependencies"]) {
            for (const name of Object.keys(after[k] ?? {})) {
              if (name === "cn") delete after[k][name]
              else if (before[k]?.[name]) after[k][name] = before[k][name]
            }
          }
          await Bun.write("package.json", JSON.stringify(after, null, 2) + "\n")
        '
        rm .package.json.before
        bun install

        # every app has its own @/ — rewrite the CLI's imports relative so the
        # files resolve from inside node_modules
        find src/components/ui -type f \( -name '*.vue' -o -name '*.ts' \) -exec sed -i -E \
          -e "s#from (['\"])(@/lib/utils|cn)(['\"])#from \1../../../lib/utils\3#" \
          -e "s#from (['\"])@/components/ui/([a-z-]+)(['\"])#from \1../\2\3#" {} +
        if ! git diff --quiet -- styles/; then
          echo "⚠ the CLI touched styles/ — review it (tokens are HSL triplets, not oklch)"
          git diff --stat -- styles/
        fi
        git status --short
      '';
    };
  };
  paths = pkgs.lib.flatten [ (builtins.attrValues tools) ];
  env = pkgs.buildEnv {
    inherit name paths; buildInputs = paths;
  };
in
(env.overrideAttrs (_: {
  inherit name;
  NIXUP = "0.0.11";
})) // { inherit scripts; }

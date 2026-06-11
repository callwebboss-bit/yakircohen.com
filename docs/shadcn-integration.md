# shadcn/ui Integration (Hybrid)

**Preset:** `b27GcrRo` ([create link](https://ui.shadcn.com/create?preset=b27GcrRo))  
**Style:** `radix-rhea` · **RTL:** enabled  
**Init:** `npx shadcn@latest init --preset b27GcrRo --rtl -f --no-reinstall -t next --base radix`

## Conventions

| Layer | Path | Use |
|-------|------|-----|
| Site primitives | `components/ui/Button.tsx` | All CTAs — `as="link"` / `as="a"`, `brand-red`, `min-h-11` |
| shadcn primitives | `components/ui/shadcn-button.tsx` | Internal shadcn composition only |
| shadcn components | `components/ui/accordion.tsx`, `dialog.tsx`, `sheet.tsx` | New interactive UI |

## Theming

- Yakir tokens remain in `@theme` (`brand-red`, `text-hero`, etc.)
- shadcn semantic vars in `:root` are mapped to brand palette (`--primary: #d42b2b`)
- Do **not** run `shadcn add button` without `--overwrite false` — it overwrites `Button.tsx` on Windows

## Adding components

```bash
npx shadcn@latest add <name> -y --overwrite false
```

## RTL

- `html dir="rtl"` in root layout
- shadcn `components.json` has `"rtl": true`

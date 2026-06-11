# UI Primitives API

Frozen after Phase 0 regression gate. Changes require a new phase.

## Container

```tsx
<Container variant="default" | "wide" className?>{children}</Container>
```

- `default`: `max-w-[var(--width-content)]` (72rem)
- `wide`: `max-w-[88rem]` (header/services)
- Padding: `px-4 sm:px-6 lg:px-8`

## Section

```tsx
<Section id? ariaLabelledby? className? padding="default" | "sm" | "none">{children}</Section>
```

- `default`: `py-16 sm:py-20 lg:py-28` (uses `--spacing-section` tokens)
- `sm`: reduced vertical padding
- `none`: no vertical padding

## Card

```tsx
<Card variant="default" | "interactive" | "featured" className? as?>{children}</Card>
```

- `default`: surface, border, rounded-xl
- `interactive`: hover lift (hover-capable devices only), shadow, focus-within ring
- `featured`: ring-brand-red accent

## Button

```tsx
<Button variant="primary" | "secondary" | "outline" | "ghost" as="button" | "link" | "a" />
```

- `min-h-11`, `active:scale-[0.98]`
- `as="a"` for external links (WhatsApp)

# Changelog — qrlayout-ui

All notable changes to this package are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.1.1] — 2026-06-04

### 📄 Documentation
- **README corrected** — "Rich Text Styling" feature bullet now accurately describes what is available in the designer panel (font size, weight, horizontal/vertical alignment) versus what is supported engine-side via JSON only (font family, color, word-wrap, line height). Previously this bullet overclaimed that font family and color had UI controls, which they do not.
- Added a link to the core README schema reference for the full list of supported style properties.

### ✅ Backward Compatibility
No code changes in this release. Fully backward compatible.

> **Note:** To get the word-wrap bug fix and the new `exportToPNG()` method, update `qrlayout-core` to `>=1.1.8`.

---

## [1.1.0] — 2026-05-19

### Added
- **Angular demo** — Full Angular standalone component example added to the monorepo and live demo published.
- **Back navigation button** — Added back navigation in Angular and Vue designer views for better UX flow.

### Changed
- Version bumped to `1.1.0` aligned with Angular demo launch.
- README updated with Angular integration example and live demo link.
- Peer dependency on `qrlayout-core` set to `>=1.1.1`.

---

## [1.0.10] — 2026-03-16

### Added
- **React demo documentation page** — Embedded documentation/guide page added to the React demo app with API reference, schema reference, and export format examples.

### Changed
- React demo SEO improvements and updated layout.
- CI/CD workflow added for automated deployment.

---

## [1.0.9] — 2026-03-05

### Added
- **Sample Data Editor modal** — Users can now edit live preview data directly in the designer UI via a dedicated modal panel. Previously, sample data could only be set via `entitySchemas.sampleData` at initialization.
- Fields from the active entity schema are auto-populated into the modal with editable inputs.

### Fixed
- **Drag-and-drop canvas shaking** — Fixed a bug where dragging or resizing an element caused all other elements to visibly shake/flicker due to unnecessary canvas resets on every `mousemove` event. Canvas is now only re-rendered after drag ends (`mouseup`), while only the dragged element's overlay box updates during drag.

---

## [1.0.8] — 2026-02-24

### Changed
- Version bump and internal updates.

---

## [1.0.7] — 2026-02-16

### Added
- **Vue 3 demo** — Full Vue 3 Composition API example added to the monorepo and live demo published.
- Initial Vue demo setup with `index.html`, routing, and README documentation images.

### Changed
- README updated with Vue integration example and live demo link.

---

## [1.0.6] — 2026-02-09

### Changed
- README updates and improvements.

---

## [1.0.5] — 2026-02-03

### Added
- **Svelte 5 demo** — Full Svelte 5 (Runes) example added to the monorepo and live demo published.
- CSS polish for the Svelte demo.

### Changed
- React demo export format corrected (PNG download flow).
- README updated with Svelte integration example and live demo link.

---

## [1.0.4] — 2026-01-27

### Changed
- Version bump. Internal updates and README improvements.

---

## [1.0.3] — 2026-01-22

### Changed
- Internal package structure update.

---

## [1.0.2] — 2026-01-19

### Added
- **Responsive mobile layout** — Designer now supports toggling sidebars on small screens via hamburger and pencil icon buttons.
- Left sidebar toggles for Settings panel; right sidebar toggles for Properties panel.
- `ResizeObserver` added to auto-close floating sidebars when viewport is wide enough.
- Auto-show right Properties panel on mobile when an element is selected.

### Changed
- Sidebar layout refactored to use `aside` with `.sidebar` / `.sidebar-right` CSS classes.

---

## [1.0.1] — 2026-01-09

### Changed
- Version bump. Aligned with `qrlayout-core@1.0.9` changes.

---

## [1.0.0] — 2026-01-08

### Added
- Initial release of `qrlayout-ui`.
- **`QRLayoutDesigner` class** — Framework-agnostic, embeddable drag-and-drop label designer.
- **Canvas-based visual editor** with drag-and-drop positioning and resize handle for text and QR elements.
- **Live preview** — Canvas re-renders automatically on every property change using `StickerPrinter.renderToCanvas()` from `qrlayout-core`.
- **Element property panel** — Right sidebar with inputs for position (x, y), size (w, h), content, font size, font weight, horizontal alignment, and vertical alignment.
- **Layout settings panel** — Left sidebar with inputs for label name, target entity, width, height, measurement unit, and background color.
- **Entity schema system** — Pass `entitySchemas` at init to populate `{{variable}}` field suggestions and data-bind the live preview.
- **`onSave` callback** — Fires with the full `StickerLayout` JSON when the user clicks "Save Layout".
- **`initialLayout` option** — Pre-load an existing saved layout into the designer.
- **Dark mode** — Built-in dark theme toggle with sun/moon icon button in the header.
- **`destroy()` method** — Clean teardown for use in React `useEffect`, Angular `ngOnDestroy`, Svelte `onDestroy`, etc.
- React integration example in README.
- Published alongside `qrlayout-core@1.0.8`.

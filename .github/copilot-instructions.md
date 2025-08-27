# Copilot Instructions for Event Management Client

## Project Overview
- **Architecture:** React 19 + Redux Toolkit + RTK Query. Modular structure: `src/api` (API logic), `src/pages/admin` (admin UI), `src/components` (UI widgets), `src/utils` (helpers/mapping), `src/store` (Redux config).
- **Data Flow:** API endpoints defined in `src/api/eventApi.js` and `src/api/rootApi.js`. State managed via Redux slices. UI triggers API mutations/queries, updates Redux state, and re-renders.
- **Rich Text:** Event descriptions use HTML via a custom `RichTextEditor` (see `components/common/RichTextEditor.jsx`).

## Key Patterns & Conventions
- **Status Mapping:** Always use `mapBackendStatusToFrontend` and `mapFrontendStatusToBackend` (in `src/utils/eventHelpers.js`) to convert event status between backend (UPPERCASE) and frontend (lowercase) values.
- **Truncation:** Use `truncateTitle` and `truncateDescription` (in `eventHelpers.js`) for all title/description display. List views: 40/300 chars. Forms: 50/300 chars.
- **API Integration:** Use RTK Query endpoints. For event CRUD, see `eventApi.js`. Always send status as backend enum (UPPERCASE).
- **Rich Text Editor:** Use the provided `RichTextEditor` component for event descriptions. It outputs HTML. Toolbar: bold, italic, underline, list, link, clear format. Keyboard shortcuts supported.
- **No QR Token in List:** Do not display `qrJoinToken` in event lists.
- **Single Line Display:** Titles/descriptions in lists must be single-line (CSS enforced).

## Developer Workflows
- **Install:** `npm install`
- **Run Dev Server:** `npm run dev`
- **API Base URL:** Set `VITE_BASE_URL` in `.env` (default: `http://localhost:8080/api`).
- **Debugging:** Use `console.log` for API payloads, status mapping, and truncation checks. See README for debug snippets.
- **Hot Reload:** Vite dev server supports HMR.
- **Manual Refresh:** Use the `refetch` method from RTK Query hooks to refresh event data. (See `EventManagement.jsx`.)
- **Auto Refresh:** For real-time UX, use `useEffect` with `setInterval` to call `refetch` every 60s in event management pages.

## Integration Points
- **Backend:** Expects ISO datetime (no timezone/seconds required). Status as enum string. Description as HTML.
- **Frontend:** All API calls via RTK Query. State via Redux. UI via React components.

## Examples
- **Status Mapping:**
  ```js
  const displayStatus = mapBackendStatusToFrontend(event.status);
  const backendStatus = mapFrontendStatusToBackend(form.status);
  ```
- **Truncation:**
  ```js
  const shortTitle = truncateTitle(event.title, 40);
  const shortDesc = truncateDescription(event.description, 300);
  ```
- **Rich Text Editor:**
  ```js
  <RichTextEditor value={description} onChange={setDescription} />
  ```

## File References
- `src/api/eventApi.js`, `src/api/rootApi.js`: API logic
- `src/pages/admin/EventManagement.jsx`, `src/pages/admin/EventModal.jsx`: Admin UI
- `src/components/common/RichTextEditor.jsx`: Rich text editor
- `src/utils/eventHelpers.js`: Status/truncation helpers

---
For more, see `README.md`. Please follow these conventions for all code generation and refactoring in this project.

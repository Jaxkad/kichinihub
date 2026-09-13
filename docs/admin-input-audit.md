# Admin input and keyboard audit

Date: 13 September 2026

## Follow-up: numeric editing and phone layouts

The item price is the only numeric entry field in the workspace. Previously,
`Number(event.target.value)` converted a cleared field to zero immediately.
Price drafts now retain the input string, start blank for new items, and show
`0` only as an optional placeholder. Existing prices (including genuine zero)
remain visible. Conversion happens when saving, after native required, minimum,
maximum, and decimal-step validation. Empty values are also guarded at submission.

This follows [React's controlled-input guidance](https://react.dev/reference/react-dom/components/input)
on retaining an empty string for empty input. The persistent Price (MWK) label
remains; the placeholder is not a replacement for it, consistent with
[GOV.UK's label guidance](https://design-system.service.gov.uk/components/text-input/).

Phone layouts now use full-width content and a horizontally scrollable labeled
navigation row. Actions wrap, filters stack, media descriptions fit narrow forms,
and key action buttons have at least 44px height. The sidebar can scroll on larger
screens with short viewports. Visual-viewport updates are batched per animation
frame and unchanged sizes are not rewritten.

The production build, TypeScript, lint, and 15 existing tests passed. The login
layout was inspected at 390px width. Authenticated re-verification of this follow-up
was blocked by an expired/invalid saved sign-in; the browser checks below refer to
the preceding input audit, not verification of the new navigation layout.

## Coverage and fixes

| Area | Controls audited | Result |
| --- | --- | --- |
| Sign-in | Email, password | 16px minimum, email autocorrection disabled, password-manager autocomplete preserved; email Next advances to password, Go submits login. |
| Menu library | Search, category and availability filters | Removed 12px overrides; Search dismisses input focus while preserving live results and query. |
| Item editor | Name, description, price, category, dietary/availability checkboxes | 16px minimum; decimal keyboard for price; Next advances fields; descriptions retain newline entry. |
| Dish photo editor | Upload, photo description | Shared font safeguard and keyboard behavior also cover conditionally mounted photo descriptions. |
| Category editor | Title, subtitle, theme | 16px minimum; opening focuses the dialog heading instead of activating a keyboard. |
| Contact settings | Social handles, reservation phone | 16px minimum; no automatic capitalization/correction; telephone keyboard; Next advances and Done ends editing. |
| Team access | Name, email, temporary password, role, disabled checkbox | Shared font safeguard; email correction disabled; new-password autocomplete retained; heading focus on opening. |
| Events | Title, multiline description, venue, dates, upload, media descriptions, visibility | Shared font safeguard; removed text autofocus; native date/file pickers retained; textarea Enter continues to insert newlines. |
| Audience insights | Reporting-period select | Shared font safeguard. |
| Overview and Help | No text-entry controls | No keyboard-specific changes needed. |

All sizes use `max(16px, 1rem)` so a larger user root font preference is respected.
There are no viewport zoom restrictions added by this change. The public menu's
existing search behavior is retained.

## Interaction rules

- Next moves to the next enabled, visible field in the same form/settings panel.
- Done ends single-line editing; it does not save or publish a draft implicitly.
- Search ends editing without erasing the search query.
- Login retains its explicit Go submission behavior.
- Native validation keeps invalid controls available for correction.
- Multiline Enter, composition/IME input, modified key combinations, date pickers,
  selects, and file controls keep their native behavior.
- Valid form submission dismisses a focused text keyboard on touch-capable devices.
- No global scroll-to-top, tap-outside, or scroll-to-dismiss handler interrupts editing.
- Dialogs open with heading focus, trap Tab, and restore focus on closing.
- Dialog bounds follow the visual viewport at normal scale so the keyboard does
  not consume their usable scroll area. Pinch zoom does not trigger dialog resizing.

## Evidence and rationale

- [WHATWG HTML: enterkeyhint](https://html.spec.whatwg.org/dev/interaction.html#input-modalities:-the-enterkeyhint-attribute): hints describe keyboard labels; application handlers implement Next/Done actions.
- [MDN source documentation](https://github.com/mdn/content/blob/main/files/en-us/web/html/reference/global_attributes/enterkeyhint/index.md): Next, Done, Go, and Search semantics.
- [MDN inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode): appropriate decimal and telephone keyboards; inputmode is not validation.
- [MDN autofocus](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus): automatic focus may scroll the page and expose the virtual keyboard unexpectedly.
- [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): initial focus, focus containment, and return focus.
- [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport): the on-screen keyboard can shrink the visible viewport without resizing the layout viewport.
- [WebKit interaction guidance](https://webkit.org/blog/7367/new-interaction-behaviors-in-ios-10/): preserving user zoom matters for readable content.
- [Developer community report](https://meta.stackoverflow.com/questions/389464/form-elements-should-be-at-least-16px-font-size-to-prevent-mobile-browsers-from): practical evidence for the 16px iOS focus-zoom safeguard; this threshold is browser behavior, not an HTML standard requirement.

## Verification

Browser checks at 390px width covered computed 16px field sizes in menu search,
filters, item/category/user dialogs, settings, and events. Search kept its query
after Enter and released focus; Next advanced from item name to description;
textarea Enter inserted a newline; settings Done released focus; category dialog
opened on its heading. No menu, account, or event test data was published.

Desktop browser emulation cannot certify actual iPhone keyboard animation or
Safari auto-zoom behavior. A physical iPhone/iPad check remains appropriate for
keyboard open/close, landscape dialogs, pinch zoom, and password autofill.

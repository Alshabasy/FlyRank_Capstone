# AI Workflow Comparison

## Overview
This document compares two AI-generated implementations of the same Contact feature from branches `ai-vague` and `ai-spec`. The comparison is based on repository contents: `ai-vague` provides a single TypeScript component at `src/components/Contact.tsx`; `ai-spec` provides a modular JSX implementation split across `src/components/Contact.jsx`, `ContactForm.jsx`, `ContactField.jsx`, and `ContactInfoPanel.jsx`.

## Correctness
- ai-vague implements the form in one TypeScript file (`src/components/Contact.tsx`) with an explicit `validate()` routine that enforces minimum constraints (for example, the code sets "Name must be at least 2 characters" and "Message must be at least 10 characters").
- ai-spec splits responsibilities: `Contact.jsx` composes `ContactForm` and `ContactInfoPanel`; `ContactForm.jsx` maps a `fields` array into `ContactField` components and centralizes rendering and submission logic. The split improves separation of concerns and makes focused testing and reuse easier.

## Accessibility
- ai-vague includes an explicit region label: the component renders `<section id="contact" aria-labelledby="contact-heading">`, connecting the region to a heading for assistive technologies.
- ai-spec composes headings and a section (e.g., `<section id="contact" ref={sectionRef}>`) and provides label props to input fields via `ContactField.jsx`, but it does not include the `aria-labelledby` attribute present in `ai-vague`. Both branches otherwise use semantic form controls (inputs, buttons) and display status messages via a Snackbar/Alert mechanism.

## Edge Cases
- ai-vague explicitly validates short or empty inputs (name length < 2, message length < 10, and email checks) inside its `validate()` implementation, preventing these invalid submissions with descriptive messages.
- ai-spec adds defensive length limits at the input level (e.g., `maxLength: 1000` in `ContactForm.jsx`) and disables submission when `isFormValid` is false, preventing overly long submissions that ai-vague does not block via input attributes.
- Neither implementation provides advanced focus management beyond standard browser behavior.

## Review Effort
- ai-vague’s single-file implementation was faster to review initially (fewer files), and as observed, it was accepted with minimal intervention.
- ai-spec required reviewing several smaller files, increasing upfront review time, but the modular layout reduces complexity for future changes and testing.

## AI Mistake I Caught
In `ai-spec` the contact section was missing the `aria-labelledby="contact-heading"` connection that `ai-vague` includes. This omission required a manual accessibility correction during review.

## Conclusion
The specification-driven workflow (`ai-spec`) produced a more modular, maintainable code structure (separate `ContactForm`, `ContactField`, and `ContactInfoPanel`), improving testability and future review efficiency. However, an explicit accessibility requirement in the specification would have prevented the `aria-labelledby` omission observed; include that check in future specs to avoid regressions.

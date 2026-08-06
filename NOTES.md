# shadcn/ui notes

## What shadcn handled that I missed

1. Composition and API consistency
   - shadcn exposes dialog and tabs as small, composable primitives with a predictable API.
   - My custom version was a single self-contained implementation with less structure for reuse.

2. Built-in styling and state hooks
   - The generated dialog and tabs components already attach data attributes and styling hooks for open/active/disabled states.
   - My version handled the core behavior, but it did not include the same polished class-based state styling system.

3. Accessibility support beyond the core pattern
   - shadcn’s version uses the underlying ARIA primitives from Base UI, which gives stronger semantics and better interoperability out of the box.
   - My implementation covered the main keyboard interactions, but I did not include the same breadth of internal state handling and focus-management utilities.

4. Focus and transition behavior
   - shadcn’s dialog includes overlay and popup structure with consistent focus handling and visual transitions.
   - My custom modal was functional, but it was more minimal and did not include the same polished container and animation layer.

## Concrete gaps compared with shadcn

- My version did not provide a reusable composition API like DialogTrigger, DialogContent, DialogTitle, and DialogDescription.
- My tabs implementation handled basic arrow-key navigation, but it did not include shadcn’s richer data-attribute-based styling and variant support.
- The shadcn components are designed for easier future extension and integration into a larger design system.

/**
 * JSX typings for the @material/web custom elements we use.
 *
 * Web components aren't known to React's JSX namespace out of the box, so we
 * map each tag to a props type that allows the element's attributes plus the
 * standard React DOM props (className, onClick, children, …). Only the
 * attributes we actually set are declared; everything else falls back to the
 * permissive base so we don't have to mirror the full Lit element API.
 */
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type CustomElement<TAttributes = object> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & TAttributes,
  HTMLElement
>

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': CustomElement<{ disabled?: boolean; type?: string }>
      'md-outlined-button': CustomElement<{ disabled?: boolean; type?: string }>
      'md-text-button': CustomElement<{ disabled?: boolean; type?: string }>
      'md-chip-set': CustomElement
      'md-suggestion-chip': CustomElement<{ disabled?: boolean }>
    }
  }
}

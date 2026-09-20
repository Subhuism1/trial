// Missing / true = field shown; only an explicit false hides it.
export function isRsvpFieldOn(fields, key) {
  return fields?.[key] !== false;
}

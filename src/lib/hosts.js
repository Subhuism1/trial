// Groom side, bride side, then any extra families -- as one ordered list.
function hostPhones(info) {
  return [info?.phone, ...(info?.extraPhones ?? [])].map((p) => p?.trim() ?? "").filter(Boolean);
}

export function resolveHostEntries(hosts) {
  const side = (which) => {
    const info = which === "groom" ? hosts?.groomSide : hosts?.brideSide;
    return {
      key: which,
      relation: info?.relation || (which === "groom" ? "Groom's Family" : "Bride's Family"),
      person: info?.person ?? "",
      subtitle: info?.subtitle,
      phones: hostPhones(info),
    };
  };

  const extras = (hosts?.additional ?? [])
    .map((h, i) => ({
      key: h.id ?? `extra-${i}`,
      relation: h.relation || "Family",
      person: h.person ?? "",
      subtitle: h.subtitle,
      phones: hostPhones(h),
    }))
    .filter((e) => e.person || e.subtitle || e.phones.length);

  return [side("groom"), side("bride"), ...extras];
}

// Grid modifier so 1 / 2 / 3+ host cards lay out properly.
export function hostGridClass(base, count) {
  if (count <= 1) return `${base} ${base}--single`;
  if (count === 2) return base;
  return `${base} ${base}--many`;
}

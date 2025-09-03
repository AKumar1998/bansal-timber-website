export default function RectangleButton({
  text,           // text shown to users (e.g. "+91 12345 12345" or "Call us")
  phone           // optional; raw phone used for tel: (if not provided we derive from text)
}) {
  // sanitize a phone string into a tel-friendly format:
  // keeps leading + (if present) then all digits.
  const sanitizePhone = (s) => {
    if (!s) return "";
    s = String(s).trim();
    const hasPlus = s.startsWith("+");
    const digits = s.replace(/\D/g, ""); // remove non-digits
    return hasPlus ? `+${digits}` : digits;
  };

  const telRaw = sanitizePhone(phone ?? text);
  // fallback if sanitized result is empty
  const hrefValue = telRaw ? `tel:${telRaw}` : undefined;

  // accessibility label — reads better for screen readers
  const ariaLabel = hrefValue ? `Call ${text}` : text;

  return (
    // Use <a> when you want link behavior (tel:). If hrefValue is missing,
    // we still render a <div> fallback (or you could render a disabled button).
    hrefValue ? (
      <a
        href={hrefValue}
        aria-label={ariaLabel}
        className="bg-[#FF5724] flex items-center justify-center p-4 rounded-md
                   hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF5724]"
      >
        <span className="font-[NeueHaasBold] text-white text-xl">
          {text}
        </span>
      </a>
    ) : (
      <div
        role="button"
        aria-label={ariaLabel}
        tabIndex={0}
        className="bg-[#FF5724] flex items-center justify-center p-4 rounded-md select-none opacity-60"
      >
        <span className="font-[NeueHaasBold] text-white text-xl">{text}</span>
      </div>
    )
  );
}


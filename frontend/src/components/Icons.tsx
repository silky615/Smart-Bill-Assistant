type IconProps = { className?: string };

export function IconDoc({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChart({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 17v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 10h8M8 14h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 19l1.5-3H18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 15l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDollar({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v18M16.5 8.5a3 3 0 0 0-3-3h-1a3 3 0 0 0 0 6h1a3 3 0 0 1 0 6h-1a3 3 0 0 1-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconData({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="5" rx="7" ry="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconSparkle({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l1.2 4.2L17 8l-3.8 1.8L12 14l-1.2-4.2L7 8l3.8-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M19 14l.6 2.1L21 17l-1.4.9L19 20l-.6-2.1L17 17l1.4-.9L19 14z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRobot({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconSend({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12l16-8-7 16-2-6-7-2z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconWarning({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" />
      <path
        d="M10.3 4.4L2.4 17.2A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.8l-7.9-12.8a2 2 0 0 0-3.4 0z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="vz-icon-back">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBrand() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="vz-brand-icon">
      <path d="M12 3L4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-8-6z" fill="currentColor" opacity="0.15" />
      <path
        d="M12 3L4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-8-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 14l2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

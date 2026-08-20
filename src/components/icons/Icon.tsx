interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

function base(size = 18, strokeWidth = 1.75) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function IconFlame({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1.5-1-2-1-3.5 2 1 3 3.5 3 6a5 5 0 0 1-10 0c0-4 2-6 2-8 1 .5 2 1 3-2.5Z" />
    </svg>
  );
}

export function IconBook({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5v-15Z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v18h6.5a1.5 1.5 0 0 0 1.5-1.5v-15Z" />
    </svg>
  );
}

export function IconCheck({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}

export function IconBell({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

export function IconCalendar({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconChat({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 5.5h16v11H10l-4.5 4v-4H4v-11Z" />
    </svg>
  );
}

export function IconVideo({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="3" y="6.5" width="12.5" height="11" rx="1.5" />
      <path d="M15.5 10.5 21 7.5v9l-5.5-3Z" />
    </svg>
  );
}

export function IconMic({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
    </svg>
  );
}

export function IconMail({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  );
}

export function IconPhoneApp({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.2h2" />
    </svg>
  );
}

export function IconMessageDots({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 5.5h16v11H10l-4.5 4v-4H4v-11Z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
    </svg>
  );
}

export function IconTrend({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 16 10 9l4 4 6-7" />
      <path d="M15 6h5v5" />
    </svg>
  );
}

export function IconGear({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.7 6.3l-1.7 1.7M8 16l-1.7 1.7M17.7 17.7 16 16M8 8 6.3 6.3" />
    </svg>
  );
}

export function IconUsers({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.7-3.5 3-5.5 5.5-5.5s4.8 2 5.5 5.5" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14.3c2 .2 3.6 1.9 4.2 4.7" />
    </svg>
  );
}

export function IconCoin({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M14.7 9.7c-.4-.9-1.3-1.4-2.7-1.4-1.7 0-2.7.8-2.7 1.9 0 2.7 5.4 1.3 5.4 3.9 0 1.1-1 1.9-2.7 1.9-1.4 0-2.3-.5-2.7-1.4" />
    </svg>
  );
}

export function IconPlug({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9 3v5M15 3v5M6.5 8h11v3.5A5.5 5.5 0 0 1 12 17a5.5 5.5 0 0 1-5.5-5.5V8Z" />
      <path d="M12 17v4" />
    </svg>
  );
}

export function IconCap({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M2.5 9 12 5l9.5 4-9.5 4-9.5-4Z" />
      <path d="M6.5 11v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4M21 9v5" />
    </svg>
  );
}

export function IconKey({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M17 6l2.5 2.5M14 9l2 2" />
    </svg>
  );
}

export function IconTarget({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconWave({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 15c1.5-4 3-6 3-9a1.5 1.5 0 0 1 3 0v5M10 6.5a1.5 1.5 0 0 1 3 0V11M13 7a1.5 1.5 0 0 1 3 0v4M16 9.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-7 7-3 0-4.5-1-6.5-3.5L4 14" />
    </svg>
  );
}

export function IconLoop({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 12a8 8 0 0 1 13.5-5.8M20 12a8 8 0 0 1-13.5 5.8" />
      <path d="M17 3v4h-4M7 21v-4h4" />
    </svg>
  );
}

export function IconAlarm({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9v4l2.5 1.5M5 4 2.5 6.5M19 4l2.5 2.5" />
    </svg>
  );
}

export function IconOpenBook({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 6.5c-1.5-1.3-3.5-2-6-2v12.5c2.5 0 4.5.7 6 2 1.5-1.3 3.5-2 6-2V4.5c-2.5 0-4.5.7-6 2Z" />
      <path d="M12 6.5v12.5" />
    </svg>
  );
}

export function IconChevronLeft({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function IconChevronRight({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function IconDot({ size, className }: IconProps) {
  return (
    <svg width={size ?? 8} height={size ?? 8} viewBox="0 0 8 8" className={className}>
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}

export function IconPlus({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 4.5v15M4.5 12h15" />
    </svg>
  );
}

export function IconDownload({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 3.5v11.5M7.5 11l4.5 4.5L16.5 11M4.5 18.5h15" />
    </svg>
  );
}

export function IconUser({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1-4.3 3.8-6.5 7.5-6.5s6.5 2.2 7.5 6.5" />
    </svg>
  );
}

export function IconBuilding({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="4" y="3.5" width="10" height="17" rx="1" />
      <rect x="15" y="9" width="5" height="11.5" rx="1" />
      <path d="M7 7h1M7 10.5h1M7 14h1M10.5 7h1M10.5 10.5h1M10.5 14h1M17.2 12.5h1M17.2 16h1" />
    </svg>
  );
}

export function IconLock({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export function IconClose({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconSend({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M4 12 20 4l-6 16-3-6-7-2Z" />
    </svg>
  );
}

export function IconCompass({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-4 2 2-6 4-2Z" />
    </svg>
  );
}

export function IconBriefcase({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="3" y="8" width="18" height="11" rx="1.5" />
      <path d="M8.5 8V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2M3 13h18" />
    </svg>
  );
}

export function IconChild({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="6.5" r="3" />
      <path d="M7 21v-5c0-2.5 2-4.5 5-4.5s5 2 5 4.5v5" />
      <path d="M9 21v-3M15 21v-3" />
    </svg>
  );
}

export function IconPlay({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M6.5 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  );
}

export function IconPause({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M7 4.5h3v15H7zM14 4.5h3v15h-3z" />
    </svg>
  );
}

export function IconStop({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export function IconTeen({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="6.5" r="3" />
      <path d="M6.5 21v-4.5c0-2.5 2.4-4.5 5.5-4.5s5.5 2 5.5 4.5V21" />
      <path d="M8.5 12.5 6 9.5M15.5 12.5 18 9.5" />
    </svg>
  );
}

export function IconElder({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="11" cy="6.5" r="3" />
      <path d="M6 21c.5-4 2.5-6.5 5-6.5s4.2 1.8 4.8 4.5" />
      <path d="M17 13v5.5M17 13c1.5 0 2.5-1 2.5-1" />
    </svg>
  );
}

export function IconGenderFemale({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V21M8.5 18h7" />
    </svg>
  );
}

export function IconGenderMale({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="10.5" cy="13.5" r="5.5" />
      <path d="M14.5 9.5 20 4M14.5 4h5.5v5.5" />
    </svg>
  );
}

export function IconGenderNeutral({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}

export function IconHeart({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M12 20s-7.5-4.6-9.5-9.5C1 6.5 3.3 3.5 6.5 3.5c2 0 3.7 1.1 4.5 2.7.8-1.6 2.5-2.7 4.5-2.7 3.2 0 5.5 3 4 7-2 4.9-9.5 9.5-9.5 9.5Z" />
    </svg>
  );
}

export function IconMedal({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M8.5 3.5 6 10l3.5 2M15.5 3.5 18 10l-3.5 2" />
      <circle cx="12" cy="14.5" r="6" />
      <path d="M12 11.5v6M9.5 14.5h5" />
    </svg>
  );
}

export function IconLogout({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9M15 16l4-4-4-4M19 12H9" />
    </svg>
  );
}

export function IconLink({ size, className, strokeWidth }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)} className={className}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5l1.5-1.5a4 4 0 0 1 5.5 5.5l-2 2M13 17.5 11.5 19a4 4 0 0 1-5.5-5.5l2-2" />
    </svg>
  );
}

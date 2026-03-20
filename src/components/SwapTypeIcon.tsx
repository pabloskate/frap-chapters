import type { SwapTypeIconProps, SwapTypeId } from '../types';

function iconProps({
  className,
  height = 24,
  strokeWidth = 2,
  width = 24,
}: SwapTypeIconProps) {
  return {
    className,
    fill: 'none',
    height,
    stroke: 'currentColor',
    strokeWidth,
    viewBox: '0 0 24 24',
    width,
  };
}

export function SwapTypeIcon({
  type,
  ...props
}: SwapTypeIconProps & { type: SwapTypeId }) {
  switch (type) {
    case 'email':
      return (
        <svg {...iconProps(props)}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'social':
      return (
        <svg {...iconProps(props)}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'newsletter':
      return (
        <svg {...iconProps(props)}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case 'interview':
      return (
        <svg {...iconProps(props)}>
          <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
        </svg>
      );
    case 'facebook-group':
      return (
        <svg {...iconProps(props)}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'thankyou':
      return (
        <svg {...iconProps(props)}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...iconProps(props)}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    default:
      return null;
  }
}

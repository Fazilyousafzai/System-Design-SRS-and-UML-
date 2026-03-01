// components/Icon.tsx
// Pure emoji icon component — zero native dependencies, no font loading.
// Drop-in replacement for <Ionicons name="..." size={x} color={y} />

import React from 'react';
import { Text, TextStyle } from 'react-native';

const MAP: Record<string, string> = {
  // Navigation
  'arrow-back': '←',
  'chevron-forward': '›',
  'chevron-back': '‹',
  'close': '✕',
  'close-circle': '✕',
  'close-circle-outline': '✕',
  'menu': '≡',
  'add': '+',
  'remove': '−',

  // Search & Filter
  'search': '🔍',
  'search-outline': '🔍',
  'options': '⚙',
  'filter': '▼',
  'refresh': '↻',
  'refresh-outline': '↻',

  // Auth / Security
  'lock-closed-outline': '🔒',
  'lock-closed': '🔒',
  'eye': '👁',
  'eye-outline': '👁',
  'eye-off': '○',
  'eye-off-outline': '○',
  'shield-outline': '🛡',
  'shield': '🛡',
  'shield-checkmark-outline': '✅',
  'shield-checkmark': '✅',
  'finger-print-outline': '◎',
  'log-out-outline': '⬛',

  // User / Profile
  'person': '👤',
  'person-outline': '👤',
  'mail': '✉',
  'mail-outline': '✉',
  'call': '📞',
  'call-outline': '📞',
  'phone-portrait-outline': '📱',

  // Tabs / Home
  'home': '⌂',
  'home-outline': '⌂',
  'restaurant': '🍽',
  'restaurant-outline': '🍽',
  'calendar': '📅',
  'calendar-outline': '📅',
  'receipt': '🧾',
  'receipt-outline': '🧾',

  // Food / Menu
  'flame': '🔥',
  'flame-outline': '🔥',
  'time': '⏱',
  'time-outline': '⏱',
  'star': '★',
  'star-outline': '☆',
  'heart': '♥',
  'heart-outline': '♡',
  'thumbs-up': '👍',
  'thumbs-up-outline': '👍',

  // Cart / Shopping
  'bag': '🛍',
  'bag-outline': '🛍',
  'bag-add': '+',
  'bag-add-outline': '+',
  'trash': '🗑',
  'trash-outline': '🗑',

  // Payment
  'card': '💳',
  'card-outline': '💳',
  'cash': '💵',
  'cash-outline': '💵',

  // Location
  'location': '📍',
  'location-outline': '📍',
  'map': '🗺',
  'map-outline': '🗺',
  'navigate-outline': '→',

  // Status
  'checkmark': '✓',
  'checkmark-circle': '✅',
  'checkmark-circle-outline': '✅',
  'ellipse': '●',
  'ellipse-outline': '○',
  'alert-circle': '⚠',
  'alert-circle-outline': '⚠',
  'information-circle-outline': 'ℹ',

  // Settings / Misc
  'settings': '⚙',
  'settings-outline': '⚙',
  'notifications': '🔔',
  'notifications-outline': '🔔',
  'moon': '🌙',
  'sunny': '☀',
  'sunny-outline': '☀',
  'document-text-outline': '📄',
  'document-text': '📄',
  'create-outline': '✏',
  'pencil': '✏',
  'pencil-outline': '✏',
  'grid': '⊞',
  'grid-outline': '⊞',
  'share-outline': '↑',
  'camera-outline': '📷',
  'image-outline': '🖼',
};

interface Props {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export default function Icon({ name, size = 20, color = '#FFF', style }: Props) {
  const glyph = MAP[name] ?? '•';
  return (
    <Text
      style={[
        {
          fontSize: size * 0.85,
          color,
          lineHeight: size * 1.15,
          textAlign: 'center',
          includeFontPadding: false,
        },
        style,
      ]}
      numberOfLines={1}
      allowFontScaling={false}
    >
      {glyph}
    </Text>
  );
}

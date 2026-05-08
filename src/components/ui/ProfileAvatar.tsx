import React from 'react';

interface ProfileAvatarProps {
  username: string;
  bgcolor?: string;
  /** Pixel size. Pass `null` to let the avatar fill its parent container (use with className like "w-full h-full"). */
  size?: number | null;
  className?: string;
}

export function ProfileAvatar({
  username,
  bgcolor = 'var(--primary)',
  size = 100,
  className = ''
}: ProfileAvatarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  // When size is null/undefined → let parent control dimensions (responsive containers)
  const fillParent = size === null;

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold opacity-90 text-white ${fillParent ? 'w-full h-full' : ''} ${className}`}
      style={{
        backgroundColor: bgcolor || 'var(--primary)',
        ...(fillParent ? {} : {
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${(size as number) * 0.3}px`,
        }),
      }}
    >
      {initials}
    </div>
  );
}

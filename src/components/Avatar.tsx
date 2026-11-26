import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ASSETS } from '../data/seedData';

interface AvatarProps {
  src?: string;
  name?: string;
  tone?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  anonymous?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name = 'User',
  tone = '#648BFF',
  size = 'md',
  anonymous = false,
  className = '',
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const dims =
    size === 'xs'
      ? 'w-6 h-6 text-[10px]'
      : size === 'sm'
      ? 'w-8 h-8 text-xs'
      : size === 'lg'
      ? 'w-12 h-12 text-base'
      : size === 'xl'
      ? 'w-16 h-16 text-2xl'
      : 'w-9 h-9 text-sm';

  if (src && !imgFailed && !anonymous) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`${dims} rounded-full object-cover border border-[#25334D] shrink-0 ${className}`}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || 'A';

  return (
    <div
      className={`${dims} rounded-full flex items-center justify-center font-bold text-[#F4F6FC] shrink-0 border border-white/10 ${className}`}
      style={{ backgroundColor: tone }}
      aria-hidden="true"
    >
      {anonymous ? <User className="w-[54%] h-[54%] text-white/95" /> : initial}
    </div>
  );
}

const STACK_MEMBERS = [
  { id: 's1', name: 'Alex', src: ASSETS.avatarAlex, tone: '#648BFF' },
  { id: 's2', name: 'Maya', tone: '#A69BFF' },
  { id: 's3', name: 'Jordan', tone: '#57D38C' },
  { id: 's4', name: 'Deena', tone: '#E06C65' },
  { id: 's5', name: 'Sam', tone: '#E3B341' },
  { id: 's6', name: 'Riya', tone: '#5C9BFF' },
];

export function AvatarStack({ count = 5, size = 'sm' }: { count?: number; size?: 'xs' | 'sm' | 'md' }) {
  return (
    <div className="flex items-center -space-x-2">
      {STACK_MEMBERS.slice(0, count).map((member) => (
        <Avatar
          key={member.id}
          src={member.src}
          name={member.name}
          tone={member.tone}
          size={size}
          className="ring-2 ring-[#0D1628]"
        />
      ))}
    </div>
  );
}

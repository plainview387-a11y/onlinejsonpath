export const avatarPresets = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-01',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-02',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-03',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-04',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar-05',
  'https://api.dicebear.com/7.x/bottts/svg?seed=avatar-06',
  'https://api.dicebear.com/7.x/bottts/svg?seed=avatar-07',
  'https://api.dicebear.com/7.x/bottts/svg?seed=avatar-08',
  'https://api.dicebear.com/7.x/bottts/svg?seed=avatar-09',
  'https://api.dicebear.com/7.x/bottts/svg?seed=avatar-10',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=avatar-11',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=avatar-12',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=avatar-13',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=avatar-14',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=avatar-15',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=avatar-16',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=avatar-17',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=avatar-18',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=avatar-19',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=avatar-20',
];

export function pickNextAvatar(currentAvatar?: string | null) {
  if (!currentAvatar) return avatarPresets[0];
  const currentIndex = avatarPresets.indexOf(currentAvatar);
  if (currentIndex === -1) {
    return avatarPresets[Math.floor(Math.random() * avatarPresets.length)];
  }
  return avatarPresets[(currentIndex + 1) % avatarPresets.length];
}

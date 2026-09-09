import { User } from '../types';

// Mock nearby users for swipe screen
export const MOCK_NEARBY_USERS: User[] = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    bio: 'Love hiking and coffee. Always up for spontaneous adventures! 🏔️',
    photoUrl: 'https://picsum.photos/seed/alex/400/600',
    distance: 320, // mocked distance in meters
  },
  {
    id: '2',
    name: 'Jordan',
    age: 26,
    bio: 'Photographer by day, musician by night. Let\'s explore the city together! 📸',
    photoUrl: 'https://picsum.photos/seed/jordan/400/600',
    distance: 450,
  },
  {
    id: '3',
    name: 'Sam',
    age: 30,
    bio: 'Foodie, dog lover, and eternal optimist. Big fan of spontaneous plans.',
    photoUrl: 'https://picsum.photos/seed/sam/400/600',
    distance: 280,
  },
  {
    id: '4',
    name: 'Taylor',
    age: 27,
    bio: 'Runner, reader, and coffee enthusiast. Always looking for new book recommendations.',
    photoUrl: 'https://picsum.photos/seed/taylor/400/600',
    distance: 520,
  },
  {
    id: '5',
    name: 'Casey',
    age: 29,
    bio: 'Art gallery hopper and weekend brunch expert. Let\'s meet up! 🎨',
    photoUrl: 'https://picsum.photos/seed/casey/400/600',
    distance: 390,
  },
];

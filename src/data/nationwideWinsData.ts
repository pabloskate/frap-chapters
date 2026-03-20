export interface NationwideChapterMember {
  name: string;
  avatar?: string | null;
}

export interface NationwideChapter {
  id: string;
  name: string;
  facilitator: string;
  city: string;
  coords: [number, number];
  facilitatorAvatar?: string | null;
  members: NationwideChapterMember[];
}

export interface NationwideWin {
  name: string;
  company: string;
  city: string;
  coords: [number, number];
  win: string;
  time: string;
  avatar: string | null;
  content: string;
  image: string | null;
}

export const nationwideChaptersData: NationwideChapter[] = [
  {
    id: '1',
    name: 'Austin Central FRAP',
    facilitator: 'Sarah Chen',
    city: 'Austin, TX',
    coords: [30.2672, -97.7431],
    facilitatorAvatar: 'https://i.pravatar.cc/150?img=1',
    members: [
      { name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
      { name: 'Amanda Foster', avatar: 'https://i.pravatar.cc/150?img=9' },
      { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=11' },
      { name: 'Lisa Park', avatar: 'https://i.pravatar.cc/150?img=20' },
      { name: 'Carlos Rivera', avatar: 'https://i.pravatar.cc/150?img=13' },
      { name: 'Diana Chen', avatar: 'https://i.pravatar.cc/150?img=25' },
    ],
  },
  {
    id: '2',
    name: 'Dallas Metro FRAP',
    facilitator: 'Marcus Johnson',
    city: 'Dallas, TX',
    coords: [32.7767, -96.797],
    facilitatorAvatar: 'https://i.pravatar.cc/150?img=3',
    members: [
      { name: 'Maria Santos', avatar: 'https://i.pravatar.cc/150?img=16' },
      { name: 'Tom Bradley', avatar: 'https://i.pravatar.cc/150?img=14' },
      { name: 'Karen Liu', avatar: 'https://i.pravatar.cc/150?img=24' },
      { name: 'Steve Park', avatar: 'https://i.pravatar.cc/150?img=18' },
      { name: 'Rachel Green', avatar: 'https://i.pravatar.cc/150?img=26' },
    ],
  },
];

export const nationwideWinsData: NationwideWin[] = [
  {
    name: 'Sarah Chen',
    company: 'Bright Ideas Marketing',
    city: 'Austin, TX',
    coords: [30.2672, -97.7431],
    win: 'Closed biggest client deal - $50K contract',
    time: '2 hours ago',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content:
      "Just closed our biggest client deal of the quarter! 6-month contract worth $50K. Thank you FRAP community for the referral connections and negotiation advice during our Tuesday meeting!",
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  },
  {
    name: 'Marcus Johnson',
    company: "Johnson's Auto Repair",
    city: 'Dallas, TX',
    coords: [32.7767, -96.797],
    win: 'Hired first employee!',
    time: '5 hours ago',
    avatar: 'https://i.pravatar.cc/150?img=3',
    content:
      "Hired our first employee today! After months of trying to do everything solo, I'm officially a business owner with a team. Excited for this new chapter!",
    image: null,
  },
  {
    name: 'Elena Rodriguez',
    company: 'Rodriguez Bakery',
    city: 'Houston, TX',
    coords: [29.7604, -95.3698],
    win: 'Launched online ordering system - 12 orders in 2 hours',
    time: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content:
      'Launched our online ordering system today! Thanks to the tech advice from the Thursday FRAP group. Already received 12 orders in the first 2 hours.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
  },
  {
    name: 'David Park',
    company: "Park's Creative Studio",
    city: 'San Antonio, TX',
    coords: [29.4241, -98.4936],
    win: 'Won a design award for rebranding project',
    time: '2 days ago',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content:
      'Won a design award for our rebranding project! The client was thrilled and has already referred two new businesses to us. FRAP accountability really helped us stay on track with deliverables.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=400&fit=crop',
  },
  {
    name: 'Amanda Foster',
    company: 'Foster Consulting',
    city: 'Austin, TX',
    coords: [30.3074, -97.7535],
    win: 'Hit 6 figures in monthly revenue!',
    time: '3 days ago',
    avatar: 'https://i.pravatar.cc/150?img=9',
    content:
      "Finally hit 6 figures in monthly revenue! It took 18 months of consistent effort, but we're here. Couldn't have done it without the support system FRAP provides.",
    image: null,
  },
  {
    name: 'James Wilson',
    company: 'Wilson Tech Solutions',
    city: 'Austin, TX',
    coords: [30.25, -97.77],
    win: 'Secured 3 new enterprise clients',
    time: '4 days ago',
    avatar: 'https://i.pravatar.cc/150?img=11',
    content:
      'Secured 3 new enterprise clients this week! The networking through FRAP has been invaluable. Grateful for this community.',
    image: null,
  },
  {
    name: 'Maria Santos',
    company: 'Santos Design Co',
    city: 'Dallas, TX',
    coords: [32.784, -96.8],
    win: 'Completed 50th project milestone',
    time: '5 days ago',
    avatar: 'https://i.pravatar.cc/150?img=16',
    content:
      'Completed our 50th project milestone! Five years in and still growing. Thank you to everyone who believed in us from the start.',
    image: null,
  },
  {
    name: 'Robert Chen',
    company: 'Chen Logistics',
    city: 'Houston, TX',
    coords: [29.75, -95.35],
    win: 'Expanded to new warehouse facility',
    time: '1 week ago',
    avatar: 'https://i.pravatar.cc/150?img=12',
    content:
      "Expanded to our new warehouse facility today! Double the space, double the capacity. Here's to the next chapter of growth.",
    image: null,
  },
  {
    name: 'Jordan Blake',
    company: 'Blake Consulting',
    city: 'Austin, TX',
    coords: [30.26, -97.74],
    win: 'First consulting gig landed',
    time: '2 days ago',
    avatar: null,
    content:
      'Landed my first independent consulting gig! No avatar yet but celebrating anyway.',
    image: null,
  },
];

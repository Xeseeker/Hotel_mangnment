/** Demo payloads — replace with API responses when integrating. */

export const MOCK_ROOMS = [
  {
    id: 1,
    room_number: 101,
    type: "Executive Suite",
    price: 520,
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    room_number: 204,
    type: "Deluxe King",
    price: 380,
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    room_number: 310,
    type: "Junior Suite",
    price: 440,
    status: "occupied",
    image_url:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 4,
    room_number: 412,
    type: "Penthouse",
    price: 890,
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 5,
    room_number: 108,
    type: "Garden Room",
    price: 320,
    status: "maintenance",
    image_url:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 6,
    room_number: 215,
    type: "Classic Double",
    price: 265,
    status: "available",
    image_url:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];

export const MOCK_CUSTOMER_RESERVATIONS = [
  {
    id: 1001,
    room_id: 1,
    check_in: "2026-06-12T15:00:00.000Z",
    check_out: "2026-06-15T11:00:00.000Z",
    guests: 2,
    status: "confirmed",
  },
  {
    id: 1002,
    room_id: 4,
    check_in: "2026-07-01T15:00:00.000Z",
    check_out: "2026-07-04T11:00:00.000Z",
    guests: 3,
    status: "pending",
  },
  {
    id: 1003,
    room_id: 2,
    check_in: "2026-04-02T15:00:00.000Z",
    check_out: "2026-04-05T11:00:00.000Z",
    guests: 1,
    status: "checked_out",
  },
];

export function roomsArrayToMap(rooms) {
  const map = {};
  (rooms || []).forEach((r) => {
    map[r.id] = r;
  });
  return map;
}

export function getMockRoomById(id) {
  const n = Number(id);
  return MOCK_ROOMS.find((r) => r.id === n) || null;
}

/** Meeting & events page — all static until CMS / API */
export const MEETING_HERO = {
  title: "Meetings & events at Elysium Grand",
  subtitle:
    "Pillarless ballroom light, boardrooms with hybrid A/V, and a culinary team that plates every coffee break with intention.",
  image:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
};

export const MEETING_STATS = [
  { label: "Largest capacity", value: "180", hint: "reception style" },
  { label: "Meeting rooms", value: "8", hint: "including salons" },
  { label: "On-site planner", value: "24/7", hint: "dedicated desk" },
];

export const MEETING_SPACES = [
  {
    id: "gramercy-hall",
    name: "Gramercy Hall",
    capacity: "120 seated · 180 reception",
    size: "3,200 sq ft",
    description:
      "Daylight from three exposures, acoustic ceiling baffles, and a private pre-function lounge for registration and cocktails.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85",
    features: ["Wireless presentation", "Stage-ready power", "Partition-ready"],
  },
  {
    id: "salon-i",
    name: "Salon I",
    capacity: "40 classroom · 60 theater",
    size: "980 sq ft",
    description: "Ideal for board reviews, brand immersions, and breakout sessions from the main hall.",
    image:
      "https://images.unsplash.com/photo-1540575467063-27a990918d70?auto=format&fit=crop&w=1200&q=85",
    features: ["Dual 85\" displays", "Video conferencing", "Catering hatch"],
  },
  {
    id: "salon-ii",
    name: "Salon II & Library",
    capacity: "24 boardroom",
    size: "620 sq ft",
    description: "Hand-laid walnut table, leather seating, and soundproofing for confidential conversations.",
    image:
      "https://images.unsplash.com/photo-1562664377-70498329a0e1?auto=format&fit=crop&w=1200&q=85",
    features: ["Wired Crestron", "Privacy film", "Sommelier pairings"],
  },
];

export const MEETING_PACKAGES = [
  {
    name: "Half-day forum",
    price: "From $145",
    unit: "per guest",
    includes: ["Morning break with viennoiserie", "Chef’s lunch buffet", "Afternoon espresso bar", "Basic A/V tech"],
  },
  {
    name: "Full-day summit",
    price: "From $195",
    unit: "per guest",
    includes: ["Breakfast stations", "Two-course plated or buffet lunch", "Snack trio", "Dedicated technician"],
  },
  {
    name: "Evening gala",
    price: "Custom",
    unit: "quote",
    includes: ["Champagne reception", "Four-course menu", "Floral & lighting design", "After-party lounge"],
  },
];

export const MEETING_AMENITIES = [
  { title: "Hybrid ready", desc: "Broadcast-quality cameras, ceiling mics, and redundant fiber." },
  { title: "Culinary studio", desc: "Live cooking demos and plated experiences without leaving the floor." },
  { title: "Guest rooms", desc: "Room blocks with express check-in for delegates." },
  { title: "Wellness", desc: "Morning yoga or meditation slots in the spa suite." },
];

export const MEETING_FAQ = [
  {
    q: "How far in advance should we book?",
    a: "We recommend 90 days for full buyouts of Gramercy Hall; salons can often be held within 30 days subject to availability.",
  },
  {
    q: "Can we brand the space?",
    a: "Yes — custom signage, step-and-repeat, and digital welcome loops are coordinated by our events team.",
  },
  {
    q: "Parking and access?",
    a: "Valet for up to 40 vehicles and a discrete service entrance for load-in on 22nd Street (mock detail for demo).",
  },
];

export const MEETING_TESTIMONIAL = {
  quote:
    "Our leadership off-site felt effortless — every breakout was staged before we asked, and the food was genuinely memorable.",
  name: "Priya N.",
  role: "VP Operations, Meridian Labs",
};

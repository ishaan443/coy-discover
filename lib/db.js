import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const SEED_PROFILES = [
  { id: '1', name: 'Aarav', age: 23, city: 'IIT Delhi', bio: 'Building indie games and hunting for the best cold brew in town.', interests: ['Gaming', 'Coffee', 'Indie Music'], likedUser: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80' },
  { id: '2', name: 'Ananya', age: 22, city: 'NIFT Delhi', bio: 'Thrift store regular, film photography nerd, and weekend baker.', interests: ['Photography', 'Baking', 'Art'], likedUser: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
  { id: '3', name: 'Kabir', age: 24, city: 'Gurugram', bio: 'Product designer by day, amateur tennis player by evening.', interests: ['Tennis', 'Design', 'Travel'], likedUser: false, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { id: '4', name: 'Meera', age: 21, city: 'Ashoka University', bio: 'Reading sci-fi novels and overanalyzing A24 movies.', interests: ['Cinema', 'Sci-Fi', 'Writing'], likedUser: true, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80' },
  { id: '5', name: 'Rohan', age: 25, city: 'Bengaluru', bio: 'Running half-marathons and trying to keep my indoor plants alive.', interests: ['Running', 'Plants', 'Cooking'], likedUser: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80' },
  { id: '6', name: 'Diya', age: 22, city: 'Lady Shri Ram College', bio: 'Classical dancer learning to DJ. Always down for momos at midnight.', interests: ['Dance', 'Music', 'Street Food'], likedUser: true, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80' },
  { id: '7', name: 'Vikram', age: 26, city: 'Mumbai', bio: 'Architect obsessed with brutalism, espresso tonics, and coastal drives.', interests: ['Architecture', 'Coffee', 'Road Trips'], likedUser: false, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80' },
  { id: '8', name: 'Tara', age: 23, city: 'St. Stephens College', bio: 'Debate team alum, pottery beginner, and overly competitive at Catan.', interests: ['Pottery', 'Board Games', 'Books'], likedUser: true, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80' },
  { id: '9', name: 'Arjun', age: 24, city: 'BITS Pilani', bio: 'Full-stack dev who cooks a mean aglio e olio. Looking for a gym buddy.', interests: ['Coding', 'Cooking', 'Fitness'], likedUser: false, photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80' },
  { id: '10', name: 'Sanya', age: 21, city: 'SRCC Delhi', bio: 'Flea market explorer, vinyl collector, and terrible at parallel parking.', interests: ['Vinyl', 'Thrifting', 'Jazz'], likedUser: true, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80' },
  { id: '11', name: 'Dev', age: 25, city: 'Pune', bio: 'Weekend trekker in the Sahyadris. Send me your best Spotify playlists.', interests: ['Trekking', 'Playlists', 'Photography'], likedUser: false, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80' },
  { id: '12', name: 'Naina', age: 22, city: 'Manipal', bio: 'Marine bio student. Happiest when near the ocean or eating gelato.', interests: ['Ocean', 'Gelato', 'Scuba'], likedUser: true, photo: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&q=80' },
  { id: '13', name: 'Karan', age: 27, city: 'Hyderabad', bio: 'Startup founder trying to balance screen time with bad stand-up comedy.', interests: ['Startups', 'Comedy', 'Biryani'], likedUser: false, photo: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&q=80' },
  { id: '14', name: 'Isha', age: 23, city: 'Christ University', bio: 'Illustrator and dog person. Will definitely ask to pet your golden retriever.', interests: ['Illustration', 'Dogs', 'Matcha'], likedUser: true, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80' },
  { id: '15', name: 'Siddharth', age: 24, city: 'IIT Bombay', bio: 'Astrophotography enthusiast and late-night chess addict.', interests: ['Astronomy', 'Chess', 'Physics'], likedUser: false, photo: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=600&q=80' },
  { id: '16', name: 'Riya', age: 21, city: 'Hindu College', bio: 'Theatre kid turned podcaster. Fluent in sarcasm and Hindi cinema.', interests: ['Theatre', 'Podcasts', 'Bollywood'], likedUser: true, photo: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&q=80' },
  { id: '17', name: 'Aditya', age: 26, city: 'Chennai', bio: 'Filter coffee purist, Carnatic fusion guitarist, and Formula 1 fan.', interests: ['Guitar', 'F1', 'Coffee'], likedUser: false, photo: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&q=80' },
  { id: '18', name: 'Kavya', age: 22, city: 'Symbiosis Pune', bio: 'Fashion styling student who spends too much time at art galleries.', interests: ['Fashion', 'Galleries', 'Pilates'], likedUser: true, photo: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80' },
  { id: '19', name: 'Neel', age: 25, city: 'Kolkata', bio: 'Bookstore hopper, Sunday football player, and homemade tiramisu maker.', interests: ['Football', 'Baking', 'Literature'], likedUser: false, photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80' },
  { id: '20', name: 'Simran', age: 23, city: 'Chandigarh', bio: 'Road trip planner and sunset chaser. Tell me your favorite travel story.', interests: ['Road Trips', 'Sunsets', 'Photography'], likedUser: true, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80' },
  { id: '21', name: 'Pranav', age: 24, city: 'NIT Trichy', bio: 'Robotics engineer building drones and perfecting sourdough bread.', interests: ['Robotics', 'Sourdough', 'Cycling'], likedUser: false, photo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&q=80' },
  { id: '22', name: 'Aisha', age: 22, city: 'Miranda House', bio: 'Poetry slam regular, matcha latte enthusiast, and museum wanderer.', interests: ['Poetry', 'Museums', 'Tea'], likedUser: true, photo: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&q=80' },
  { id: '23', name: 'Varun', age: 27, city: 'Gurugram', bio: 'Financial analyst by week, amateur mixologist and host by weekend.', interests: ['Mixology', 'Hosting', 'Golf'], likedUser: false, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80' },
  { id: '24', name: 'Myra', age: 21, city: 'FLAME University', bio: 'Psychology major fascinated by dreams, indie films, and thrift flips.', interests: ['Psychology', 'Indie Films', 'DIY'], likedUser: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
  { id: '25', name: 'Yash', age: 25, city: 'Ahmedabad', bio: 'NID grad designing furniture and hunting for the crispiest dosas.', interests: ['Design', 'Food', 'Sketching'], likedUser: false, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { id: '26', name: 'Zoya', age: 23, city: 'St. Xaviers Mumbai', bio: 'Film editor who cries at Pixar movies and loves rainy Marine Drive walks.', interests: ['Editing', 'Pixar', 'Monsoons'], likedUser: true, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80' },
  { id: '27', name: 'Harsh', age: 24, city: 'VIT Vellore', bio: 'Cloud engineer, badminton player, and collector of weird hot sauces.', interests: ['Badminton', 'Hot Sauce', 'Tech'], likedUser: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80' },
  { id: '28', name: 'Kiara', age: 22, city: 'Jadavpur University', bio: 'Comparative lit student, acoustic singer, and late-night ramen chef.', interests: ['Singing', 'Ramen', 'Writing'], likedUser: true, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80' },
  { id: '29', name: 'Nikhil', age: 26, city: 'Jaipur', bio: 'Heritage hotel restorer and vintage motorcycle rider.', interests: ['Motorcycles', 'History', 'Architecture'], likedUser: false, photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80' },
  { id: '30', name: 'Suhana', age: 23, city: 'Delhi University', bio: 'Law student fueled by iced americanos and spontaneous weekend trips.', interests: ['Travel', 'Coffee', 'Debate'], likedUser: true, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80' }
];

export function readDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      profiles: SEED_PROFILES,
      swipes: [],
      matches: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

export function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

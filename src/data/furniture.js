export const FURNITURE_CATALOG = [
  // ── Living Room ────────────────────────────────────────────────────────────
  { type: 'sofa',              label: 'Sofa',                category: 'living',   width: 2.4,  depth: 1.0,  height: 0.90, color: '#5a6e8a', icon: '🛋️' },
  { type: 'loveseat',          label: 'Loveseat',             category: 'living',   width: 1.6,  depth: 0.9,  height: 0.85, color: '#6b7a8d', icon: '🛋️' },
  { type: 'sectional',         label: 'Sectional Sofa',       category: 'living',   width: 3.2,  depth: 2.0,  height: 0.90, color: '#5a6e8a', icon: '🛋️' },
  { type: 'armchair',          label: 'Armchair',             category: 'living',   width: 0.85, depth: 0.85, height: 0.90, color: '#7a6b5a', icon: '🪑' },
  { type: 'recliner',          label: 'Recliner',             category: 'living',   width: 0.95, depth: 1.0,  height: 1.0,  color: '#6b5a4a', icon: '🪑' },
  { type: 'coffee_table',      label: 'Coffee Table',         category: 'living',   width: 1.2,  depth: 0.6,  height: 0.45, color: '#5c4a32', icon: '🪵' },
  { type: 'side_table',        label: 'Side Table',           category: 'living',   width: 0.5,  depth: 0.5,  height: 0.55, color: '#5c4a32', icon: '🪵' },
  { type: 'console_table',     label: 'Console Table',        category: 'living',   width: 1.2,  depth: 0.35, height: 0.80, color: '#6b5a4a', icon: '🪵' },
  { type: 'tv_unit',           label: 'TV Unit',              category: 'living',   width: 1.8,  depth: 0.45, height: 0.55, color: '#2a2a2a', icon: '📺' },
  { type: 'entertainment',     label: 'Entertainment Center', category: 'living',   width: 2.4,  depth: 0.5,  height: 2.0,  color: '#2a2a2a', icon: '📺' },
  { type: 'bookshelf',         label: 'Bookshelf',            category: 'living',   width: 0.9,  depth: 0.3,  height: 2.1,  color: '#6b5e4e', icon: '📚' },
  { type: 'floor_lamp',        label: 'Floor Lamp',           category: 'living',   width: 0.4,  depth: 0.4,  height: 1.6,  color: '#c8a840', icon: '💡' },
  { type: 'table_lamp',        label: 'Table Lamp',           category: 'living',   width: 0.3,  depth: 0.3,  height: 0.5,  color: '#c8a840', icon: '💡' },
  { type: 'rug_large',         label: 'Area Rug (Large)',     category: 'living',   width: 3.0,  depth: 2.0,  height: 0.02, color: '#7a5a8a', icon: '🎨' },
  { type: 'rug_small',         label: 'Area Rug (Small)',     category: 'living',   width: 1.5,  depth: 1.0,  height: 0.02, color: '#8a5a5a', icon: '🎨' },
  { type: 'plant_large',       label: 'Large Plant',          category: 'living',   width: 0.6,  depth: 0.6,  height: 1.5,  color: '#2d7a2d', icon: '🌿' },
  { type: 'plant_small',       label: 'Small Plant',          category: 'living',   width: 0.3,  depth: 0.3,  height: 0.5,  color: '#3a8a3a', icon: '🌿' },
  { type: 'fireplace',         label: 'Fireplace',            category: 'living',   width: 1.4,  depth: 0.5,  height: 1.1,  color: '#5a5050', icon: '🔥' },

  // ── Bedroom ────────────────────────────────────────────────────────────────
  { type: 'bed_king',          label: 'King Bed',             category: 'bedroom',  width: 2.0,  depth: 2.2,  height: 0.60, color: '#8b7355', icon: '🛏️' },
  { type: 'bed_queen',         label: 'Queen Bed',            category: 'bedroom',  width: 1.6,  depth: 2.0,  height: 0.60, color: '#9b8465', icon: '🛏️' },
  { type: 'bed_twin',          label: 'Twin Bed',             category: 'bedroom',  width: 1.0,  depth: 2.0,  height: 0.55, color: '#a08070', icon: '🛏️' },
  { type: 'bunk_bed',          label: 'Bunk Bed',             category: 'bedroom',  width: 1.0,  depth: 2.0,  height: 1.8,  color: '#5c4a32', icon: '🛏️' },
  { type: 'crib',              label: 'Baby Crib',            category: 'bedroom',  width: 0.75, depth: 1.35, height: 0.95, color: '#e8ddd0', icon: '🛏️' },
  { type: 'wardrobe',          label: 'Wardrobe',             category: 'bedroom',  width: 1.8,  depth: 0.6,  height: 2.2,  color: '#4a3f35', icon: '👔' },
  { type: 'dresser',           label: 'Dresser',              category: 'bedroom',  width: 1.1,  depth: 0.5,  height: 0.85, color: '#6b5a4a', icon: '🗄️' },
  { type: 'nightstand',        label: 'Nightstand',           category: 'bedroom',  width: 0.5,  depth: 0.45, height: 0.60, color: '#6b5a4a', icon: '🕯️' },
  { type: 'vanity',            label: 'Vanity / Makeup',      category: 'bedroom',  width: 1.0,  depth: 0.5,  height: 1.5,  color: '#8a7a6a', icon: '🪞' },
  { type: 'bench',             label: 'Bedroom Bench',        category: 'bedroom',  width: 1.2,  depth: 0.4,  height: 0.50, color: '#6b5a4a', icon: '🪑' },
  { type: 'floor_mirror',      label: 'Floor Mirror',         category: 'bedroom',  width: 0.6,  depth: 0.1,  height: 1.8,  color: '#c8c0a8', icon: '🪞' },
  { type: 'changing_table',    label: 'Changing Table',       category: 'bedroom',  width: 1.0,  depth: 0.55, height: 1.0,  color: '#e8e0d0', icon: '🪑' },

  // ── Kitchen ────────────────────────────────────────────────────────────────
  { type: 'island',            label: 'Kitchen Island',       category: 'kitchen',  width: 1.5,  depth: 0.9,  height: 0.90, color: '#5c5048', icon: '🍳' },
  { type: 'kitchen_counter',   label: 'Kitchen Counter',      category: 'kitchen',  width: 2.4,  depth: 0.6,  height: 0.90, color: '#7a7060', icon: '🍳' },
  { type: 'fridge',            label: 'Refrigerator',         category: 'kitchen',  width: 0.8,  depth: 0.7,  height: 1.80, color: '#d0d0d0', icon: '🧊' },
  { type: 'fridge_french',     label: 'French Door Fridge',   category: 'kitchen',  width: 0.9,  depth: 0.75, height: 1.80, color: '#e0e0e0', icon: '🧊' },
  { type: 'stove',             label: 'Stove / Oven',         category: 'kitchen',  width: 0.75, depth: 0.65, height: 0.90, color: '#333333', icon: '🔥' },
  { type: 'sink_kitchen',      label: 'Kitchen Sink',         category: 'kitchen',  width: 0.8,  depth: 0.55, height: 0.90, color: '#b0b8c0', icon: '🚿' },
  { type: 'microwave',         label: 'Microwave',            category: 'kitchen',  width: 0.55, depth: 0.4,  height: 0.32, color: '#2a2a2a', icon: '📟' },
  { type: 'dishwasher',        label: 'Dishwasher',           category: 'kitchen',  width: 0.6,  depth: 0.6,  height: 0.90, color: '#c8c8c8', icon: '🍽️' },
  { type: 'dining_table',      label: 'Dining Table',         category: 'kitchen',  width: 1.8,  depth: 0.95, height: 0.75, color: '#6b5a4a', icon: '🪑' },
  { type: 'dining_table_round',label: 'Round Dining Table',   category: 'kitchen',  width: 1.2,  depth: 1.2,  height: 0.75, color: '#6b5a4a', icon: '🪑' },
  { type: 'bar_stool',         label: 'Bar Stool',            category: 'kitchen',  width: 0.4,  depth: 0.4,  height: 0.95, color: '#4a3a2a', icon: '🪑' },
  { type: 'wine_rack',         label: 'Wine Rack',            category: 'kitchen',  width: 0.6,  depth: 0.3,  height: 1.0,  color: '#6b4a3a', icon: '🍷' },
  { type: 'pantry',            label: 'Pantry Cabinet',       category: 'kitchen',  width: 0.8,  depth: 0.5,  height: 2.0,  color: '#7a6a5a', icon: '🗄️' },

  // ── Bathroom ───────────────────────────────────────────────────────────────
  { type: 'bathtub',           label: 'Bathtub',              category: 'bathroom', width: 1.7,  depth: 0.75, height: 0.55, color: '#e8e0d8', icon: '🛁' },
  { type: 'bathtub_freestand', label: 'Freestanding Tub',     category: 'bathroom', width: 1.6,  depth: 0.8,  height: 0.60, color: '#f5f0ec', icon: '🛁' },
  { type: 'toilet',            label: 'Toilet',               category: 'bathroom', width: 0.4,  depth: 0.65, height: 0.80, color: '#f0f0f0', icon: '🚽' },
  { type: 'sink_bath',         label: 'Bathroom Sink',        category: 'bathroom', width: 0.5,  depth: 0.45, height: 0.85, color: '#d8d4cc', icon: '🪥' },
  { type: 'sink_double',       label: 'Double Sink',          category: 'bathroom', width: 1.2,  depth: 0.5,  height: 0.85, color: '#d8d4cc', icon: '🪥' },
  { type: 'shower',            label: 'Shower Stall',         category: 'bathroom', width: 1.0,  depth: 1.0,  height: 2.20, color: '#c8d4d8', icon: '🚿' },
  { type: 'towel_rack',        label: 'Towel Rack',           category: 'bathroom', width: 0.6,  depth: 0.12, height: 0.80, color: '#c0c0c0', icon: '🪣' },
  { type: 'vanity_cabinet',    label: 'Vanity Cabinet',       category: 'bathroom', width: 1.2,  depth: 0.5,  height: 1.6,  color: '#d0c8bc', icon: '🪞' },
  { type: 'linen_cabinet',     label: 'Linen Cabinet',        category: 'bathroom', width: 0.6,  depth: 0.4,  height: 1.8,  color: '#d8d4cc', icon: '🗄️' },

  // ── Office ─────────────────────────────────────────────────────────────────
  { type: 'desk',              label: 'Office Desk',          category: 'office',   width: 1.5,  depth: 0.7,  height: 0.75, color: '#4a5568', icon: '💻' },
  { type: 'desk_l',            label: 'L-Shape Desk',         category: 'office',   width: 2.0,  depth: 1.5,  height: 0.75, color: '#4a5568', icon: '💻' },
  { type: 'office_chair',      label: 'Office Chair',         category: 'office',   width: 0.65, depth: 0.65, height: 1.10, color: '#2d3748', icon: '🪑' },
  { type: 'filing',            label: 'Filing Cabinet',       category: 'office',   width: 0.45, depth: 0.6,  height: 1.30, color: '#718096', icon: '🗃️' },
  { type: 'bookcase',          label: 'Bookcase',             category: 'office',   width: 1.2,  depth: 0.3,  height: 2.1,  color: '#4a4a5a', icon: '📚' },
  { type: 'whiteboard',        label: 'Whiteboard',           category: 'office',   width: 1.8,  depth: 0.08, height: 1.2,  color: '#f8f8f8', icon: '📋' },
  { type: 'conference_table',  label: 'Conference Table',     category: 'office',   width: 3.0,  depth: 1.2,  height: 0.75, color: '#5a5050', icon: '🪑' },
  { type: 'printer',           label: 'Printer',              category: 'office',   width: 0.5,  depth: 0.4,  height: 0.3,  color: '#444444', icon: '🖨️' },

  // ── Kids ───────────────────────────────────────────────────────────────────
  { type: 'bunk_bed_kids',     label: 'Kids Bunk Bed',        category: 'kids',     width: 1.0,  depth: 2.0,  height: 1.8,  color: '#e85a5a', icon: '🛏️' },
  { type: 'toy_chest',         label: 'Toy Chest',            category: 'kids',     width: 0.9,  depth: 0.5,  height: 0.5,  color: '#e8a040', icon: '🧸' },
  { type: 'study_desk_kids',   label: 'Kids Study Desk',      category: 'kids',     width: 1.0,  depth: 0.55, height: 0.65, color: '#5a8ae8', icon: '📚' },
  { type: 'bean_bag',          label: 'Bean Bag',             category: 'kids',     width: 0.9,  depth: 0.9,  height: 0.7,  color: '#e85aaa', icon: '🪑' },
  { type: 'playmat',           label: 'Play Mat',             category: 'kids',     width: 2.0,  depth: 2.0,  height: 0.02, color: '#5ae870', icon: '🎮' },
  { type: 'changing_station',  label: 'Changing Station',     category: 'kids',     width: 0.8,  depth: 0.5,  height: 1.0,  color: '#e8e0d0', icon: '🪑' },

  // ── Outdoor ────────────────────────────────────────────────────────────────
  { type: 'patio_chair',       label: 'Patio Chair',          category: 'outdoor',  width: 0.7,  depth: 0.7,  height: 0.90, color: '#a0856a', icon: '🌿' },
  { type: 'patio_sofa',        label: 'Outdoor Sofa',         category: 'outdoor',  width: 2.2,  depth: 0.9,  height: 0.85, color: '#7a6a5a', icon: '🛋️' },
  { type: 'patio_table',       label: 'Patio Table',          category: 'outdoor',  width: 1.2,  depth: 1.2,  height: 0.75, color: '#8b7355', icon: '🌿' },
  { type: 'bbq',               label: 'BBQ Grill',            category: 'outdoor',  width: 0.7,  depth: 0.55, height: 1.10, color: '#2d2d2d', icon: '🔥' },
  { type: 'fire_pit',          label: 'Fire Pit',             category: 'outdoor',  width: 1.0,  depth: 1.0,  height: 0.5,  color: '#6a5a4a', icon: '🔥' },
  { type: 'hot_tub',           label: 'Hot Tub',              category: 'outdoor',  width: 2.0,  depth: 2.0,  height: 0.85, color: '#5a7a8a', icon: '🛁' },
  { type: 'hammock',           label: 'Hammock',              category: 'outdoor',  width: 2.0,  depth: 0.8,  height: 1.0,  color: '#c8a06a', icon: '🌿' },
  { type: 'planter',           label: 'Large Planter',        category: 'outdoor',  width: 0.6,  depth: 0.6,  height: 0.7,  color: '#7a6a5a', icon: '🌿' },
  { type: 'pergola',           label: 'Pergola',              category: 'outdoor',  width: 3.0,  depth: 3.0,  height: 2.4,  color: '#c8b090', icon: '🏠' },
  { type: 'pool_lounger',      label: 'Pool Lounger',         category: 'outdoor',  width: 0.7,  depth: 1.9,  height: 0.4,  color: '#c8c080', icon: '🌞' },
  { type: 'garden_bench',      label: 'Garden Bench',         category: 'outdoor',  width: 1.5,  depth: 0.55, height: 0.85, color: '#8a7a5a', icon: '🌿' },
  { type: 'umbrella',          label: 'Patio Umbrella',       category: 'outdoor',  width: 2.4,  depth: 2.4,  height: 2.5,  color: '#e8c060', icon: '☂️' },

  // ── Luxury ─────────────────────────────────────────────────────────────────
  { type: 'grand_piano',       label: 'Grand Piano',          category: 'luxury',   width: 1.5,  depth: 2.1,  height: 1.0,  color: '#1a1a1a', icon: '🎹' },
  { type: 'billiard_table',    label: 'Billiard Table',       category: 'luxury',   width: 2.5,  depth: 1.35, height: 0.85, color: '#2d6a2d', icon: '🎱' },
  { type: 'foosball',          label: 'Foosball Table',       category: 'luxury',   width: 1.4,  depth: 0.75, height: 0.9,  color: '#8b6a2a', icon: '⚽' },
  { type: 'arcade_cabinet',    label: 'Arcade Cabinet',       category: 'luxury',   width: 0.65, depth: 0.75, height: 1.8,  color: '#1a1a2a', icon: '🕹️' },
  { type: 'wine_cellar_rack',  label: 'Wine Cellar Rack',     category: 'luxury',   width: 1.5,  depth: 0.4,  height: 2.0,  color: '#5a3a2a', icon: '🍷' },
  { type: 'sauna',             label: 'Sauna Bench',          category: 'luxury',   width: 2.0,  depth: 0.55, height: 1.0,  color: '#8a6a4a', icon: '🧖' },
  { type: 'aquarium',          label: 'Aquarium',             category: 'luxury',   width: 1.5,  depth: 0.5,  height: 0.7,  color: '#2a5a8a', icon: '🐠' },
  { type: 'home_theater_seat', label: 'Theater Seat',         category: 'luxury',   width: 0.75, depth: 0.9,  height: 1.0,  color: '#3a1a1a', icon: '🎬' },

  // ── Gym ────────────────────────────────────────────────────────────────────
  { type: 'treadmill',         label: 'Treadmill',            category: 'gym',      width: 0.85, depth: 1.8,  height: 1.4,  color: '#2a2a3a', icon: '🏃' },
  { type: 'exercise_bike',     label: 'Exercise Bike',        category: 'gym',      width: 0.55, depth: 1.0,  height: 1.2,  color: '#3a3a4a', icon: '🚴' },
  { type: 'weight_bench',      label: 'Weight Bench',         category: 'gym',      width: 0.5,  depth: 1.5,  height: 0.5,  color: '#2a2a2a', icon: '🏋️' },
  { type: 'rowing_machine',    label: 'Rowing Machine',       category: 'gym',      width: 0.55, depth: 2.0,  height: 0.5,  color: '#3a2a2a', icon: '🚣' },
  { type: 'weights_rack',      label: 'Weights Rack',         category: 'gym',      width: 1.2,  depth: 0.5,  height: 1.5,  color: '#2a2a2a', icon: '🏋️' },
  { type: 'yoga_mat',          label: 'Yoga Mat',             category: 'gym',      width: 0.6,  depth: 1.8,  height: 0.02, color: '#5a8a5a', icon: '🧘' },
  { type: 'punching_bag',      label: 'Punching Bag',         category: 'gym',      width: 0.4,  depth: 0.4,  height: 1.2,  color: '#8a2a2a', icon: '🥊' },

  // ── Garage ─────────────────────────────────────────────────────────────────
  { type: 'car_sedan',         label: 'Sedan',                category: 'garage',   width: 1.85, depth: 4.5,  height: 1.45, color: '#6a7a8a', icon: '🚗' },
  { type: 'car_suv',           label: 'SUV',                  category: 'garage',   width: 2.0,  depth: 4.8,  height: 1.7,  color: '#4a5a6a', icon: '🚙' },
  { type: 'workbench',         label: 'Workbench',            category: 'garage',   width: 2.0,  depth: 0.6,  height: 0.9,  color: '#5a4a30', icon: '🔧' },
  { type: 'tool_cabinet',      label: 'Tool Cabinet',         category: 'garage',   width: 0.75, depth: 0.45, height: 1.8,  color: '#c0501a', icon: '🔧' },
  { type: 'shelving_unit',     label: 'Shelving Unit',        category: 'garage',   width: 1.2,  depth: 0.4,  height: 2.0,  color: '#6a6a7a', icon: '🗄️' },
  { type: 'bicycle',           label: 'Bicycle',              category: 'garage',   width: 0.55, depth: 1.7,  height: 1.1,  color: '#3a6a3a', icon: '🚲' },
];

export const FURNITURE_CATEGORIES = [
  'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'kids', 'outdoor', 'luxury', 'gym', 'garage'
];

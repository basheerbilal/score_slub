/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, Player, Match, Product, Feedback, Order, FifaMoment } from './types';

export const initialTeams: Team[] = [
  {
    id: 1,
    name: "Elysian FC",
    logo_url: "🟢",
    stadium: "Elysian Arena",
    founded_year: 1899,
    coach: "Arthur Pendragon"
  },
  {
    id: 2,
    name: "Titan United",
    logo_url: "🔴",
    stadium: "Colossus Dome",
    founded_year: 1912,
    coach: "Helen Troy"
  },
  {
    id: 3,
    name: "Meridian City",
    logo_url: "🔵",
    stadium: "Apex Ground",
    founded_year: 1945,
    coach: "Sarah Connor"
  },
  {
    id: 4,
    name: "Vortex Rangers",
    logo_url: "🟡",
    stadium: "Cyclone Park",
    founded_year: 1968,
    coach: "Marcus Aurelius"
  }
];

export const initialPlayers: Player[] = [
  {
    id: 1,
    team_id: 1,
    name: "Lionel Messi",
    jersey_number: 10,
    position: "Forward",
    nationality: "Argentina",
    goals: 28,
    assists: 14,
    image_url: "/messi.jpg"
  },
  {
    id: 2,
    team_id: 1,
    name: "Cristiano Ronaldo",
    jersey_number: 7,
    position: "Forward",
    nationality: "Portugal",
    goals: 32,
    assists: 8,
    image_url: "/ronaldo.jpg"
  },
  {
    id: 3,
    team_id: 1,
    name: "Jude Bellingham",
    jersey_number: 5,
    position: "Midfielder",
    nationality: "England",
    goals: 20,
    assists: 12,
    image_url: "/bellingham.jpg"
  },
  {
    id: 4,
    team_id: 1,
    name: "Alisson Becker",
    jersey_number: 1,
    position: "Goalkeeper",
    nationality: "Brazil",
    goals: 0,
    assists: 0,
    image_url: "/alisson.jpg"
  },
  {
    id: 5,
    team_id: 1,
    name: "Kylian Mbappé",
    jersey_number: 9,
    position: "Forward",
    nationality: "France",
    goals: 29,
    assists: 10,
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=85&crop=faces"
  },
  {
    id: 6,
    team_id: 1,
    name: "Kevin De Bruyne",
    jersey_number: 17,
    position: "Midfielder",
    nationality: "Belgium",
    goals: 8,
    assists: 22,
    image_url: "/debruyne.jpg"
  },
  {
    id: 7,
    team_id: 2,
    name: "Erling Haaland",
    jersey_number: 9,
    position: "Forward",
    nationality: "Norway",
    goals: 38,
    assists: 6,
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=85&crop=entropy"
  },
  {
    id: 8,
    team_id: 2,
    name: "Virgil van Dijk",
    jersey_number: 4,
    position: "Defender",
    nationality: "Netherlands",
    goals: 5,
    assists: 3,
    image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=85&crop=faces"
  }
];

export const initialMatches: Match[] = [
  {
    id: 1,
    home_team_id: 1,
    away_team_id: 2,
    home_team_score: 3,
    away_team_score: 2,
    match_date: "2026-07-10T19:30:00Z",
    status: "completed",
    stadium: "Elysian Arena",
    competition: "Elysian Super League"
  },
  {
    id: 2,
    home_team_id: 3,
    away_team_id: 1,
    home_team_score: 1,
    away_team_score: 1,
    match_date: "2026-07-13T20:00:00Z",
    status: "live",
    stadium: "Apex Ground",
    competition: "Elysian Super League"
  },
  {
    id: 3,
    home_team_id: 1,
    away_team_id: 4,
    home_team_score: 0,
    away_team_score: 0,
    match_date: "2026-07-20T18:00:00Z",
    status: "upcoming",
    stadium: "Elysian Arena",
    competition: "Elysian Super League"
  },
  {
    id: 4,
    home_team_id: 2,
    away_team_id: 3,
    home_team_score: 0,
    away_team_score: 0,
    match_date: "2026-07-25T15:00:00Z",
    status: "upcoming",
    stadium: "Colossus Dome",
    competition: "Championship Cup"
  }
];

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Elysian FC Home Jersey 2026/27",
    description: "Premium fit authentic Home Kit featuring standard gold stitching, moisture-wicking technology, and the iconic crest.",
    price: 85.00,
    image_url: "https://images.unsplash.com/photo-1580087442629-1240a406c80c?w=400&auto=format&fit=crop&q=60",
    category: "Jerseys",
    stock: 120
  },
  {
    id: 2,
    name: "Golden Goal Cleats",
    description: "Ultra-light professional cleats designed for explosive speed, firm ground traction, and pinpoint control.",
    price: 120.00,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60",
    category: "Shoes",
    stock: 45
  },
  {
    id: 3,
    name: "Elysian FC Training Vest",
    description: "Breathable mesh construction training bib perfect for squad scrimmages and conditioning exercises.",
    price: 30.00,
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=60",
    category: "Equipment",
    stock: 80
  },
  {
    id: 4,
    name: "Pro Elite Soccer Ball",
    description: "FIFA Quality Pro certified soccer ball with aerodynamically textured surface and seamless thermal bonding.",
    price: 35.00,
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60",
    category: "Equipment",
    stock: 150
  },
  {
    id: 5,
    name: "Elysian Club Knitted Scarf",
    description: "Warm acrylic scarf in classical forest-green and gold knit patterns, complete with fringed ends.",
    price: 20.00,
    image_url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&auto=format&fit=crop&q=60",
    category: "Accessories",
    stock: 200
  },
  {
    id: 6,
    name: "Elysian Vintage Club Cap",
    description: "Classic 6-panel adjustable cotton cap featuring custom-embroidered retro Elysian gold lettering.",
    price: 25.00,
    image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=60",
    category: "Accessories",
    stock: 95
  },
  {
    id: 7,
    name: "Elysian FC Away Jersey 2026/27",
    description: "Elegant modern white Away kit with gold-weave side panels and embroidered crest.",
    price: 85.00,
    image_url: "https://images.unsplash.com/photo-1577223625856-74322a40743b?w=400&auto=format&fit=crop&q=60",
    category: "Jerseys",
    stock: 100
  },
  {
    id: 8,
    name: "Elysian FC Storm Goalkeeper Kit",
    description: "Dynamic electric pattern professional fit keeper kit with reinforced elbow padding.",
    price: 90.00,
    image_url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400&auto=format&fit=crop&q=60",
    category: "Jerseys",
    stock: 40
  },
  {
    id: 9,
    name: "Precision Turf Trainer Shoes",
    description: "Rubber turf studded sole with flexible mesh build for extreme comfort on all hard artificial surfaces.",
    price: 95.00,
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&auto=format&fit=crop&q=60",
    category: "Shoes",
    stock: 65
  },
  {
    id: 10,
    name: "Tactical Training Agility Cones",
    description: "Set of 20 highly-visible orange and green disc cones with convenient carrying strap.",
    price: 18.00,
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop&q=60",
    category: "Equipment",
    stock: 120
  },
  {
    id: 11,
    name: "Elysian FC Premium Duffel Bag",
    description: "Waterproof, custom compartment athletic gear bag with embroidered shield print.",
    price: 48.00,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=60",
    category: "Accessories",
    stock: 75
  },
  {
    id: 12,
    name: "Insulated Stainless Steel Flask",
    description: "Double-walled vacuum insulated water bottle keeping your supplements cold for up to 24 hours.",
    price: 22.00,
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=60",
    category: "Accessories",
    stock: 140
  },
  {
    id: 13,
    name: "Gold Shield Captain Armband",
    description: "Heavy-duty elastic armband styled in bold gold and dark green, standard fit with secure closure.",
    price: 12.00,
    image_url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=60",
    category: "Accessories",
    stock: 300
  },
  {
    id: 14,
    name: "Pro-Armor Shin Guards",
    description: "Aerodynamic lightweight shell guards with high-density EVA foam backing for stellar protection.",
    price: 28.00,
    image_url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&auto=format&fit=crop&q=60",
    category: "Equipment",
    stock: 85
  },
  {
    id: 15,
    name: "Official Fleece Warm-Up Hoodie",
    description: "Ultra-comfy athletic fleece hoodie with custom stitched gold emblems and tailored fit.",
    price: 65.00,
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=60",
    category: "Jerseys",
    stock: 55
  }
];

export const initialFeedback: Feedback[] = [
  {
    id: 1,
    name: "Johnathan Doe",
    email: "john.doe@example.com",
    subject: "Exceptional Jersey Quality!",
    message: "The Elysian Home Jersey arrived yesterday. The gold stitching is absolute luxury and the fit is perfect for athletic builds. Best purchase of the season!",
    rating: 5,
    created_at: "2026-07-11T14:32:00Z"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    subject: "Awesome Matches Dashboard",
    message: "Loving the new website matches dashboard. It makes tracking upcoming games so easy. Can we add a filter for friendly games in the future?",
    rating: 4,
    created_at: "2026-07-12T09:15:00Z"
  }
];

export const initialOrders: Order[] = [
  {
    id: 1001,
    user_id: 2,
    customer_name: "Customer User",
    customer_email: "customer@example.com",
    total_amount: 105.00,
    status: "completed",
    created_at: "2026-07-12T16:45:00Z",
    items: [
      {
        id: 1,
        order_id: 1001,
        product_id: 1,
        product_name: "Elysian FC Home Jersey 2026/27",
        quantity: 1,
        price: 85.00
      },
      {
        id: 2,
        order_id: 1001,
        product_id: 5,
        product_name: "Elysian Club Knitted Scarf",
        quantity: 1,
        price: 20.00
      }
    ]
  }
];

export const initialFifaMoments: FifaMoment[] = [
  // ── Top Moments ──────────────────────────────────────────
  {
    id: 1,
    name: "Oyarzabal Final Goal",
    country: "ES 🇪🇸",
    img: "/moment_esp_player.jpg",
    type: "top",
    video_url: "https://www.youtube.com/embed/hzwFBCXbPuQ?autoplay=1&rel=0"
  },
  {
    id: 2,
    name: "Bellingham Overhead Kick",
    country: "ENG 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    img: "/bellingham.jpg",
    type: "top",
    video_url: "https://www.youtube.com/embed/hzwFBCXbPuQ?autoplay=1&rel=0"
  },
  {
    id: 3,
    name: "Messi Free Kick Goal",
    country: "AR 🇦🇷",
    img: "/messi.jpg",
    type: "top",
    video_url: "https://www.youtube.com/embed/t5dFH4EAKsU?autoplay=1&rel=0"
  },
  {
    id: 4,
    name: "Ronaldo Hat-Trick",
    country: "PT 🇵🇹",
    img: "/ronaldo.jpg",
    type: "top",
    video_url: "https://www.youtube.com/embed/hzwFBCXbPuQ?autoplay=1&rel=0"
  },
  {
    id: 5,
    name: "De Bruyne Long Range",
    country: "BE 🇧🇪",
    img: "/debruyne.jpg",
    type: "top",
    video_url: "https://www.youtube.com/embed/hzwFBCXbPuQ?autoplay=1&rel=0"
  },

  // ── Celebrations ─────────────────────────────────────────
  {
    id: 6,
    name: "Argentina Trophy Lift",
    country: "AR 🇦🇷",
    img: "/moment_arg_victory.jpg",
    type: "celebration",
    video_url: "https://www.youtube.com/embed/t5dFH4EAKsU?autoplay=1&rel=0"
  },
  {
    id: 7,
    name: "Spain Champions Dance",
    country: "ES 🇪🇸",
    img: "/moment_esp_player.jpg",
    type: "celebration",
    video_url: "https://www.youtube.com/embed/hzwFBCXbPuQ?autoplay=1&rel=0"
  },
  {
    id: 8,
    name: "Messi Lifting the Trophy",
    country: "AR 🇦🇷",
    img: "/moment_arg_player.jpg",
    type: "celebration",
    video_url: "https://www.youtube.com/embed/t5dFH4EAKsU?autoplay=1&rel=0"
  },
  {
    id: 9,
    name: "Mac Allister Squad Celebration",
    country: "AR 🇦🇷",
    img: "/moment_arg_player.jpg",
    type: "celebration",
    video_url: "https://www.youtube.com/embed/t5dFH4EAKsU?autoplay=1&rel=0"
  },
  {
    id: 10,
    name: "World Cup Final Confetti",
    country: "AR 🇦🇷",
    img: "/moment_arg_victory.jpg",
    type: "celebration",
    video_url: "https://www.youtube.com/embed/t5dFH4EAKsU?autoplay=1&rel=0"
  }
];

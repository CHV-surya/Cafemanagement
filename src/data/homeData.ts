import { Leaf, ChefHat, Flame, Clock } from 'lucide-react'
import React from 'react'

export interface HighlightItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export interface FeaturedDish {
  id: string
  name: string
  category: string
  price: number
  description: string
  imageUrl: string
  badgeText?: string
}

export const HERO_DATA = {
  heading: "A Culinary Experience Worth Sharing",
  description: "Delicious food, cozy ambience, and unforgettable moments.",
  bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&auto=format&fit=crop&q=85",
  rating: "4.9 / 5 Guest Satisfaction",
  reviewCount: "Over 2,500 Happy Diners",
}

export const HIGHLIGHTS_DATA: HighlightItem[] = [
  {
    id: 'highlight-fresh',
    title: 'Fresh Ingredients',
    description: 'Locally sourced farm produce, pure dairy, and fragrant spices handpicked every single morning.',
    icon: Leaf,
  },
  {
    id: 'highlight-chef',
    title: "Chef's Specials",
    description: 'Masterfully crafted recipes curated by executive chefs bringing timeless culinary techniques.',
    icon: ChefHat,
  },
  {
    id: 'highlight-ambience',
    title: 'Cozy Ambience',
    description: 'Warm mood lighting, plush seating, and an enchanting dining atmosphere perfect for intimate moments.',
    icon: Flame,
  },
  {
    id: 'highlight-service',
    title: 'Quick Service',
    description: 'Seamless digital order dispatch and attentive table hosts ensuring your meal arrives hot and prompt.',
    icon: Clock,
  },
]

export const FEATURED_DISHES_DATA: FeaturedDish[] = [
  {
    id: 'dish-paneer-tikka',
    name: 'Paneer Tikka',
    category: 'Tandoor & Starters',
    price: 340,
    description: 'Charred cottage cheese cubes marinated in Kashmiri chili, hung curd, and stone-ground spices roasted in traditional clay oven.',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
    badgeText: 'Bestseller',
  },
  {
    id: 'dish-chicken-biryani',
    name: 'Chicken Biryani',
    category: 'Biryani & Rice',
    price: 460,
    description: 'Aromatic long-grain basmati rice layered with succulent spiced chicken cuts, saffron broth, and slow-cooked under sealed dum.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    badgeText: "Chef's Special",
  },
  {
    id: 'dish-margherita-pizza',
    name: 'Margherita Pizza',
    category: 'Wood-Fired Pizza',
    price: 390,
    description: 'Hand-stretched sourdough crust fired with sweet San Marzano tomato sauce, fresh buffalo mozzarella, and aromatic basil leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
    badgeText: 'Classic',
  },
  {
    id: 'dish-veg-burger',
    name: 'Veg Burger',
    category: 'Gourmet Burgers',
    price: 280,
    description: 'Crispy herb potato and garden vegetable patty stacked with smoked cheddar, caramelized onions, crisp lettuce, and truffle mayo.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'dish-creamy-pasta',
    name: 'Creamy Pasta',
    category: 'Italian Pasta',
    price: 380,
    description: 'Al dente fettuccine ribbons bathed in rich velvety garlic parmesan alfredo sauce, cracked peppercorns, and wild herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=800&auto=format&fit=crop&q=80',
    badgeText: 'Popular',
  },
  {
    id: 'dish-chocolate-brownie',
    name: 'Chocolate Brownie',
    category: 'Artisanal Desserts',
    price: 240,
    description: 'Decadent warm Belgian dark chocolate fudge brownie drenched in hot cocoa fudge sauce, served with vanilla bean gelato.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    badgeText: 'Sweet Treat',
  },
]

export const SPECIAL_OFFER_DATA = {
  badge: "Limited Time Promotion",
  heading: "Make Your Dining Moments Special",
  subtitle: "Gather with family or celebrate an intimate milestone. Enjoy 20% off all dining reservations of 4 or more guests, plus a complimentary dessert platter.",
  promoCode: "BISTRO20",
  terms: "Valid on all online reservations for lunch & dinner bookings. Valid through Sunday.",
  bgImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=80",
}

export const ABOUT_PREVIEW_DATA = {
  badge: "About BistroHub",
  heading: "A Heritage of Flavor & Hospitality",
  description: "At BistroHub, dining is more than a meal—it is a warm celebration of fine ingredients and genuine connection. From our signature wood-fired ovens and clay tandoor grills to our cozy candlelit corners, we have crafted a space where every guest feels at home.",
  storyPoint1: "Fresh locally harvested produce delivered each dawn.",
  storyPoint2: "Recipes refined over decades with love and artisan precision.",
  storyPoint3: "A welcoming, relaxed ambience designed for lively conversations.",
  imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
}

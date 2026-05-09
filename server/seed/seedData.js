import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Brand from '../models/Brand.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';

dotenv.config();

const brands = [
  {
    name: 'Toyota',
    logoUrl: 'https://www.freepnglogos.com/uploads/toyota-logo-png/toyota-logo-emblems-logos-0.png',
    description: 'Japanese reliability meets innovation.',
    foundedYear: 1937,
    country: 'Japan',
    isFeatured: true,
    popularity: 95
  },
  {
    name: 'Honda',
    logoUrl: 'https://www.freepnglogos.com/uploads/honda-logo-png/honda-logo-emblems-logos-0.png',
    description: 'The power of dreams.',
    foundedYear: 1948,
    country: 'Japan',
    isFeatured: true,
    popularity: 92
  },
  {
    name: 'BMW',
    logoUrl: 'https://www.freepnglogos.com/uploads/bmw-logo-png/bmw-logo-emblems-logos-0.png',
    description: 'The ultimate driving machine.',
    foundedYear: 1916,
    country: 'Germany',
    isFeatured: true,
    popularity: 98
  },
  {
    name: 'Mercedes-Benz',
    logoUrl: 'https://www.freepnglogos.com/uploads/mercedes-benz-logo-png/mercedes-benz-logo-emblems-logos-0.png',
    description: 'The best or nothing.',
    foundedYear: 1926,
    country: 'Germany',
    isFeatured: true,
    popularity: 97
  },
  {
    name: 'Audi',
    logoUrl: 'https://www.freepnglogos.com/uploads/audi-logo-png/audi-logo-emblems-logos-0.png',
    description: 'Vorsprung durch Technik.',
    foundedYear: 1909,
    country: 'Germany',
    isFeatured: true,
    popularity: 93
  },
  {
    name: 'Tesla',
    logoUrl: 'https://www.freepnglogos.com/uploads/tesla-logo-png/tesla-logo-emblems-logos-0.png',
    description: 'Electric innovation.',
    foundedYear: 2003,
    country: 'USA',
    isFeatured: true,
    popularity: 96
  },
  {
    name: 'Porsche',
    logoUrl: 'https://www.freepnglogos.com/uploads/porsche-logo-png/porsche-logo-emblems-logos-0.png',
    description: 'Sports car perfection.',
    foundedYear: 1931,
    country: 'Germany',
    isFeatured: true,
    popularity: 94
  },
  {
    name: 'Lamborghini',
    logoUrl: 'https://www.freepnglogos.com/uploads/lamborghini-logo-png/lamborghini-logo-emblems-logos-0.png',
    description: 'Italian exotic supercars.',
    foundedYear: 1963,
    country: 'Italy',
    isFeatured: true,
    popularity: 99
  }
];

const getCarsData = (brandIds) => [
  {
    brandId: brandIds[0],
    modelName: 'Supra 2026',
    year: 2026,
    price: 55000,
    horsepower: 382,
    acceleration: '3.9s',
    topSpeed: '155 mph',
    engine: '3.0L Twin-Turbo I6',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Leather Seats', 'Navigation', 'Premium Sound']
  },
  {
    brandId: brandIds[1],
    modelName: 'Civic Type R',
    year: 2025,
    price: 44000,
    horsepower: 315,
    acceleration: '4.9s',
    topSpeed: '169 mph',
    engine: '2.0L Turbo I4',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Sport Seats', 'Apple CarPlay', 'Brembo Brakes']
  },
  {
    brandId: brandIds[2],
    modelName: 'M3 Competition',
    year: 2025,
    price: 76000,
    horsepower: 503,
    acceleration: '3.4s',
    topSpeed: '180 mph',
    engine: '3.0L Twin-Turbo I6',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Carbon Fiber Roof', 'M Sport Seats', 'Laser Lights']
  },
  {
    brandId: brandIds[3],
    modelName: 'AMG C63',
    year: 2025,
    price: 82000,
    horsepower: 503,
    acceleration: '3.7s',
    topSpeed: '174 mph',
    engine: '4.0L V8 Biturbo',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['AMG Performance Seats', 'Burmester Sound', 'Panoramic Roof']
  },
  {
    brandId: brandIds[4],
    modelName: 'RS7',
    year: 2025,
    price: 118000,
    horsepower: 591,
    acceleration: '3.3s',
    topSpeed: '190 mph',
    engine: '4.0L V8',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Matrix LED Lights', 'Valcona Leather', 'Bang & Olufsen']
  },
  {
    brandId: brandIds[5],
    modelName: 'Model S Plaid',
    year: 2025,
    price: 90000,
    horsepower: 1020,
    acceleration: '1.99s',
    topSpeed: '200 mph',
    engine: 'Tri-Motor Electric',
    imageUrl: 'https://images.unsplash.com/photo-1617886903359-93f90f1b7aed?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Yoke Steering Wheel', '17" Display', 'Glass Roof']
  },
  {
    brandId: brandIds[6],
    modelName: '911 GT3',
    year: 2025,
    price: 169000,
    horsepower: 502,
    acceleration: '3.2s',
    topSpeed: '197 mph',
    engine: '4.0L Flat-6',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Carbon Ceramic Brakes', 'Rear Axle Steering', 'Sport Chrono']
  },
  {
    brandId: brandIds[7],
    modelName: 'Revuelto',
    year: 2025,
    price: 600000,
    horsepower: 1001,
    acceleration: '2.5s',
    topSpeed: '217 mph',
    engine: '6.5L V12 Hybrid',
    imageUrl: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=500',
    isNewRelease: true,
    isFeatured: true,
    features: ['Scissor Doors', 'Carbon Fiber Monocoque', '13-inch Display']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Brand.deleteMany({});
    await Car.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️ Cleared existing data');

    await User.create({
      username: 'admin',
      email: 'admin@carside.in',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'admin',
      emailVerified: true,
      isActive: true
    });
    console.log('👑 Admin user created');

    await User.create({
      username: 'demouser',
      email: 'demo@carside.in',
      password: 'demo123',
      fullName: 'Demo User',
      role: 'user',
      emailVerified: true,
      isActive: true
    });
    console.log('👤 Demo user created');

    const insertedBrands = await Brand.insertMany(brands);
    console.log(`🏭 Inserted ${insertedBrands.length} brands`);

    const brandIds = insertedBrands.map(b => b._id);
    const carsData = getCarsData(brandIds);
    const insertedCars = await Car.insertMany(carsData);
    console.log(`🚗 Inserted ${insertedCars.length} cars`);

    const demoUser = await User.findOne({ email: 'demo@carside.in' });
    await Booking.create({
      userId: demoUser._id,
      carId: insertedCars[0]._id,
      testDriveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'confirmed',
      message: 'Excited to test drive the Supra!'
    });
    console.log('📅 Sample booking created');

    console.log('\n✅ Database seeded successfully!');
    console.log('=================================');
    console.log('👑 Admin Login:');
    console.log('   Email: admin@carside.in');
    console.log('   Password: admin123');
    console.log('\n👤 Demo User Login:');
    console.log('   Email: demo@carside.in');
    console.log('   Password: demo123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
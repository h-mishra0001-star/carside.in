import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Brand from './models/Brand.js';
import Car from './models/Car.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const brands = [
  { name: 'Toyota', logoUrl: 'https://www.freepnglogos.com/uploads/toyota-logo-png/toyota-logo-emblems-logos-0.png', description: 'Japanese reliability meets innovation', foundedYear: 1937, country: 'Japan', isFeatured: true, popularity: 95 },
  { name: 'Honda', logoUrl: 'https://www.freepnglogos.com/uploads/honda-logo-png/honda-logo-emblems-logos-0.png', description: 'The power of dreams', foundedYear: 1948, country: 'Japan', isFeatured: true, popularity: 92 },
  { name: 'BMW', logoUrl: 'https://www.freepnglogos.com/uploads/bmw-logo-png/bmw-logo-emblems-logos-0.png', description: 'Ultimate driving machine', foundedYear: 1916, country: 'Germany', isFeatured: true, popularity: 98 },
  { name: 'Mercedes-Benz', logoUrl: 'https://www.freepnglogos.com/uploads/mercedes-benz-logo-png/mercedes-benz-logo-emblems-logos-0.png', description: 'The best or nothing', foundedYear: 1926, country: 'Germany', isFeatured: true, popularity: 97 },
  { name: 'Audi', logoUrl: 'https://www.freepnglogos.com/uploads/audi-logo-png/audi-logo-emblems-logos-0.png', description: 'Vorsprung durch Technik', foundedYear: 1909, country: 'Germany', isFeatured: true, popularity: 93 },
  { name: 'Tesla', logoUrl: 'https://www.freepnglogos.com/uploads/tesla-logo-png/tesla-logo-emblems-logos-0.png', description: 'Electric innovation', foundedYear: 2003, country: 'USA', isFeatured: true, popularity: 96 }
];

const cars = [
  { modelName: 'Supra 2026', year: 2026, price: 55000, horsepower: 382, acceleration: '3.9s', topSpeed: '155 mph', engine: '3.0L Twin-Turbo I6', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', isNewRelease: true, isFeatured: true },
  { modelName: 'Civic Type R', year: 2025, price: 44000, horsepower: 315, acceleration: '4.9s', topSpeed: '169 mph', engine: '2.0L Turbo I4', imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500', isNewRelease: true, isFeatured: true },
  { modelName: 'M3 Competition', year: 2025, price: 76000, horsepower: 503, acceleration: '3.4s', topSpeed: '180 mph', engine: '3.0L Twin-Turbo I6', imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500', isNewRelease: true, isFeatured: true },
  { modelName: 'AMG C63', year: 2025, price: 82000, horsepower: 503, acceleration: '3.7s', topSpeed: '174 mph', engine: '4.0L V8 Biturbo', imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500', isNewRelease: true, isFeatured: true },
  { modelName: 'RS7', year: 2025, price: 118000, horsepower: 591, acceleration: '3.3s', topSpeed: '190 mph', engine: '4.0L V8', imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500', isNewRelease: true, isFeatured: true },
  { modelName: 'Model S Plaid', year: 2025, price: 90000, horsepower: 1020, acceleration: '1.99s', topSpeed: '200 mph', engine: 'Tri-Motor Electric', imageUrl: 'https://images.unsplash.com/photo-1617886903359-93f90f1b7aed?w=500', isNewRelease: true, isFeatured: true }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Brand.deleteMany({});
    await Car.deleteMany({});
    console.log('🗑️ Cleared existing data');

    const insertedBrands = await Brand.insertMany(brands);
    console.log(`🏭 Inserted ${insertedBrands.length} brands`);

    const carsWithBrands = cars.map((car, index) => ({
      ...car,
      brandId: insertedBrands[index % insertedBrands.length]._id
    }));

    await Car.insertMany(carsWithBrands);
    console.log(`🚗 Inserted ${carsWithBrands.length} cars`);

    console.log('\n✅ Database seeded successfully!');
    console.log('=================================');
    console.log('Brands added:', insertedBrands.map(b => b.name).join(', '));
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
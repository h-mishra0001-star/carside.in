import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carside_db';

const carSchema = new mongoose.Schema({}, { strict: false });
const Car = mongoose.model('Car', carSchema);

async function checkCar() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const car = await Car.findOne({ id: 7222695916 });
    
    if (car) {
      console.log('\n✅ CAR DETAILS AFTER FIX:');
      console.log('=================================');
      console.log(`ID: ${car.id}`);
      console.log(`Year: ${car.year}`);
      console.log(`Manufacturer: ${car.manufacturer}`);
      console.log(`Model: ${car.model}`);
      console.log(`Model Name: ${car.modelName}`);
      console.log(`URL: ${car.url}`);
      console.log('=================================\n');
    } else {
      console.log('❌ Car not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCar();
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carside_db';

// Define schema
const carSchema = new mongoose.Schema({
  id: Number,
  url: String,
  manufacturer: String,
  model: String,
  year: Number,
  modelName: String,
  price: Number,
  region: String,
  state: String,
  isNewRelease: Boolean,
  brandId: mongoose.Schema.Types.ObjectId
}, { strict: false });

const Car = mongoose.model('Car', carSchema);

// Helper function to extract vehicle info from URL
function extractVehicleInfo(url) {
  if (!url) return null;
  
  console.log(`Extracting from URL: ${url}`);
  
  // Pattern 1: /2010-ford-ranger/
  const pattern1 = /\/(\d{4})-([a-z]+)-([a-z0-9-]+)/i;
  let match = url.match(pattern1);
  
  if (match && match[1] && match[1].match(/^\d{4}$/)) {
    return {
      year: parseInt(match[1]),
      manufacturer: match[2].charAt(0).toUpperCase() + match[2].slice(1),
      model: match[3].replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    };
  }
  
  // Pattern 2: /2010_ford_ranger/
  const pattern2 = /\/(\d{4})_([a-z]+)_([a-z0-9-_]+)/i;
  match = url.match(pattern2);
  
  if (match && match[1] && match[1].match(/^\d{4}$/)) {
    return {
      year: parseInt(match[1]),
      manufacturer: match[2].charAt(0).toUpperCase() + match[2].slice(1),
      model: match[3].replace(/_/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    };
  }
  
  // Pattern 3: ford-ranger-2010 (year at the end)
  const pattern3 = /([a-z]+)-([a-z0-9-]+)-(\d{4})/i;
  match = url.match(pattern3);
  
  if (match && match[3] && match[3].match(/^\d{4}$/)) {
    return {
      year: parseInt(match[3]),
      manufacturer: match[1].charAt(0).toUpperCase() + match[1].slice(1),
      model: match[2].replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    };
  }
  
  // Pattern 4: /cto/d/prescott-2010-ford-ranger/
  const pattern4 = /(\d{4})-([a-z]+)-([a-z0-9-]+)(?:\/|$)/i;
  match = url.match(pattern4);
  
  if (match && match[1] && match[1].match(/^\d{4}$/)) {
    return {
      year: parseInt(match[1]),
      manufacturer: match[2].charAt(0).toUpperCase() + match[2].slice(1),
      model: match[3].replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    };
  }
  
  return null;
}

async function fixCarData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`URI: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all cars with missing manufacturer or model
    const carsToFix = await Car.find({
      $or: [
        { manufacturer: { $exists: false } },
        { manufacturer: null },
        { manufacturer: '' },
        { manufacturer: 'undefined' },
        { model: { $exists: false } },
        { model: null },
        { model: '' },
        { model: 'undefined' },
        { modelName: 'Craigslist Vehicle' }
      ]
    });

    console.log(`🔍 Found ${carsToFix.length} cars that need fixing\n`);
    
    let fixedCount = 0;
    let skipCount = 0;
    let updates = [];

    for (let i = 0; i < carsToFix.length; i++) {
      const car = carsToFix[i];
      console.log(`\n[${i + 1}/${carsToFix.length}] Processing car ID: ${car.id}`);
      
      const vehicleInfo = extractVehicleInfo(car.url);
      
      if (vehicleInfo) {
        const updateData = {};
        
        // Update manufacturer if missing
        if (!car.manufacturer || car.manufacturer === 'undefined' || car.manufacturer === '') {
          updateData.manufacturer = vehicleInfo.manufacturer;
          console.log(`   ✓ Adding manufacturer: ${vehicleInfo.manufacturer}`);
        }
        
        // Update model if missing
        if (!car.model || car.model === 'undefined' || car.model === '') {
          updateData.model = vehicleInfo.model;
          console.log(`   ✓ Adding model: ${vehicleInfo.model}`);
        }
        
        // Update year if missing and we have it
        if ((!car.year || car.year === 0) && vehicleInfo.year) {
          updateData.year = vehicleInfo.year;
          console.log(`   ✓ Adding year: ${vehicleInfo.year}`);
        }
        
        // Generate proper modelName
        let newModelName = '';
        const year = updateData.year || car.year;
        const manufacturer = updateData.manufacturer || car.manufacturer;
        const model = updateData.model || car.model;
        
        if (year && manufacturer && model) {
          newModelName = `${year} ${manufacturer} ${model}`;
        } else if (manufacturer && model) {
          newModelName = `${manufacturer} ${model}`;
        } else if (manufacturer) {
          newModelName = manufacturer;
        } else if (vehicleInfo) {
          newModelName = `${vehicleInfo.year} ${vehicleInfo.manufacturer} ${vehicleInfo.model}`;
        }
        
        if (newModelName && newModelName !== 'Craigslist Vehicle') {
          updateData.modelName = newModelName;
          console.log(`   ✓ Updating modelName to: ${newModelName}`);
        }
        
        // Only update if we have changes
        if (Object.keys(updateData).length > 0) {
          updates.push({
            updateOne: {
              filter: { _id: car._id },
              update: { $set: updateData }
            }
          });
          fixedCount++;
        }
        
        // Process in batches of 50
        if (updates.length >= 50) {
          console.log(`\n📦 Saving batch of ${updates.length} updates...`);
          await Car.bulkWrite(updates);
          console.log(`✅ Saved ${updates.length} updates`);
          updates = [];
        }
        
      } else {
        skipCount++;
        console.log(`   ⚠️ Could not extract info from URL: ${car.url}`);
      }
    }
    
    // Save remaining updates
    if (updates.length > 0) {
      console.log(`\n📦 Saving final batch of ${updates.length} updates...`);
      await Car.bulkWrite(updates);
      console.log(`✅ Saved ${updates.length} updates`);
    }
    
    console.log('\n📊 FIX SUMMARY:');
    console.log('=================================');
    console.log(`Total cars processed: ${carsToFix.length}`);
    console.log(`✅ Fixed: ${fixedCount}`);
    console.log(`⚠️ Skipped (couldn't extract data): ${skipCount}`);
    console.log('=================================\n');
    
    // Show statistics after fix
    const totalCars = await Car.countDocuments();
    const stats = await Car.aggregate([
      {
        $group: {
          _id: null,
          withManufacturer: { 
            $sum: { 
              $cond: [{ $and: [
                { $ne: ['$manufacturer', null] },
                { $ne: ['$manufacturer', ''] },
                { $ne: ['$manufacturer', 'undefined'] }
              ]}, 1, 0 ]
            }
          },
          withModel: { 
            $sum: { 
              $cond: [{ $and: [
                { $ne: ['$model', null] },
                { $ne: ['$model', ''] },
                { $ne: ['$model', 'undefined'] }
              ]}, 1, 0 ]
            }
          },
          withYear: { 
            $sum: { 
              $cond: [{ $and: [
                { $ne: ['$year', null] },
                { $ne: ['$year', 0] }
              ]}, 1, 0 ]
            }
          },
          withProperName: {
            $sum: {
              $cond: [{ $ne: ['$modelName', 'Craigslist Vehicle'] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    if (stats[0]) {
      console.log('📈 DATABASE STATISTICS AFTER FIX:');
      console.log('=================================');
      console.log(`Total cars: ${totalCars}`);
      console.log(`Cars with manufacturer: ${stats[0].withManufacturer} (${Math.round(stats[0].withManufacturer/totalCars*100)}%)`);
      console.log(`Cars with model: ${stats[0].withModel} (${Math.round(stats[0].withModel/totalCars*100)}%)`);
      console.log(`Cars with year: ${stats[0].withYear} (${Math.round(stats[0].withYear/totalCars*100)}%)`);
      console.log(`Cars with proper name: ${stats[0].withProperName} (${Math.round(stats[0].withProperName/totalCars*100)}%)`);
      console.log('=================================\n');
    }
    
    // Show sample of fixed cars
    const sample = await Car.find({ 
      manufacturer: { $ne: null, $ne: '' },
      model: { $ne: null, $ne: '' }
    }).limit(5);
    
    if (sample.length > 0) {
      console.log('📝 SAMPLE FIXED CARS:');
      console.log('=================================');
      sample.forEach(car => {
        console.log(`\nID: ${car.id}`);
        console.log(`Year: ${car.year || 'N/A'}`);
        console.log(`Manufacturer: ${car.manufacturer || 'N/A'}`);
        console.log(`Model: ${car.model || 'N/A'}`);
        console.log(`Model Name: ${car.modelName || 'N/A'}`);
        console.log(`URL: ${car.url}`);
        console.log('---');
      });
    }
    
    console.log('\n✅ Fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixCarData();
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
  
  // Basic info
  id: { type: Number, unique: true, sparse: true },
  url: { type: String },
  modelName: { type: String, default: 'Unknown Vehicle', index: true },
  
  // Location fields
  region: { type: String, index: true },
  region_url: { type: String },
  county: { type: String },
  state: { type: String, index: true },
  lat: { type: Number },
  long: { type: Number },
  
  // Vehicle details
  price: { type: Number, index: true },
  year: { type: Number, index: true },
  manufacturer: { type: String, index: true },
  model: { type: String },
  condition: { type: String },
  cylinders: { type: String },
  fuel: { type: String },
  odometer: { type: Number },
  title_status: { type: String },
  transmission: { type: String },
  VIN: { type: String },
  drive: { type: String },
  size: { type: String },
  type: { type: String, index: true },
  paint_color: { type: String },
  
  // Images and description
  image_url: { type: String },
  description: { type: String },
  
  // Metadata
  posting_date: { type: Date, index: true },
  
  // App specific fields
  isNewRelease: { type: Boolean, default: false, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  horsepower: { type: Number }
}, { timestamps: true });

// Compound indexes for common queries
carSchema.index({ brandId: 1, isNewRelease: 1 });
carSchema.index({ state: 1, region: 1 });
carSchema.index({ manufacturer: 1, model: 1 });
carSchema.index({ year: -1, price: 1 });

const Car = mongoose.model('Car', carSchema);
export default Car;
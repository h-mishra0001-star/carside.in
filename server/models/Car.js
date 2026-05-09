import mongoose from 'mongoose';

const currentYear = new Date().getFullYear();

const carSchema = new mongoose.Schema(
  {
    /* =========================
       BRAND RELATION
    ========================= */
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      index: true,
    },

    /* =========================
       CSV ORIGINAL ID
    ========================= */
    id: {
      type: Number,
      unique: true,
      sparse: true,
      // ❌ removed index:true (prevents duplicate index warning)
    },

    /* =========================
       BASIC INFO
    ========================= */
    url: { type: String, trim: true, default: '' },

    modelName: {
      type: String,
      trim: true,
      default: 'Unknown Vehicle',
    },

    manufacturer: { type: String, trim: true, default: '' },

    model: { type: String, trim: true, default: '' },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },

    /* =========================
       LOCATION
    ========================= */
    region: { type: String, trim: true, default: '' },
    region_url: { type: String, trim: true, default: '' },
    county: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'USA' },

    lat: { type: Number, min: -90, max: 90, default: null },
    long: { type: Number, min: -180, max: 180, default: null },

    /* =========================
       PRICING
    ========================= */
    price: { type: Number, min: 0, default: null },

    /* =========================
       VEHICLE DETAILS
    ========================= */
    year: {
      type: Number,
      min: 1886,
      max: currentYear + 1,
      default: null,
    },

    condition: {
      type: String,
      enum: [
        'new',
        'like new',
        'excellent',
        'good',
        'fair',
        'salvage',
        null,
      ],
      default: null,
    },

    cylinders: { type: String, trim: true, default: '' },

    fuel: {
      type: String,
      enum: [
        'gas',
        'diesel',
        'electric',
        'hybrid',
        'plug-in hybrid',
        'other',
        null,
      ],
      default: null,
    },

    odometer: { type: Number, min: 0, default: null },

    title_status: {
      type: String,
      enum: [
        'clean',
        'salvage',
        'rebuilt',
        'parts only',
        'lien',
        'missing',
        null,
      ],
      default: null,
    },

    transmission: {
      type: String,
      enum: ['automatic', 'manual', 'other', null],
      default: null,
    },

    VIN: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      match: [
        /^[A-HJ-NPR-Z0-9]{17}$/,
        'Invalid VIN format',
      ],
    },

    drive: {
      type: String,
      enum: ['fwd', 'rwd', 'awd', '4wd', null],
      default: null,
    },

    size: {
      type: String,
      enum: [
        'compact',
        'midsize',
        'full-size',
        'sub-compact',
        null,
      ],
      default: null,
    },

    type: { type: String, trim: true, default: '' },

    paint_color: { type: String, trim: true, default: '' },

    /* =========================
       IMAGES
    ========================= */
    image_url: { type: String, trim: true, default: '' },

    gallery: [
      {
        type: String,
        trim: true,
      },
    ],

    /* =========================
       FLAGS
    ========================= */
    posting_date: {
      type: Date,
      default: Date.now,
    },

    isNewRelease: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* =========================
   INDEXES (NO DUPLICATES)
========================= */

// Only ONE index per field
carSchema.index({ brandId: 1 });
carSchema.index({ id: 1 });

carSchema.index({ modelName: 1 });
carSchema.index({ manufacturer: 1 });
carSchema.index({ model: 1 });
carSchema.index({ type: 1 });

carSchema.index({ region: 1 });
carSchema.index({ state: 1 });

carSchema.index({ price: 1 });
carSchema.index({ year: -1 });

carSchema.index({ isFeatured: 1 });
carSchema.index({ isNewRelease: 1 });
carSchema.index({ isSold: 1 });
carSchema.index({ isDeleted: 1 });

// Compound indexes
carSchema.index({ brandId: 1, isNewRelease: 1 });
carSchema.index({ state: 1, region: 1 });
carSchema.index({ manufacturer: 1, model: 1 });
carSchema.index({ year: -1, price: 1 });
carSchema.index({ isFeatured: 1, createdAt: -1 });

/* =========================
   VIRTUALS
========================= */

carSchema.virtual('fullLocation').get(function () {
  const parts = [];

  if (this.region) parts.push(this.region);
  if (this.state) parts.push(this.state);
  if (this.country) parts.push(this.country);

  return parts.join(', ') || 'Unknown Location';
});

carSchema.virtual('displayTitle').get(function () {
  const parts = [];

  if (this.year) parts.push(this.year);
  if (this.manufacturer) parts.push(this.manufacturer);
  if (this.model) parts.push(this.model);

  return parts.join(' ') || this.modelName;
});

carSchema.virtual('formattedPrice').get(function () {
  if (!this.price) return 'Contact for price';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(this.price);
});

/* =========================
   INSTANCE METHODS
========================= */

carSchema.methods.isVintage = function () {
  if (!this.year) return false;
  return currentYear - this.year > 25;
};

carSchema.methods.getAge = function () {
  if (!this.year) return null;
  return currentYear - this.year;
};

carSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/* =========================
   PRE SAVE
========================= */

carSchema.pre('save', function (next) {
  if (!this.modelName || this.modelName === 'Vehicle undefined') {
    this.modelName = 'Unknown Vehicle';
  }

  if (this.VIN) {
    this.VIN = this.VIN.replace(/\s/g, '').toUpperCase();
  }

  if (this.price === 0) this.price = null;
  if (this.odometer === 0) this.odometer = null;

  if (
    this.year &&
    (this.year < 1886 || this.year > currentYear + 1)
  ) {
    this.year = null;
  }

  next();
});

/* =========================
   AUTO POPULATE
========================= */

carSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'brandId',
    select: 'name logoUrl slug',
  });

  next();
});

/* =========================
   EXPORT
========================= */
const Car = mongoose.model('Car', carSchema);
export default Car;
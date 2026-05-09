import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    /* =========================
       BRAND INFO
    ========================= */
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'Brand name cannot exceed 100 characters',
      ],
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    logoUrl: {
      type: String,
      trim: true,
      default: '',
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        2000,
        'Description cannot exceed 2000 characters',
      ],
      default: '',
    },

    foundedYear: {
      type: Number,
      min: [1800, 'Founded year is invalid'],
      max: [
        new Date().getFullYear(),
        'Founded year cannot be in the future',
      ],
      default: null,
    },

    country: {
      type: String,
      trim: true,
      default: '',
    },

    website: {
      type: String,
      trim: true,
      default: '',
    },

    headquarters: {
      type: String,
      trim: true,
      default: '',
    },

    /* =========================
       STATUS
    ========================= */
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    popularity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* =========================
       MEDIA
    ========================= */
    bannerImage: {
      type: String,
      trim: true,
      default: '',
    },

    /* =========================
       SEO
    ========================= */
    metaTitle: {
      type: String,
      trim: true,
      default: '',
    },

    metaDescription: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* =========================
   INDEXES
========================= */

// Only custom index here
brandSchema.index({ popularity: -1 });

/* =========================
   VIRTUALS
========================= */
brandSchema.virtual('displayName').get(
  function () {
    return this.name;
  }
);

/* =========================
   AUTO GENERATE SLUG
========================= */
brandSchema.pre(
  'save',
  function (next) {
    if (this.name) {
      this.slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    next();
  }
);

/* =========================
   INSTANCE METHODS
========================= */
brandSchema.methods.getPublicData =
  function () {
    return {
      id: this._id,
      name: this.name,
      slug: this.slug,
      logoUrl: this.logoUrl,
      description: this.description,
      foundedYear: this.foundedYear,
      country: this.country,
      website: this.website,
      headquarters: this.headquarters,
      isFeatured: this.isFeatured,
      popularity: this.popularity,
      createdAt: this.createdAt,
    };
  };

/* =========================
   STATIC METHODS
========================= */

// Featured brands
brandSchema.statics.getFeaturedBrands =
  function (limit = 10) {
    return this.find({
      isFeatured: true,
      isActive: true,
    })
      .sort({ popularity: -1 })
      .limit(limit);
  };

// Active brands
brandSchema.statics.getActiveBrands =
  function () {
    return this.find({
      isActive: true,
    }).sort({ name: 1 });
  };

/* =========================
   POST SAVE LOG
========================= */
brandSchema.post(
  'save',
  function (doc) {
    console.log(
      `🏭 Brand saved: ${doc.name}`
    );
  }
);

/* =========================
   MODEL EXPORT
========================= */
const Brand = mongoose.model(
  'Brand',
  brandSchema
);

export default Brand;
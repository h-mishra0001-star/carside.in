import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car ID is required'],
      index: true,
    },

    testDriveDate: {
      type: Date,
      required: [true, 'Test drive date is required'],
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      lowercase: true,
      trim: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },

    contactNumber: {
      type: String,
      trim: true,
      default: '',
    },

    location: {
      type: String,
      trim: true,
      default: '',
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
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
   INDEXES (CLEANED)
========================= */
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ carId: 1, createdAt: -1 });
bookingSchema.index({ status: 1, isDeleted: 1 });

/* =========================
   VALIDATION
========================= */
bookingSchema.pre('save', function (next) {
  if (this.testDriveDate && this.testDriveDate < new Date()) {
    return next(
      new Error('Test drive date cannot be in the past')
    );
  }
  next();
});

/* =========================
   AUTO POPULATE (SAFE)
   ⚠️ removed "fuelType" bug (not in Car model)
========================= */
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'username email fullName phone',
  }).populate({
    path: 'carId',
    select:
      'modelName year price image_url brandId fuel transmission image_url',
  });

  next();
});

/* =========================
   STATIC METHODS
========================= */
bookingSchema.statics.getPendingBookings = function () {
  return this.find({
    status: 'pending',
    isDeleted: false,
  });
};

bookingSchema.statics.getUserBookings = function (userId) {
  return this.find({
    userId,
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

/* =========================
   INSTANCE METHODS
========================= */
bookingSchema.methods.cancelBooking = async function () {
  this.status = 'cancelled';
  return await this.save();
};

/* =========================
   MODEL EXPORT
========================= */
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
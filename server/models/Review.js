import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    /* =========================
       RELATIONS
    ========================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car ID is required'],
    },

    /* =========================
       REVIEW CONTENT
    ========================= */
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    content: {
      type: String,
      required: [true, 'Review content is required'],
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },

    /* =========================
       PROS & CONS
    ========================= */
    pros: [
      {
        type: String,
        trim: true,
        maxlength: [100, 'Pro cannot exceed 100 characters'],
      },
    ],

    cons: [
      {
        type: String,
        trim: true,
        maxlength: [100, 'Con cannot exceed 100 characters'],
      },
    ],

    /* =========================
       MEDIA
    ========================= */
    images: [
      {
        type: String,
        trim: true,
      },
    ],

    /* =========================
       FLAGS
    ========================= */
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    /* =========================
       HELPFUL SYSTEM
    ========================= */
    helpful: {
      count: {
        type: Number,
        default: 0,
      },

      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    /* =========================
       REVIEW STATUS
    ========================= */
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'rejected',
        'reported',
      ],
      default: 'pending',
    },

    /* =========================
       ADMIN REPLY
    ========================= */
    adminReply: {
      content: {
        type: String,
        trim: true,
        default: '',
      },

      repliedAt: {
        type: Date,
        default: null,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
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
reviewSchema.index({ carId: 1, status: 1 });

reviewSchema.index({ createdAt: -1 });

reviewSchema.index(
  { userId: 1, carId: 1 },
  { unique: true }
);

/* =========================
   AUTO POPULATE
========================= */
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'username fullName avatar',
  });

  this.populate({
    path: 'carId',
    select:
      'modelName manufacturer model year image_url',
  });

  next();
});

/* =========================
   PRE SAVE CLEANING
========================= */
reviewSchema.pre('save', function (next) {
  if (this.pros?.length) {
    this.pros = this.pros.map((item) =>
      item.trim()
    );
  }

  if (this.cons?.length) {
    this.cons = this.cons.map((item) =>
      item.trim()
    );
  }

  if (!this.isNew) {
    this.isEdited = true;
  }

  next();
});

/* =========================
   UPDATE CAR RATINGS
========================= */
reviewSchema.statics.updateCarRatings =
  async function (carId) {
    const Car = mongoose.model('Car');

    const stats = await this.aggregate([
      {
        $match: {
          carId: new mongoose.Types.ObjectId(carId),
          status: 'approved',
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$carId',
          avgRating: {
            $avg: '$rating',
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    if (stats.length > 0) {
      await Car.findByIdAndUpdate(carId, {
        rating:
          Math.round(stats[0].avgRating * 10) / 10,
        reviewsCount: stats[0].totalReviews,
      });
    } else {
      await Car.findByIdAndUpdate(carId, {
        rating: 0,
        reviewsCount: 0,
      });
    }
  };

/* =========================
   POST SAVE
========================= */
reviewSchema.post('save', async function () {
  await this.constructor.updateCarRatings(
    this.carId
  );

  console.log(
    `⭐ Review saved for car: ${this.carId}`
  );
});

/* =========================
   POST REMOVE
========================= */
reviewSchema.post(
  'findOneAndDelete',
  async function (doc) {
    if (doc) {
      await doc.constructor.updateCarRatings(
        doc.carId
      );
    }
  }
);

/* =========================
   INSTANCE METHODS
========================= */

reviewSchema.methods.getSummary = function () {
  return {
    id: this._id,

    user: this.userId
      ? {
          id: this.userId._id,
          username: this.userId.username,
          fullName: this.userId.fullName,
          avatar: this.userId.avatar,
        }
      : null,

    car: this.carId,

    title: this.title,

    content:
      this.content.length > 200
        ? `${this.content.substring(0, 200)}...`
        : this.content,

    rating: this.rating,

    pros: this.pros,

    cons: this.cons,

    images: this.images,

    verifiedPurchase:
      this.verifiedPurchase,

    helpfulCount: this.helpful.count,

    createdAt: this.createdAt,
  };
};

reviewSchema.methods.markHelpful =
  async function (userId) {
    const alreadyMarked =
      this.helpful.users.some(
        (id) => id.toString() === userId.toString()
      );

    if (!alreadyMarked) {
      this.helpful.users.push(userId);

      this.helpful.count += 1;

      await this.save();
    }

    return this.helpful.count;
  };

reviewSchema.methods.addAdminReply =
  async function (adminId, content) {
    this.adminReply = {
      content,
      repliedAt: new Date(),
      repliedBy: adminId,
    };

    return await this.save();
  };

/* =========================
   STATIC METHODS
========================= */

reviewSchema.statics.getApprovedReviews =
  function (carId) {
    return this.find({
      carId,
      status: 'approved',
      isDeleted: false,
    }).sort({ createdAt: -1 });
  };

reviewSchema.statics.getFeaturedReviews =
  function (limit = 5) {
    return this.find({
      isFeatured: true,
      status: 'approved',
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  };

/* =========================
   MODEL EXPORT
========================= */
const Review = mongoose.model(
  'Review',
  reviewSchema
);

export default Review;
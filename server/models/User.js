import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFO
    ========================= */
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
      default: '',
    },

    phone: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^[0-9]{10}$/,
        'Please enter a valid 10-digit phone number',
      ],
    },

    avatar: {
      type: String,
      default:
        'https://ui-avatars.com/api/?background=b9d024&color=fff&bold=true',
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },

    /* =========================
       ROLE & STATUS
    ========================= */
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    /* =========================
       TOKENS
    ========================= */
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpire: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
      select: false,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    /* =========================
       ACTIVITY
    ========================= */
    lastLogin: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    /* =========================
       USER PREFERENCES
    ========================= */
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },

        push: {
          type: Boolean,
          default: false,
        },
      },

      savedCars: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Car',
        },
      ],

      savedBrands: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Brand',
        },
      ],
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
userSchema.index({ createdAt: -1 });

/* =========================
   VIRTUALS
========================= */
userSchema.virtual('savedCarsCount').get(function () {
  return this.preferences?.savedCars?.length || 0;
});

userSchema.virtual('savedBrandsCount').get(function () {
  return this.preferences?.savedBrands?.length || 0;
});

/* =========================
   HASH PASSWORD
========================= */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});

/* =========================
   CLEAN USER DATA
========================= */
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  if (this.username) {
    this.username = this.username
      .trim()
      .toLowerCase();
  }

  next();
});

/* =========================
   INSTANCE METHODS
========================= */

userSchema.methods.comparePassword =
  async function (candidatePassword) {
    return await bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

userSchema.methods.generateEmailVerificationToken =
  function () {
    const token = crypto
      .randomBytes(32)
      .toString('hex');

    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    this.emailVerificationExpire =
      Date.now() + 24 * 60 * 60 * 1000;

    return token;
  };

userSchema.methods.generatePasswordResetToken =
  function () {
    const token = crypto
      .randomBytes(32)
      .toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    this.resetPasswordExpire =
      Date.now() + 60 * 60 * 1000;

    return token;
  };

userSchema.methods.updateLastLogin =
  async function () {
    this.lastLogin = new Date();
    this.loginCount += 1;

    return await this.save();
  };

userSchema.methods.getPublicProfile =
  function () {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
      avatar: this.avatar,
      bio: this.bio,
      role: this.role,
      isActive: this.isActive,
      isBlocked: this.isBlocked,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
    };
  };

/* =========================
   STATIC METHODS
========================= */
userSchema.statics.getActiveUsers =
  function () {
    return this.find({
      isActive: true,
      isBlocked: false,
    }).sort({ createdAt: -1 });
  };

userSchema.statics.getAdmins =
  function () {
    return this.find({
      role: 'admin',
    });
  };

/* =========================
   MODEL EXPORT
========================= */
const User = mongoose.model('User', userSchema);

export default User;
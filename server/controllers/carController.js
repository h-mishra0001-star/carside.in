import Car from '../models/Car.js';
import Brand from '../models/Brand.js';

// @desc    Get all cars with filters
export const getCars = async (req, res) => {
  try {
    const {
      search,
      brand,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuelType,
      transmission,
      driveType,
      seatingCapacity,
      sort,
      page = 1,
      limit = 12,
      newOnly,
      featured
    } = req.query;

    let filter = {};

    if (search) {
      filter.modelName = { $regex: search, $options: 'i' };
    }

    if (brand && brand !== 'all') {
      const brandDoc = await Brand.findOne({ 
        name: { $regex: `^${brand}$`, $options: 'i' } 
      });
      if (brandDoc) {
        filter.brandId = brandDoc._id;
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = parseInt(minYear);
      if (maxYear) filter.year.$lte = parseInt(maxYear);
    }

    if (fuelType && fuelType !== 'all') {
      filter.fuelType = fuelType;
    }

    if (transmission && transmission !== 'all') {
      filter.transmission = transmission;
    }

    if (driveType && driveType !== 'all') {
      filter.driveType = driveType;
    }

    if (seatingCapacity) {
      filter.seatingCapacity = { $gte: parseInt(seatingCapacity) };
    }

    if (newOnly === 'true') {
      filter.isNewRelease = true;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'hp_desc':
        sortOption = { horsepower: -1 };
        break;
      case 'year_desc':
        sortOption = { year: -1 };
        break;
      case 'year_asc':
        sortOption = { year: 1 };
        break;
      case 'name_asc':
        sortOption = { modelName: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Car.countDocuments(filter);

    const cars = await Car.find(filter)
      .populate('brandId', 'name logoUrl')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cars,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cars'
    });
  }
};

// @desc    Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('brandId', 'name logoUrl');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error('Get car by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car details'
    });
  }
};

// @desc    Get cars by brand
export const getCarsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { limit = 10 } = req.query;

    const cars = await Car.find({ brandId })
      .populate('brandId', 'name logoUrl')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: cars,
      count: cars.length
    });

  } catch (error) {
    console.error('Get cars by brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brand cars'
    });
  }
};

// @desc    Get new releases
export const getNewReleases = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const cars = await Car.find({ isNewRelease: true })
      .populate('brandId', 'name logoUrl')
      .sort({ year: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cars,
      count: cars.length
    });

  } catch (error) {
    console.error('Get new releases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new releases'
    });
  }
};

// @desc    Get featured cars
export const getFeaturedCars = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const cars = await Car.find({ isFeatured: true })
      .populate('brandId', 'name logoUrl')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cars,
      count: cars.length
    });

  } catch (error) {
    console.error('Get featured cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured cars'
    });
  }
};

// @desc    Search cars
export const searchCars = async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const cars = await Car.find({
      modelName: { $regex: query, $options: 'i' }
    })
      .populate('brandId', 'name logoUrl')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cars,
      count: cars.length,
      query
    });

  } catch (error) {
    console.error('Search cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search cars'
    });
  }
};

// @desc    Get car filters options
export const getFilterOptions = async (req, res) => {
  try {
    const brands = await Brand.find().select('name');
    const fuelTypes = await Car.distinct('fuelType');
    const transmissions = await Car.distinct('transmission');
    const driveTypes = await Car.distinct('driveType');
    const years = await Car.distinct('year');

    res.json({
      success: true,
      data: {
        brands: brands.map(b => b.name),
        fuelTypes: fuelTypes.filter(Boolean),
        transmissions: transmissions.filter(Boolean),
        driveTypes: driveTypes.filter(Boolean),
        years: years.filter(Boolean).sort((a, b) => b - a)
      }
    });

  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options'
    });
  }
};

// @desc    Create car (Admin only)
export const createCar = async (req, res) => {
  try {
    const { modelName, brandId, year, price, horsepower, imageUrl, isNewRelease, isFeatured } = req.body;

    if (!modelName || !brandId || !year || !price || !horsepower) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const car = await Car.create({
      modelName,
      brandId,
      year,
      price,
      horsepower,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500',
      isNewRelease: isNewRelease || false,
      isFeatured: isFeatured || false
    });

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });

  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create car'
    });
  }
};

// @desc    Update car (Admin only)
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const car = await Car.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: car
    });

  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update car'
    });
  }
};

// @desc    Delete car (Admin only)
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });

  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete car'
    });
  }
};
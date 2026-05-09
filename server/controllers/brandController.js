import Brand from '../models/Brand.js';
import Car from '../models/Car.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const { search, featured, limit = 50 } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const brands = await Brand.find(filter)
      .sort({ name: 1 })
      .limit(parseInt(limit));

    const brandsWithCount = await Promise.all(
      brands.map(async (brand) => {
        const carCount = await Car.countDocuments({ brandId: brand._id });
        return {
          _id: brand._id,
          name: brand.name,
          logoUrl: brand.logoUrl,
          description: brand.description,
          foundedYear: brand.foundedYear,
          country: brand.country,
          isFeatured: brand.isFeatured,
          popularity: brand.popularity,
          carsCount: carCount,
          createdAt: brand.createdAt
        };
      })
    );

    res.json({
      success: true,
      data: brandsWithCount,
      count: brandsWithCount.length
    });

  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands'
    });
  }
};

// @desc    Get single brand by ID
// @route   GET /api/brands/:id
// @access  Public
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const brand = await Brand.findById(id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    const cars = await Car.find({ brandId: brand._id })
      .sort({ year: -1, createdAt: -1 });

    res.json({
      success: true,
      data: {
        brand: {
          _id: brand._id,
          name: brand.name,
          logoUrl: brand.logoUrl,
          description: brand.description,
          foundedYear: brand.foundedYear,
          country: brand.country,
          isFeatured: brand.isFeatured,
          popularity: brand.popularity
        },
        cars: cars.map(car => ({
          _id: car._id,
          modelName: car.modelName,
          year: car.year,
          price: car.price,
          horsepower: car.horsepower,
          acceleration: car.acceleration,
          topSpeed: car.topSpeed,
          engine: car.engine,
          imageUrl: car.imageUrl,
          isNewRelease: car.isNewRelease,
          isFeatured: car.isFeatured
        })),
        carsCount: cars.length
      }
    });

  } catch (error) {
    console.error('Get brand by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brand details'
    });
  }
};

// @desc    Get brand with its cars (detailed)
// @route   GET /api/brands/:id/cars
// @access  Public
export const getBrandCars = async (req, res) => {
  try {
    const { id } = req.params;
    const { sort = 'year_desc', limit = 20 } = req.query;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    let sortOption = { year: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'year_asc') sortOption = { year: 1 };
    if (sort === 'name_asc') sortOption = { modelName: 1 };

    const cars = await Car.find({ brandId: brand._id })
      .sort(sortOption)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        brand: {
          _id: brand._id,
          name: brand.name,
          logoUrl: brand.logoUrl,
          description: brand.description
        },
        cars: cars.map(car => ({
          _id: car._id,
          modelName: car.modelName,
          year: car.year,
          price: car.price,
          horsepower: car.horsepower,
          acceleration: car.acceleration,
          imageUrl: car.imageUrl
        })),
        total: cars.length
      }
    });

  } catch (error) {
    console.error('Get brand cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brand cars'
    });
  }
};

// @desc    Get featured brands
// @route   GET /api/brands/featured
// @access  Public
export const getFeaturedBrands = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const brands = await Brand.find({ isFeatured: true })
      .limit(parseInt(limit));

    const brandsWithCount = await Promise.all(
      brands.map(async (brand) => {
        const carCount = await Car.countDocuments({ brandId: brand._id });
        return {
          _id: brand._id,
          name: brand.name,
          logoUrl: brand.logoUrl,
          description: brand.description,
          country: brand.country,
          isFeatured: brand.isFeatured,
          carsCount: carCount
        };
      })
    );

    res.json({
      success: true,
      data: brandsWithCount
    });

  } catch (error) {
    console.error('Get featured brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured brands'
    });
  }
};

// @desc    Create brand (Admin only)
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = async (req, res) => {
  try {
    const { name, logoUrl, description, foundedYear, country, isFeatured } = req.body;

    if (!name || !logoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Name and logo URL are required'
      });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand already exists'
      });
    }

    const brand = await Brand.create({
      name,
      logoUrl,
      description: description || '',
      foundedYear: foundedYear || null,
      country: country || '',
      isFeatured: isFeatured || false,
      popularity: 0
    });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: {
        _id: brand._id,
        name: brand.name,
        logoUrl: brand.logoUrl,
        description: brand.description,
        foundedYear: brand.foundedYear,
        country: brand.country,
        isFeatured: brand.isFeatured
      }
    });

  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create brand'
    });
  }
};

// @desc    Update brand (Admin only)
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, description, foundedYear, country, isFeatured, popularity } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    if (name) brand.name = name;
    if (logoUrl) brand.logoUrl = logoUrl;
    if (description !== undefined) brand.description = description;
    if (foundedYear !== undefined) brand.foundedYear = foundedYear;
    if (country !== undefined) brand.country = country;
    if (isFeatured !== undefined) brand.isFeatured = isFeatured;
    if (popularity !== undefined) brand.popularity = popularity;

    await brand.save();

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: {
        _id: brand._id,
        name: brand.name,
        logoUrl: brand.logoUrl,
        description: brand.description,
        foundedYear: brand.foundedYear,
        country: brand.country,
        isFeatured: brand.isFeatured,
        popularity: brand.popularity
      }
    });

  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update brand'
    });
  }
};

// @desc    Delete brand (Admin only)
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if brand has cars
    const carCount = await Car.countDocuments({ brandId: id });
    if (carCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete brand. ${carCount} cars are associated with this brand.`
      });
    }

    await Brand.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });

  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete brand'
    });
  }
};

// @desc    Generate brand slug (utility function)
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
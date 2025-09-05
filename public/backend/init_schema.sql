-- This is the schema for Bansal Timber and Plywood

-- Bansal Timber schema
-- Charset and engine
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Admins (only admin auth needed)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('superadmin','editor') NOT NULL DEFAULT 'editor',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories for products
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(200) DEFAULT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attribute bundles (per category)
CREATE TABLE IF NOT EXISTS `attribute_bundles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attributes inside bundles
CREATE TABLE IF NOT EXISTS `attributes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `bundle_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) DEFAULT NULL,
  `input_type` ENUM('select','multiselect','text','number','boolean') NOT NULL DEFAULT 'select',
  `required` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`bundle_id`) REFERENCES `attribute_bundles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attribute options (for select-type attributes)
CREATE TABLE IF NOT EXISTS `attribute_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attribute_id` INT NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `bundle_id` INT DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL UNIQUE,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL, -- HTML from rich-text editor
  `price` DECIMAL(10,2) DEFAULT NULL,
  `sku` VARCHAR(100) DEFAULT NULL,
  `created_by` INT DEFAULT NULL, -- admin id
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`bundle_id`) REFERENCES `attribute_bundles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `is_primary` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attribute values selected per product
CREATE TABLE IF NOT EXISTS `product_attribute_values` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `attribute_id` INT NOT NULL,
  `attribute_option_id` INT DEFAULT NULL, -- for select-type attributes
  `value_text` VARCHAR(255) DEFAULT NULL, -- for free-text attributes
  `value_number` DECIMAL(10,3) DEFAULT NULL, -- for numeric attributes
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enquiries
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `product_id` INT DEFAULT NULL,
  `quantity` VARCHAR(100) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('pending','contacted','converted','cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carousels
CREATE TABLE IF NOT EXISTS `carousels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) DEFAULT NULL UNIQUE,
  `target_page` VARCHAR(150) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carousel items
CREATE TABLE IF NOT EXISTS `carousel_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `carousel_id` INT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `cta_text` VARCHAR(100) DEFAULT NULL,
  `cta_link` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`carousel_id`) REFERENCES `carousels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hero images (one per page usually)
CREATE TABLE IF NOT EXISTS `hero_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_slug` VARCHAR(150) NOT NULL,
  `heading` VARCHAR(255) DEFAULT NULL,
  `subheading` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(255) NOT NULL,
  `cta_text` VARCHAR(100) DEFAULT NULL,
  `cta_link` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners (general banners, not blog static one)
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `location` VARCHAR(150) DEFAULT NULL,
  `image` VARCHAR(255) NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blogs
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL UNIQUE,
  `excerpt` VARCHAR(500) DEFAULT NULL,
  `body` LONGTEXT DEFAULT NULL, -- store HTML from editor
  `image` VARCHAR(255) DEFAULT NULL,
  `author_id` INT DEFAULT NULL,
  `status` ENUM('draft','published','archived') DEFAULT 'draft',
  `published_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags for blogs
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog ↔ Tags many-to-many relation
CREATE TABLE IF NOT EXISTS `blog_tags_map` (
  `blog_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`blog_id`,`tag_id`),
  FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings (site-wide config)
CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;


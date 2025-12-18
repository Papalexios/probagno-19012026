/**
 * Professional Material Categorization System
 * Maps technical material codes to user-friendly category names
 */

export interface MaterialCategory {
  displayName: string;
  displayNameEn: string;
  keywords: string[];
  priority: number; // Higher = shown first
}

/**
 * Material category mapping - maps raw materials to professional categories
 */
export const MATERIAL_CATEGORIES: Record<string, MaterialCategory> = {
  // Wood & Wood-effect materials
  'Δρυς': {
    displayName: 'Δρυς',
    displayNameEn: 'Oak',
    keywords: ['oak', 'δρυς', 'd3700', 'ov', 'vanilla', 'βανίλια', 'βανιλια', 'natural oak', 'φυσική', 'μασίφ', 'massif'],
    priority: 100,
  },
  'Καρυδιά': {
    displayName: 'Καρυδιά',
    displayNameEn: 'Walnut',
    keywords: ['walnut', 'καρυδιά', 'καρυδια'],
    priority: 95,
  },
  
  // Neutral colors
  'Λευκό': {
    displayName: 'Λευκό',
    displayNameEn: 'White',
    keywords: ['white', 'λευκό', 'λευκο', 'k101', 'pe white', 'corian white'],
    priority: 90,
  },
  'Γκρι': {
    displayName: 'Γκρι',
    displayNameEn: 'Grey',
    keywords: ['grey', 'gray', 'γκρι', 'u191', 'interior grey', 'interior gray'],
    priority: 85,
  },
  'Ανθρακί': {
    displayName: 'Ανθρακί',
    displayNameEn: 'Anthracite',
    keywords: ['anthracite', 'ανθρακί', 'ανθρακι', 'u164'],
    priority: 80,
  },
  'Μαύρο': {
    displayName: 'Μαύρο',
    displayNameEn: 'Black',
    keywords: ['black', 'μαύρο', 'μαυρο', 'u190', 'tx black'],
    priority: 75,
  },
  
  // Premium materials
  'Corian': {
    displayName: 'Corian',
    displayNameEn: 'Corian',
    keywords: ['corian', 'κοριαν'],
    priority: 110,
  },
  'Γυαλί': {
    displayName: 'Γυαλί',
    displayNameEn: 'Glass',
    keywords: ['glass', 'γυαλί', 'γυαλι', 'γυαλιστερό', 'γυαλιστερο', 'γλασ'],
    priority: 105,
  },
  'Matrix': {
    displayName: 'Matrix',
    displayNameEn: 'Matrix',
    keywords: ['matrix', 'matrix/s4', 's4'],
    priority: 102,
  },
  
  // Finishes
  'Λάκα': {
    displayName: 'Λάκα',
    displayNameEn: 'Lacquer',
    keywords: ['lacquer', 'λάκα', 'λακα', 'λακέ', 'λακε', 'γυαλιστερή', 'γυαλιστερη'],
    priority: 95,
  },
  'Καπλαμάς': {
    displayName: 'Καπλαμάς',
    displayNameEn: 'Veneer',
    keywords: ['veneer', 'καπλαμάς', 'καπλαμας', 'καπλαμά', 'καπλαμα', 'κπθ', 'mdf'],
    priority: 70,
  },
  'Μελαμίνη': {
    displayName: 'Μελαμίνη',
    displayNameEn: 'Melamine',
    keywords: ['melamine', 'μελαμίνη', 'μελαμινη', 'cdf', 'swiss krono'],
    priority: 65,
  },
};

/**
 * Categorize a raw material string into a professional category
 */
export function categorizeMaterial(rawMaterial: string): string {
  const normalized = rawMaterial.toLowerCase().trim();
  
  // Check each category's keywords
  for (const [category, config] of Object.entries(MATERIAL_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // If no match, return cleaned version of original
  // Remove technical codes like "CDF Swiss Krono" prefix
  let cleaned = rawMaterial
    .replace(/CDF Swiss Krono\s+[A-Z0-9]+\s+[A-Z]+\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned || rawMaterial;
}

/**
 * Get display name for a category (respects language)
 */
export function getCategoryDisplayName(category: string, language: 'el' | 'en' = 'el'): string {
  const config = MATERIAL_CATEGORIES[category];
  if (!config) return category;
  
  return language === 'el' ? config.displayName : config.displayNameEn;
}

/**
 * Group materials into categories with counts
 */
export interface MaterialCategoryCount {
  category: string;
  displayName: string;
  displayNameEn: string;
  count: number;
  priority: number;
  rawMaterials: string[]; // Original material strings
}

export function groupMaterialsIntoCategories(
  materials: Array<{ material: string; count: number }>
): MaterialCategoryCount[] {
  const categoryMap = new Map<string, MaterialCategoryCount>();
  
  // Group materials by category
  materials.forEach(({ material, count }) => {
    const category = categorizeMaterial(material);
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)!;
      existing.count += count;
      existing.rawMaterials.push(material);
    } else {
      const config = MATERIAL_CATEGORIES[category];
      categoryMap.set(category, {
        category,
        displayName: config?.displayName || category,
        displayNameEn: config?.displayNameEn || category,
        count,
        priority: config?.priority || 50,
        rawMaterials: [material],
      });
    }
  });
  
  // Sort by priority (high to low), then by count (high to low)
  return Array.from(categoryMap.values()).sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Higher priority first
    }
    return b.count - a.count; // More products first
  });
}

/**
 * Check if a product matches a material category filter
 */
export function productMatchesMaterialCategory(
  productMaterials: string[],
  selectedCategory: string
): boolean {
  return productMaterials.some(material => {
    const category = categorizeMaterial(material);
    return category === selectedCategory;
  });
}

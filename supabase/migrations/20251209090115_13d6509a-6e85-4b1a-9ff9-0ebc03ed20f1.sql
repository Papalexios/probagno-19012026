-- Add tags column for multi-category support
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- Update all products with correct category tags to match probagno.gr exactly
-- Based on probagno.gr counts: Καθρέπτης LED: 8, Καθρέπτης με ντουλάπι: 31, Κολώνα μπάνιου: 7, Μεταλλική βάση: 3, Ντουλάπι: 26, Συρτάρι: 29

-- First, let's set tags based on the product characteristics
-- Products with LED mirrors
UPDATE public.products SET tags = array_append(tags, 'Καθρέπτης LED') 
WHERE (name LIKE '%LED%' OR description LIKE '%LED%' OR name_en LIKE '%LED%') 
AND NOT ('Καθρέπτης LED' = ANY(tags));

-- Products with mirror cabinets (most vanity sets include mirror cabinets)
UPDATE public.products SET tags = array_append(tags, 'Καθρέπτης με ντουλάπι') 
WHERE (category = 'Έπιπλα Μπάνιου' OR category = 'Καθρέπτες' OR name LIKE '%καθρέπτ%' OR description LIKE '%καθρέπτ%' OR description LIKE '%ντουλάπι%')
AND NOT ('Καθρέπτης με ντουλάπι' = ANY(tags));

-- Bathroom columns
UPDATE public.products SET tags = array_append(tags, 'Κολώνα μπάνιου') 
WHERE (category = 'Κολώνες & Ντουλάπια' OR name LIKE '%Κολώνα%' OR name LIKE '%κολόνα%' OR description LIKE '%κολώνα%' OR description LIKE '%κολόνα%')
AND NOT ('Κολώνα μπάνιου' = ANY(tags));

-- Metal base products
UPDATE public.products SET tags = array_append(tags, 'Μεταλλική βάση') 
WHERE (name LIKE '%Μεταλλικ%' OR description LIKE '%μεταλλικ%' OR name_en LIKE '%Metal%')
AND NOT ('Μεταλλική βάση' = ANY(tags));

-- Cabinet products
UPDATE public.products SET tags = array_append(tags, 'Ντουλάπι') 
WHERE (category = 'Έπιπλα Μπάνιου' OR category = 'Κολώνες & Ντουλάπια' OR name LIKE '%ντουλάπ%' OR description LIKE '%ντουλάπ%')
AND NOT ('Ντουλάπι' = ANY(tags));

-- Drawer products (vanities with drawers)
UPDATE public.products SET tags = array_append(tags, 'Συρτάρι') 
WHERE (name LIKE '%συρτάρ%' OR description LIKE '%συρτάρ%' OR description LIKE '%συρτάρια%')
AND NOT ('Συρτάρι' = ANY(tags));
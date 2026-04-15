const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data: menu, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('tier', { ascending: true }); // Using 'tier' if we use it for Steamers, otherwise any logic

    if (error) throw error;
    res.json(menu.map(item => ({
      ...item,
      _id: item.id,
      isVeg: item.is_veg,
      imageUrl: item.image_url
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const { data: menu, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(menu.map(item => ({
      ...item,
      _id: item.id,
      isVeg: item.is_veg,
      imageUrl: item.image_url
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data: item, error } = await supabase
      .from('menu_items')
      .insert({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: Number(req.body.price),
        is_veg: req.body.isVeg ?? req.body.is_veg,
        image_url: req.body.imageUrl ?? req.body.image_url,
        available: req.body.available !== false,
        tier: req.body.tier || 1
      })
      .select()
      .single();

    if (error) throw error;
    
    // Convert to camelCase format matching frontend
    item._id = item.id;
    item.isVeg = item.is_veg;
    item.imageUrl = item.image_url;
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.isVeg !== undefined) updates.is_veg = req.body.isVeg;
    if (req.body.imageUrl !== undefined) updates.image_url = req.body.imageUrl;
    if (req.body.available !== undefined) updates.available = req.body.available;
    if (req.body.tier !== undefined) updates.tier = req.body.tier;

    const { data: item, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    
    item._id = item.id;
    item.isVeg = item.is_veg;
    item.imageUrl = item.image_url;
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data: item, error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    
    if (item) {
       item._id = item.id;
       item.isVeg = item.is_veg;
       item.imageUrl = item.image_url;
    }
    
    res.json(item || { success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

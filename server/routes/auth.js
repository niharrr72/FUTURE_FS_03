const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_darjeeling';

// ── REGISTER ──────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, savedAddress } = req.body;
    
    const { data: existing, error: existingError } = await supabase
      .from('custom_users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existing) return res.status(400).json({ message: 'Phone already registered.' });

    const passwordHash = await bcrypt.hash(password, 10);
    
    const { data: user, error: insertError } = await supabase
      .from('custom_users')
      .insert({
        name,
        email,
        phone,
        password_hash: passwordHash,
        saved_address: savedAddress || null
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    // Map snake_case to camelCase for the frontend payload
    const mappedUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      savedAddress: user.saved_address
    };

    res.json({ token, user: mappedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── LOGIN ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { phone, email, password, isAdminLogin } = req.body;

    // Admin login — default credentials flow overrides Supabase for admins
    if (isAdminLogin) {
      const adminEmail = email || phone;
      if (
        adminEmail === process.env.ADMIN_EMAIL &&
        password   === process.env.ADMIN_PASSWORD
      ) {
        const token = jwt.sign({ id: 'admin-static', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin' } });
      }
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    // Customer login — check Supabase custom_users
    const { data: user, error } = await supabase
      .from('custom_users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) return res.status(401).json({ message: 'No account found with this phone number.' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Incorrect password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, savedAddress: user.saved_address }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── UPDATE PROFILE ────────────────────────────────
router.patch('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'admin') return res.status(403).json({ message: 'Admin profile is not editable here.' });

    const { name, email, phone, currentPassword, newPassword, savedAddress } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('custom_users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (fetchError || !user) return res.status(404).json({ message: 'User not found.' });

    const updates = {};

    if (newPassword) {
      const ok = await bcrypt.compare(currentPassword || '', user.password_hash);
      if (!ok) return res.status(400).json({ message: 'Current password is incorrect.' });
      updates.password_hash = await bcrypt.hash(newPassword, 10);
    }

    if (name)         updates.name  = name;
    if (email)        updates.email = email;
    if (phone)        updates.phone = phone;
    if (savedAddress) updates.saved_address = savedAddress;

    const { data: updatedUser, error: updateError } = await supabase
      .from('custom_users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    res.json({ 
      user: { 
        id: updatedUser.id, 
        name: updatedUser.name, 
        phone: updatedUser.phone, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        savedAddress: updatedUser.saved_address 
      } 
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token.' });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

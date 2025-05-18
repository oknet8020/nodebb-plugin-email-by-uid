'use strict';

const User = require.main.require('./src/user');
const express = require('express');

const tokenSecret = 'YOUR_SECRET_TOKEN'; // שנה לפי הצורך

module.exports = {
  init(params, callback) {
    const app = params.app;

    app.get('/api/email-by-uid', async (req, res) => {
      const uid = req.query.uid;
      const token = req.query.token;

      if (!uid || !token) {
        return res.status(400).json({ error: 'Missing uid or token' });
      }

      if (token !== tokenSecret) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      try {
        const userData = await User.getUserFields(uid, ['email']);
        if (!userData || !userData.email) {
          return res.status(404).json({ error: 'Email not found' });
        }

        return res.json({ email: userData.email });
      } catch (err) {
        return res.status(500).json({ error: 'Internal error', details: err.message });
      }
    });

    callback();
  },
};

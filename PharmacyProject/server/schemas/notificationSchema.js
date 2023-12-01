const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    type: { type: String, enum: ['OrderUpdate', 'InventoryAlert', 'GeneralInfo'] },
    createdAt: Date,
    isRead: Boolean
  });
  
  notificationSchema.index({ userId: 1 });
  
  const Notification = mongoose.model('Notification', notificationSchema);
  
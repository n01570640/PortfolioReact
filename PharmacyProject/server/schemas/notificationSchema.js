const mongoose = require('mongoose');

/**
 * Notification Schema for MongoDB using Mongoose.
 * 
 * Defines structure for notification documents including:
 * - userId: ObjectId reference to User.
 * - message: String containing the notification message.
 * - type: String specifying the notification type, restricted to 'OrderUpdate', 'InventoryAlert', or 'GeneralInfo'.
 * - createdAt: Date of notification creation.
 * - isRead: Boolean indicating if the notification has been read.
 *
 * An index is created on the 'userId' field for optimized query performance.
 */

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    type: { type: String, enum: ['OrderUpdate', 'InventoryAlert', 'GeneralInfo'] },
    createdAt: Date,
    isRead: Boolean
  });
  
  notificationSchema.index({ userId: 1 });
  
  const Notification = mongoose.model('Notification', notificationSchema);
  
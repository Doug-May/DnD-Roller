const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const RollSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   number: {
      type: String,
      required: true
   },
   type: {
      type: Number,
      required: true
   },
   modifier: {
      type: String,
      required: true
   },
   damageNumber: {
      type: String,
      required: false
   },
   damageType: {
      type: Number,
      required: false
   },
   damageModifier: {
      type: String,
      required: false
   },
   user: {
      type: String,
      required: true
   }
});

mongoose.model('rolls', RollSchema);

import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  weeks: {
    type: Number,
    required: true,
    min: 1,
    max: 40
  },
  lessonLength: {
    type: Number,
    required: true,
    min: 15,
    max: 180
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  teacher: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true // 👈 detta gör att alla nya kurser är aktiva
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Se till att virtuals inkluderas när vi konverterar till JSON
courseSchema.set('toJSON', { virtuals: true })
courseSchema.set('toObject', { virtuals: true })

export default mongoose.model('Course', courseSchema)

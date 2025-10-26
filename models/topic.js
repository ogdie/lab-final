import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  category: {
    type: String,
    enum: ['Python', 'Java', 'JavaScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Outros'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Topic || mongoose.model('Topic', topicSchema);


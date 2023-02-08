let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/graphql_0208') // mongodb://127.0.0.1:27017/{DB name}

const personSchema = new mongoose.Schema({ 
    name: String,
    age: Number,
    todolist: [String]
});

module.exports = {
    PersonModel: mongoose.model('Person', personSchema)    
}

// 新增: PersonModel.create
// 查詢: PersonModel.find
// 修改: PersonModel.update
// 刪除: PersonModel.delete
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var { PersonModel } = require('./connectdb')

// Construct a schema, using GraphQL schema language
// 查詢使用 Query, 修改資料使用 Mutation
var schema = buildSchema(`
  type Persion {
    id: String
    name: String,
    age: Int,
    todolist: [String]
  }

  input PersionInput {
    name: String,
    age: Int,
    todolist: [String]
  }

  type Query {
    getPersonList: [Persion]
  }

  type Mutation {
    createPerson(info: PersionInput):Persion
    updatePerson(id: String!, info: PersionInput):Boolean
    deletePerson(id: String!):Boolean
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  getPersonList: () => {
    return PersonModel.find()
  },

  createPerson: ({info}) => {
    return PersonModel.create({...info})
  },

  updatePerson: ({id, info}) => {
    return PersonModel.updateOne({ _id: id }, { ...info }).then(res=> { return res.acknowledged }) 
  },
  // https://mongoosejs.com/docs/api/model.html#model_Model-updateOne 
  // res ={ acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1 }

  deletePerson: ({id}) => {
    return PersonModel.deleteOne({_id: id}).then(res => { return res.acknowledged }) 
  },
  // res = { acknowledged: true, deletedCount: 1 }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(5000);

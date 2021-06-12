const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

let _db;
const mongoConnect=(callback)=>{
    MongoClient.connect('mongodb+srv://rupam123:rupam123@nodecluster.plaky.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client=>{
            _db=client.db();
            console.log('Connected!');
            callback(client);
        })
        .catch(err=>console.log(err))

}

const getDb=()=>{
    if(_db){
        return  _db;
    }
    throw 'No DB is available'
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
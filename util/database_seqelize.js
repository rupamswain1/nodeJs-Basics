const Sequelize =require('sequelize');

const db='nodeDB'
const user='root';
const dbPwd='pheonix';
const dialect='mysql';
const host='localhost';

const sequelize=new Sequelize(db,user,dbPwd,{
    dialect:dialect,
    host:host,
})

module.exports=sequelize;
import { db } from "../../config/sequelize.js";

const Session = db.session;

async function checkSessionLog(id) {
     return await new Promise(resolve => resolve(Session.findOne({ where: { userId: id } })));
 }
 
 async function createSessionLog(token, id) {
     return await new Promise(resolve => resolve(Session.create({
         userId: id,
         token,
         status: 'ACTIVE',
     })));
 }

 export {
     checkSessionLog,
     createSessionLog
 }

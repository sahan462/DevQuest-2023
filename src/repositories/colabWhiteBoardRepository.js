import ColabWhiteBoard from "../models/colabWhiteBoard.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
    _db = db;
}

// Implement this method for Challenge 7
async function getWhiteBoardDataByGroup(group_id) {
    try {
        const row = await knex_db.raw('select * from colab_whiteboard where group_id = ?', [group_id]);
        return row[0].whiteboard_json;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

// Implement this method for Challenge 7
async function addWhiteBoardData(data) {

    try{
        const row = await knex_db.raw('select * from colab_whiteboard where group_id = ?', [data.group_id]);

        if(row.length === 1){
            const dataRow= JSON.stringify(data.whiteboard_json);
            const updatedRow = await knex_db.raw('update colab_whiteboard set whiteboard_json = ? where group_id = ? RETURNING id', [dataRow, data.group_id]);
            if(updatedRow){
                return("Updated Successfully!");
            }
        }else{
            const dataRow= JSON.stringify(data.whiteboard_json);
            const insertedRow = await knex_db.raw('insert into colab_whiteboard(group_id, whiteboard_json, user_id) values(?,?,?) RETURNING id', [data.group_id, dataRow, data.user_id]);
            if(insertedRow){
                return("Inserted Successfully!");
            }
        }

    }catch(e){
        console.log(e.message);
    }
}

function parseWhiteBoardData(data) {
    return data.map(item => {
        return new ColabWhiteBoard(item.id, item.group_id, item.whiteboard_json, item.user_id, item.created_at, item.updated_at);
    });
}


export default {
    init,
    parseWhiteBoardData
};
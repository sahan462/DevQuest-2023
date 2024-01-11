import knex from "knex";
import knex_db from "../../db/db-config.js";
import userRepository from "./userRepository.js";
import httpStatus from "../enums/httpStatus.js";
import { raw } from "express";

let _db;
function init(db) {
  _db = db;
}

//Update this method to complete challenge2.a
async function getSuggestedFriends(userId) {
  return [];
}

//Update this method to complete challenge3.a, challenge3.b and challenge3.c
async function sendReq(data) {
  const { sender_id, recipient_id, status } = data;
  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM friends WHERE sender_id = ? AND recipient_id = ?", [
        sender_id,
        recipient_id,
      ])
      .then((exists) => {
        if (exists.length > 0) {
          resolve(httpStatus.BAD_REQUEST);
          return;
        } else {
          knex_db
            .raw(
              "SELECT * FROM friends WHERE recipient_id = ? AND sender_id = ?",
              [sender_id, recipient_id]
            )
            .then((sent) => {
              if (sent.length > 0) {
                resolve(httpStatus.FORBIDDEN);
                return;
              } else {
                knex_db
                  .raw("UPDATE friends SET status = 'PENDING' WHERE id = ?", [
                    1,
                  ])
                  .then(() => {
                    resolve("");
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getPeopleYouMayKnow(id) {
  const parsedId = parseInt(id);
  return new Promise((resolve, reject) => {
    resolve([]);
  });
}

//Update this method to view the users to whom the requests were sent and complete challenge3.d
async function viewSentReqs(id) {
  let reqSentUsers = [];
  return reqSentUsers;
}

//Update this method to view the users whose the requests were received and complete challenge3.e
async function viewPendingReqs(id) {
  let reqReceivedUsers = [];
  return reqReceivedUsers;
}

//Update this method to complete the challenge3.f
async function acceptReq(id) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw("UPDATE friends SET status = 'PENDING' WHERE id = ?", [1])
      .then(() => {
        resolve("");
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Update this method to complete the challenge3.g
async function rejectReq(id) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw("SELECT * FROM friends WHERE id = ?", [id])
      .then((rowFound) => {
        if (!rowFound[0]) {
          resolve("Request not found!");
          return;
        }
        knex_db
          .raw("UPDATE friends SET status = 'PENDING' WHERE id = ?", [1])
          .then(() => {
            resolve("");
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function isPendingRequest(id) {
  const result = await knex_db('friends').where({ id, status: 'pending' });
  return result.length > 0;
}

async function cancelReq(id) {
    try {
      const result = await knex_db.raw("SELECT * FROM friends WHERE id = ? AND status = 'PENDING'", [id]);
      if(result.length > 0) {
        await knex_db.raw('DELETE FROM friends WHERE id = ?', [id]);
        return "Request cancelled successfully!";
      }

    } catch (error) {
      console.error(error);
      throw error;
    }
}
async function removeFriend(id) {

  const row = await knex_db.raw("SELECT * FROM friends WHERE id = ?", [id]);
  if(row.length === 1){
    try {
      await knex_db.raw('DELETE FROM friends WHERE id = ?', [id]);
      return "Friend removed successfully!";
    } catch (error) {
      console.error(error);
      throw error;
    }
  }else{
      return "Friend not found!";
  }

}




//Update this method to complete the challenge4.a
async function viewFriends(id) {
  
    try {
    const friendsData = await knex_db.raw(
      `
      SELECT u.id, f.id AS reqId
      FROM friends f
      JOIN users u ON (f.sender_id = u.id OR f.recipient_id = u.id) AND u.id <> ?
      WHERE (f.sender_id = ? OR f.recipient_id = ?) AND f.status = 'ACCEPTED'
      `,
      [id, id, id]
    );

    const friendList = [];

    for (const friend of friendsData) {
      const user = await userRepository.getUser(friend.id);

      friendList.push({
        id: user.id,
        email: user.email,
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        image_url: user.image_url,
        hobbies: user.hobbies,
        skills: user.skills,
        reqId: friend.reqId,
      });
    }

    return friendList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPeopleFromKeyword(id, keyword, pageNumber) {
  let query;
  const pageSize = 3;
  const offset = (pageNumber - 1) * pageSize;
  if (!keyword) {
    query = "";
  } else {
    query = "";
  }
  return new Promise((resolve, reject) => {
    resolve([]);
  });
}

module.exports = {
  init,
  getSuggestedFriends,
  sendReq,
  getPeopleYouMayKnow,
  viewSentReqs,
  viewPendingReqs,
  acceptReq,
  rejectReq,
  cancelReq,
  removeFriend,
  viewFriends,
  getPeopleFromKeyword
};

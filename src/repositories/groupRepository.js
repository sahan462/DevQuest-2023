import Group from "../models/group.js";
import HttpStatus from "../enums/httpStatus.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
  _db = db;
}

// Implement the method body for challenge 8
async function getGroupsOfUser(userid) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        `
        SELECT groups.*
        FROM userGroups
        JOIN groups ON userGroups.group_id = groups.id
        WHERE userGroups.user_id = ?
        `,
        [userid]
      )
      .then((result) => {
        const groups = result;
        resolve(groups);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getProjectsOfGroup(groupId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        `SELECT pt.*, ut.image_url 
      FROM projects pt JOIN users ut on ut.id = pt.ownerId
      WHERE groupId = ?`,
        [groupId]
      )
      .then((result) => {
        const projects = result;
        resolve(projects);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getTasksOfUser(userId, groupId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        ` SELECT tt.*, pt.name AS projectName, pt.projectStatus
         FROM tasks tt LEFT JOIN projects pt ON tt.projectId = pt.id WHERE tt.assigneeId = ? AND pt.groupId = ?`,
        [userId, groupId]
      )
      .then((result) => {
        const tasks = result;
        resolve(tasks);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getTasksOfProject(projectId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(` SELECT tt.* FROM tasks tt WHERE tt.projectId = ?`, [projectId])
      .then((result) => {
        const tasks = result;
        resolve(tasks);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getUsersOfGroups(groupId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        ` SELECT 
        ut.id,
        ut.email,
        ut.image_url,
        ut.firstname,
        ut.lastname
        FROM users ut
        LEFT JOIN userGroups ug
        ON ug.user_id=ut.id
        WHERE ug.group_id = ?`,
        [groupId]
      )
      .then((result) => {
        const users = result;
        resolve(users);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Implement this method body for challenge 10
async function addNewProject(projectDetails) {
  try {
    await knex_db('projects').insert({
      name: projectDetails.projectName,
      description: projectDetails.projectDescription,
      ownerId: projectDetails.userId,
      createdDate: projectDetails.currentDate,
      dueDate: projectDetails.endDate,
      projectStatus: projectDetails.status,
      groupId: projectDetails.selectedUserGroupId,
    });

    return 'success';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method body for challenge 11
async function addNewTask(taskDetails) {
  try {
    await knex_db('tasks').insert({
      name: taskDetails.name,
      description: taskDetails.taskDescription,
      assigneeId: taskDetails.assignee,
      reporterId: taskDetails.reporter,
      createdDate: taskDetails.createdDate,
      dueDate: taskDetails.dueDate,
      projectId: taskDetails.projectId,
      taskStatus: taskDetails.taskStatus,
    });

    return 'success';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for challenge 12
async function updateProject(details, projectId) {
  try {
    await knex_db('projects')
      .where('id', projectId)
      .update({
        name: details.projectName,
        description: details.projectDescription,
        dueDate: details.endDate,
      });

    return 'success';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for challenge 13
async function updateTask(details, taskId) {
  try {
    await knex_db('tasks')
      .where('id', taskId)
      .update({
        name: details.taskName,
        description: details.taskDescription,
        dueDate: details.endDate,
        assigneeId: details.assignee,
        // Include other fields that you want to update
      });

    return 'success';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for challenge 14
async function updateProjectStatus(projectId, status) {
  try {
    await knex_db('projects')
      .where('id', projectId)
      .update({
        projectStatus: status,
      });

    return 'success';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for challenge 15
async function updateTaskStatus(taskId, status) {
  try {
    await knex_db('tasks')
      .where('id', taskId)
      .update({
        taskStatus: status,
      });

    return 'success';
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    knex_db
      .raw(` SELECT * FROM projects WHERE id = ?`, [projectId])
      .then((result) => {
        const project = result;
        resolve(project);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// Implement this method for Challenge 5
async function getGroupsFromKeyword(keyword) {
  try {
    const groups = await knex_db.raw(
      `
      SELECT *
      FROM groups
      WHERE name LIKE ?
      `,
      [`%${keyword}%`]
    );

    return groups;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for Challenge 5
async function addNewGroup(data) {
  try {
    const [GroupId] = await knex_db.raw(
      `
      INSERT INTO groups (name, description, hobbies, capacity)
      VALUES (?, ?, ?, ?)
      RETURNING id;
      `,
      [data.group_name, data.group_desc, 'hobbies' in data && Array.isArray(data.hobbies) ? JSON.stringify(data.hobbies) : JSON.stringify([]), 'capacity' in data ? data.capacity : 0]
    );

    return GroupId && GroupId.length > 0 ? GroupId[0].id : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for Challenge 6
async function addUserToGroup(data) {
  try {
    await knex_db('userGroups').insert({
      user_id: data.user_id,
      group_id: data.group_id,
    });

    return { status: 200, message: 'success' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for challenge 6
async function getGroupsFromUser(userId) {
  try {
    const groups = await knex_db('userGroups')
      .select('groups.*')
      .join('groups', 'userGroups.group_id', '=', 'groups.id')
      .where('userGroups.user_id', '=', userId);

    return groups;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function parseGroupsData(data) {
  return data.map(item => {
    return new Group(item.id, item.name, item.description, JSON.parse(item.hobbies), item.capacity)
  });
}

export default {
  init,
  getGroupsOfUser,
  getProjectsOfGroup,
  getTasksOfUser,
  getTasksOfProject,
  getUsersOfGroups,
  updateProject,
  updateTask,
  getProjectById,
  updateProjectStatus,
  updateTaskStatus,
  addNewProject,
  addNewTask,
  getGroupsFromUser,
  addUserToGroup,
  getGroupsFromKeyword,
  addNewGroup
};

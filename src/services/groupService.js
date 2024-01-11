import groupRepository from "../repositories/groupRepository.js";
import httpStatus from "../enums/httpStatus.js";
import dbConnection from "../../sqlite.js";

//initialize db connection
function initializeApp() {
  dbConnection
    .getDbConnection()
    .then((db) => {
      groupRepository.init(db);
    })
    .catch((err) => {
      console.error("Error initializing the application:", err);
      process.exit(1); // Exit the application or handle the error appropriately
    });
}

async function getGroupsOfUserReq(id) {
  const response = await groupRepository.getGroupsOfUser(id);
  return { response: response, status: httpStatus.OK };
}

async function getProjectsOfGroupReq(id) {
  const response = await groupRepository.getProjectsOfGroup(id);
  return { response: response, status: httpStatus.OK };
}

async function getTasksOfUserReq(id, groupId) {
  const response = await groupRepository.getTasksOfUser(id, groupId);
  return { response: response, status: httpStatus.OK };
}

async function getTasksOfProjectReq(projectId) {
  const response = await groupRepository.getTasksOfProject(projectId);
  return { response: response, status: httpStatus.OK };
}

async function getUsersOfGroupsReq(groupId) {
  const response = await groupRepository.getUsersOfGroups(groupId);
  return { response: response, status: httpStatus.OK };
}

// Implement the method updateProjectReq(details, projectId) for challenge 12 here
//
//
//
//
//


// Implement the method updateTaskReq(details, taskId) for challenge 13 here
async function updateTaskReq(details, taskId) {
  try {
    const response = await groupRepository.updateTask(details, taskId);
    return { response: response, status: httpStatus.OK };
  } catch (error) {
    console.error(error);
    return { response: error.message, status: httpStatus.INTERNAL_SERVER_ERROR };
  }
}

async function getProjectByIdReq(projectId) {
  const response = await groupRepository.getProjectById(projectId);
  return { response: response, status: httpStatus.OK };
}

// Implement the method updateProjectStatusReq(projectId, status) for challenge 14 here
async function updateProjectStatusReq(projectId, status) {
  try {
    const response = await groupRepository.updateProjectStatus(projectId, status);
    return { response: response, status: httpStatus.OK };
  } catch (error) {
    console.error(error);
    return { response: error.message, status: httpStatus.INTERNAL_SERVER_ERROR };
  }
}

// Implement the method updateTaskStatusReq(taskId, status) for challenge 15 here
//
//
//
//
//

async function addNewProjectReq(projectDetails) {
  const response = await groupRepository.addNewProject(projectDetails);
  return { response: response, status: httpStatus.OK };
}

async function addNewTaskReq(taskDetails) {
  const response = await groupRepository.addNewTask(taskDetails);
  return { response: response, status: httpStatus.OK };
}
// Implement this method for Challenge 5
async function getGroupsFromKeyword(keyword) {
  try {
    const response = await groupRepository.getGroupsFromKeyword(keyword);
    return { response: response, status: httpStatus.OK };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for Challenge 5
async function addNewGroup(data) {
  try {
    const response = await groupRepository.addNewGroup(data);

    if (response) {
      return { response: response, status: httpStatus.OK };
    } else {
      return { response: response, status: httpStatus.INTERNAL_SERVER_ERROR };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Implement this method for Challenge 6
async function addUserToGroup(data) {
  try {
    const response = await groupRepository.addUserToGroup(data);
    return response;
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'Failed' };
  }
}

// Implement this method for Challenge 6
async function getGroupsFromUser(user_id) {
  try {
    const groups = await groupRepository.getGroupsFromUser(user_id);
    return { response: groups, status: httpStatus.OK };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateProjectReq(details, projectId) {
  const response = await groupRepository.updateProject(details, projectId);
  return { response: response, status: httpStatus.OK };
}

initializeApp();

export default {
  initializeApp,
  getGroupsOfUserReq,
  getProjectsOfGroupReq,
  getTasksOfUserReq,
  getTasksOfProjectReq,
  getUsersOfGroupsReq,
  getProjectByIdReq,
  addNewProjectReq,
  addNewTaskReq,
  getGroupsFromKeyword,
  addNewGroup,
  addUserToGroup,
  getGroupsFromUser,
  updateProjectReq,
  updateTaskReq,
  updateProjectStatusReq
};

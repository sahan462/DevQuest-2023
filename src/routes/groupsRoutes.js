import express from 'express';
import groupService from '../services/groupService.js';
export const router = express.Router();
import HttpStatus from "../enums/httpStatus.js";


router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const groups = await groupService.getGroupsFromUser(parseInt(userId));
    res.json(groups);
});

router.get('/:userId/userGroups', async (req, res) => {
    const userId = req.params.userId;
    const groups = await groupService.getGroupsOfUserReq(userId);
    res.json(groups);
});

router.get('/:groupId/groupProjects', async (req, res) => {
    const groupId = req.params.groupId;
    const projects = await groupService.getProjectsOfGroupReq(groupId);
    res.json(projects);
});

router.get('/:userId/:groupId/userTasks', async (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const tasks = await groupService.getTasksOfUserReq(userId, groupId);
    res.json(tasks);
});

router.get('/:projectId/projectTasks', async (req, res) => {
    const projectId = req.params.projectId;
    const tasks = await groupService.getTasksOfProjectReq(projectId);
    res.json(tasks);
});

router.get('/:groupId/users', async (req, res) => {
    const groupId = req.params.groupId;
    const users = await groupService.getUsersOfGroupsReq(groupId);
    res.json(users);
});

// Implement the route method for updateProject in challenge 12 here
router.put('/:projectId/updateProject', async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const details = req.body;
  
      const response = await groupService.updateProjectReq(details, projectId);
      res.status(response.status).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Implement the route method for updateTask in challenge 13 here
router.put('/:taskId/updateTask', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const details = req.body;
  
      const response = await groupService.updateTaskReq(details, taskId);
      res.status(response.status).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

router.get('/:projectId/project', async (req, res) => {
    const projectId = req.params.projectId;
    const project = await groupService.getProjectByIdReq(projectId);
    res.json(project);
});

// Implement the route method for updateProjectStatus in challenge 14 here
router.put('/:projectId/updateProjectStatus', async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { status } = req.body;
  
      const response = await groupService.updateProjectStatusReq(projectId, status);
      res.status(response.status).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Implement the route method for updateTaskStatus in challenge 15 here
router.put('/:taskId/updateTaskStatus', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const { status } = req.body;
  
      const response = await groupService.updateTaskStatusReq(taskId, status);
      res.status(response.status).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

router.post("/addNewProject", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewProjectReq(data);
    res.status(response.status).json(response);
});

router.post("/addNewTask", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewTaskReq(data);
    res.status(response.status).json(response);
});

router.get('/keywordsearch/:keyword', async (req, res) => {
    let keyword = req.params.keyword;
    const groupSearchFilter = await groupService.getGroupsFromKeyword(keyword);
    res.send(groupSearchFilter);
});

router.post('/addNewGroup', async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewGroup(data)
    res.send(response);
});

router.post('/addUserIntoGroup', async (req, res) => {
    try {
        const data = req.body;
        const response = await groupService.addUserToGroup(data);
        res.status(response.status).send(response);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
})

export default router;
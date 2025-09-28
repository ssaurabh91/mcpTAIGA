import { createAuthenticatedClient } from './taigaAuth.js';

/**
 * Service for interacting with the Taiga API
 */
export class TaigaService {
  /**
   * Get a list of all projects the user has access to
   * @returns {Promise<Array>} - List of projects
   */
  async listProjects() {
    try {
      const client = await createAuthenticatedClient();

      // Primero obtenemos la información del usuario actual
      const currentUser = await this.getCurrentUser();
      const userId = currentUser.id;

      // Luego obtenemos los proyectos donde el usuario es miembro
      const response = await client.get('/projects', {
        params: {
          member: userId
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to list projects:', error.message);
      throw new Error('Failed to list projects from Taiga');
    }
  }

  /**
   * Get details of a specific project
   * @param {string} projectId - Project ID or slug
   * @returns {Promise<Object>} - Project details
   */
  async getProject(projectId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get project ${projectId}:`, error.message);
      throw new Error(`Failed to get project details from Taiga`);
    }
  }

  /**
   * Get a project by its slug
   * @param {string} slug - Project slug
   * @returns {Promise<Object>} - Project details
   */
  async getProjectBySlug(slug) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get(`/projects/by_slug?slug=${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get project by slug ${slug}:`, error.message);
      throw new Error(`Failed to get project details from Taiga`);
    }
  }

  /**
   * List user stories for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of user stories
   */
  async listUserStories(projectId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get('/userstories', {
        params: { project: projectId }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to list user stories for project ${projectId}:`, error.message);
      throw new Error('Failed to list user stories from Taiga');
    }
  }

  /**
   * Create a new user story in a project
   * @param {Object} userStoryData - User story data
   * @param {string} userStoryData.project - Project ID
   * @param {string} userStoryData.subject - User story subject/title
   * @param {string} [userStoryData.description] - User story description
   * @param {number} [userStoryData.status] - Status ID
   * @param {Array} [userStoryData.tags] - Array of tags
   * @returns {Promise<Object>} - Created user story
   */
  async createUserStory(userStoryData) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.post('/userstories', userStoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user story:', error.message);
      throw new Error('Failed to create user story in Taiga');
    }
  }

  /**
   * Get user story statuses for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of user story statuses
   */
  async getUserStoryStatuses(projectId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get('/userstory-statuses', {
        params: { project: projectId }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to get user story statuses for project ${projectId}:`, error.message);
      throw new Error('Failed to get user story statuses from Taiga');
    }
  }

  /**
   * Get the current user's information
   * @returns {Promise<Object>} - User information
   */
  async getCurrentUser() {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error.message);
      throw new Error('Failed to get user information from Taiga');
    }
  }

  /**
   * Create a new task associated with a user story
   * @param {Object} taskData - Task data
   * @param {string} taskData.project - Project ID
   * @param {string} taskData.subject - Task subject/title
   * @param {string} [taskData.description] - Task description
   * @param {string} [taskData.user_story] - User story ID
   * @param {string} [taskData.status] - Status ID
   * @param {Array} [taskData.tags] - Array of tags
   * @returns {Promise<Object>} - Created task
   */
  async createTask(taskData) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error.message);
      throw new Error('Failed to create task in Taiga');
    }
  }

  /**
   * Get task statuses for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of task statuses
   */
  async getTaskStatuses(projectId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get('/task-statuses', {
        params: { project: projectId }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to get task statuses for project ${projectId}:`, error.message);
      throw new Error('Failed to get task statuses from Taiga');
    }
  }

  /**
   * Get details of a specific user story
   * @param {string} userStoryId - User story ID
   * @returns {Promise<Object>} - User story details
   */
  async getUserStory(userStoryId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get(`/userstories/${userStoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get user story ${userStoryId}:`, error.message);
      throw new Error('Failed to get user story details from Taiga');
    }
  }

  /**
   * Update an existing user story
   * @param {string} userStoryId - User story ID
   * @param {Object} updateData - Data to update
   * @param {string} [updateData.subject] - User story subject/title
   * @param {string} [updateData.description] - User story description
   * @param {number} [updateData.status] - Status ID
   * @param {number} [updateData.assigned_to] - Assigned user ID
   * @param {Array} [updateData.tags] - Array of tags
   * @param {string} [updateData.points] - Story points
   * @param {string} [updateData.due_date] - Due date in YYYY-MM-DD format
   * @returns {Promise<Object>} - Updated user story
   */
  async updateUserStory(userStoryId, updateData) {
    try {
      const client = await createAuthenticatedClient();

      // First get the current user story to obtain the version for optimistic locking
      const currentStory = await this.getUserStory(userStoryId);

      // Add the version to the update data for optimistic locking
      const updatePayload = {
        ...updateData,
        version: currentStory.version
      };

      const response = await client.patch(`/userstories/${userStoryId}`, updatePayload);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user story ${userStoryId}:`, error.message);
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data:`, error.response.data);
      }
      throw new Error('Failed to update user story in Taiga');
    }
  }

  /**
   * List tasks associated with a user story
   * @param {string} userStoryId - User story ID
   * @returns {Promise<Array>} - List of tasks
   */
  async listUserStoryTasks(userStoryId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get('/tasks', {
        params: { user_story: userStoryId }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to list tasks for user story ${userStoryId}:`, error.message);
      throw new Error('Failed to list tasks from Taiga');
    }
  }

  /**
   * List project members
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} - List of project members
   */
  async listProjectMembers(projectId) {
    try {
      const client = await createAuthenticatedClient();
      const response = await client.get('/memberships', {
        params: { project: projectId }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to list project members for project ${projectId}:`, error.message);
      throw new Error('Failed to list project members from Taiga');
    }
  }
}

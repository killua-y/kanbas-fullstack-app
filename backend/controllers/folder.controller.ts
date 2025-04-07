import express, { Request, Response, Router } from 'express';
import { getFolderCountMap } from '../services/folder.service';
import FolderModel from '../models/folder.model';
import { DatabaseFolder } from '../types/folder';

const folderController = () => {
  const router: Router = express.Router();

  /**
   * Retrieves a list of folders along with the number of questions associated with each folder.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param _ The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the folder count mapping.
   *
   * @returns A Promise that resolves to void.
   */
  const getFoldersWithQuestionNumber = async (_: Request, res: Response): Promise<void> => {
    try {
      const foldercountmap = await getFolderCountMap();

      if (!foldercountmap || 'error' in foldercountmap) {
        throw new Error('Error while fetching folder count map');
      }

      res.json(
        Array.from(foldercountmap, ([name, qcnt]: [string, number]) => ({
          name,
          qcnt,
        })),
      );
    } catch (err) {
      res.status(500).send(`Error when fetching folder count map: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a folder from the database by its name, provided in the request parameters.
   * If the folder is not found or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The Request object containing the folder name in the URL parameters.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getFolderByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params; // Get the folder name from the request parameters
      const folder: DatabaseFolder | null = await FolderModel.findOne({ name }); // Use the model's method to find the folder

      if (!folder) {
        res.status(404).send(`Folder with name "${name}" not found`);
        return;
      }

      res.json(folder); // Return the folder as JSON
    } catch (err) {
      res.status(500).send(`Error when fetching folder: ${(err as Error).message}`);
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router.
  router.get('/piazza/getFoldersWithQuestionNumber', getFoldersWithQuestionNumber);
  router.get('/piazza/getFolderByName/:name', getFolderByName);

  return router;
};

export default folderController;

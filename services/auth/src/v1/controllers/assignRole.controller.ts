import { Response, Request, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { RoleAssignSchema } from '@/schemas';
import CustomError from '@/utils/Error';
import assignUserRole from '@/utils/assignRole';

const assignRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body using Zod
    const parsedBody = RoleAssignSchema.safeParse(req.body);

    // Check if the parsing was successful
    if (!parsedBody.success) {
      const error = CustomError.badRequest({
        message: 'Invalid request body',
        errors: parsedBody.error.errors,
        hints: 'Please check the request body and try again later',
      });
      res.status(error.status).json(error);
      return;
    }

    // Extract data only if parsing was successful
    const { userId, role } = parsedBody.data;

    // Update the user's metadata with the new role
    assignUserRole(userId, role);

    // Generate response
    const response = {
      code: 201,
      message: `Assigned role '${role}' to user with ID: ${userId}`,
      links: {
        self: req.url,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default assignRole;

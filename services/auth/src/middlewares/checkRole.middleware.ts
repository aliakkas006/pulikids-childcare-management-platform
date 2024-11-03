import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';

const checkRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the user ID from Clerk's auth object
      const { userId } = req.auth || {};

    //   await clerkClient.users.updateUser(userId, {
    //     password: 
    //   })

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        return;
      }

      // Fetch the user data from Clerk
      const user = await clerkClient.users.getUser(userId);
      const userRoles: any = user.publicMetadata?.roles || [];

      // Check if the user has any of the required roles
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        res.status(403).json({
          error: 'Forbidden: You do not have the required permissions',
        });
        return;
      }

      // User has the required role, proceed to the next middleware
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default checkRole;

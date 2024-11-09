import { Response, Request, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { UserLogoutSchema } from '@/v1/schemas';
import CustomError from '@/utils/Error';

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body using Zod
    const parsedBody = UserLogoutSchema.safeParse(req.body);

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
    const { signInTokenId } = parsedBody.data;

    const { userId, status } = await clerkClient.signInTokens.revokeSignInToken(
      signInTokenId
    );
    
    // Generate response
    const response = {
      code: 200,
      message: 'Logout successful',
      data: {
        userId,
        status,
      },
      links: {
        self: req.url,
        login: `/auth/login`,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default logout;

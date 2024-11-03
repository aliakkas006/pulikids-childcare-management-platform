import { Response, Request, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { UserLogoutSchema } from '@/schemas';
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

    // const { totalCount, data } = await clerkClient.users.getUserList({
    //   emailAddress,
    // });

    // if (totalCount === 0) {
    //   const error = CustomError.unauthorized({
    //     message: 'You are not authorized to access this resource!',
    //     errors: 'Invalid credentials',
    //     hints: 'Please check your email and try again later',
    //   });
    //   res.status(error.status).json(error);
    //   return;
    // }

    // const { id } = data[0];

    // // Verify password
    // const { verified } = await clerkClient.users.verifyPassword({
    //   userId: id,
    //   password,
    // });

    // const expiresInSeconds = 60 * 60 * 24 * 7; // 1 week
    // const { token } = await clerkClient.signInTokens.createSignInToken({
    //   userId: id,
    //   expiresInSeconds,
    // });

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

import { Response, Request, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { UserLoginSchema } from '@/v1/schemas';
import CustomError from '@/utils/Error';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body using Zod
    const parsedBody = UserLoginSchema.safeParse(req.body);

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
    const { emailAddress, password } = parsedBody.data;

    const { totalCount, data } = await clerkClient.users.getUserList({
      emailAddress,
    });

    if (totalCount === 0) {
      const error = CustomError.unauthorized({
        message: 'You are not authorized to access this resource!',
        errors: 'Invalid credentials',
        hints: 'Please check your email and try again later',
      });
      res.status(error.status).json(error);
      return;
    }

    const { id: userId } = data[0];

    // Verify password
    const { verified } = await clerkClient.users.verifyPassword({
      userId,
      password,
    });

    const expiresInSeconds = 60 * 60 * 24 * 7; // 1 week
    const { token, id: sit } = await clerkClient.signInTokens.createSignInToken(
      {
        userId,
        expiresInSeconds,
      }
    );

    // Generate response
    const response = {
      code: 200,
      message: 'Login successful',
      data: {
        verified,
        userId,
        signInTokenId: sit,
        session_token: token,
      },
      links: {
        self: req.url,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default login;

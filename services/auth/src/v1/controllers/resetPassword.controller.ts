import { Response, Request, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { PasswordResetSchema } from '@/v1/schemas';
import CustomError from '@/utils/Error';

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // // Validate the request body using Zod
    const parsedBody = PasswordResetSchema.safeParse(req.body);

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
    const { userId, newPassword } = parsedBody.data;

    // Update user's password
    await clerkClient.users.updateUser(userId, {
      password: newPassword,
    });

    // Generate response
    const response = {
      code: 200,
      message: 'Password reset successfully.',
      links: {
        self: req.url,
        login: `/auth/login`,
      },
    };

    res.status(201).json(response);

    // res.status(200).json({ message: '' });
  } catch (err) {
    next(err);
  }
};

export default resetPassword;

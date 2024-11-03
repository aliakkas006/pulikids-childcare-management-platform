import { Response, Request, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { UserCreateSchema } from '@/schemas';
import CustomError from '@/utils/Error';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body using Zod
    const parsedBody = UserCreateSchema.safeParse(req.body);

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
    const { firstName, lastName, emailAddress, password } = parsedBody.data;

    // Check user existence
    const { data } = await clerkClient.users.getUserList({
      emailAddress,
    });

    const userEmail = data[0].emailAddresses[0].emailAddress;
    const findEmail = emailAddress.find((email) => email === userEmail);

    if (userEmail === findEmail) {
      const error = CustomError.badRequest({
        message: 'Email already exist!',
        errors: 'Invalid request body',
        hints: 'Please check your email and try again later',
      });
      res.status(error.status).json(error);
      return;
    }

    // Create a new user in Clerk
    const user = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddress,
      password,
    });

    // Generate response
    const response = {
      code: 201,
      message: 'User registered successfully',
      data: {
        userId: user.id,
        name: `${firstName} ${lastName}`,
        email: user.emailAddresses[0].emailAddress,
      },
      links: {
        self: req.url,
        login: `/auth/login`,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default register;

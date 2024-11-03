

class RegistrationService {
  /**
   * Check if a user with the given email already exists.
   */
//  


  /**
   * Create an auth user.
   */
//   public async createUser(userData: any) {
//     const hashedPassword = await this.generateHash(userData.password);

//     const user = await prisma.user.create({
//       data: {
//         ...userData,
//         password: hashedPassword,
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         status: true,
//         verified: true,
//       },
//     });
//     return user;
//   }

  
}

const registrationService = new RegistrationService();

export default registrationService;

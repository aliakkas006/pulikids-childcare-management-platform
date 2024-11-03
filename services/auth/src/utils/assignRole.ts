import { clerkClient } from '@clerk/express';

const assignUserRole = async (userId: string, role: string) => {
  try {
    // Update user's public metadata to include the role
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: { role },
    });

    console.log(`Assigned role '${role}' to user with ID: ${userId}`);
  } catch (err) {
    console.error('Failed to assign role:', err);
  }
};

export default assignUserRole;

import bcrypt from "bcrypt";
async function hashPassword(plainTextPassword: string): Promise<string> {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hash = await bcrypt.hash(plainTextPassword, salt);

    // Return the hash or store it in your database
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Rethrow the error if needed
  }
}

async function comparePasswords(plainTextPassword: string, hash: string) {
  try {
    // Compare plain-text password with the hashed password
    const match = await bcrypt.compare(plainTextPassword, hash);
    return match; // Returns true if passwords match, otherwise false
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error; // Rethrow the error if needed
  }
}

export {hashPassword,comparePasswords}
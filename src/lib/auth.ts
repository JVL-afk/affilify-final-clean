import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from './mongodb'

export interface User {
  _id: ObjectId
  id: string
  name: string
  email: string
  password: string
  plan: 'basic' | 'pro' | 'enterprise'
  websitesCreated: number
  websiteLimit: number
  analysesUsed: number
  analysisLimit: number
  stripeCustomerId?: string
  subscriptionId?: string
  subscriptionStatus?: string
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

export interface AuthenticatedUser extends Omit<User, 'password'> {}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function getUserById(userId: string): Promise<AuthenticatedUser | null> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    )
    
    if (!user) return null
    
    return {
      ...user,
      id: user._id.toString(),
    } as AuthenticatedUser
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({ email })
    
    if (!user) return null
    
    return {
      ...user,
      id: user._id.toString(),
    } as User
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  plan?: 'basic' | 'pro' | 'enterprise'
}): Promise<AuthenticatedUser | null> {
  try {
    const { db } = await connectToDatabase()
    
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password)
    
    // Set plan limits
    const planLimits = {
      basic: { websiteLimit: 3, analysisLimit: 10 },
      pro: { websiteLimit: 25, analysisLimit: 50 },
      enterprise: { websiteLimit: -1, analysisLimit: -1 }
    }
    
    const plan = userData.plan || 'basic'
    const limits = planLimits[plan]
    
    // Create user
    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      plan,
      websitesCreated: 0,
      websiteLimit: limits.websiteLimit,
      analysesUsed: 0,
      analysisLimit: limits.analysisLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true, // Auto-verify for simplicity
    }
    
    const result = await db.collection('users').insertOne(newUser)
    
    if (!result.insertedId) {
      throw new Error('Failed to create user')
    }
    
    return {
      ...newUser,
      _id: result.insertedId,
      id: result.insertedId.toString(),
    } as AuthenticatedUser
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error updating user:', error)
    return false
  }
}

export async function incrementUserWebsites(userId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { websitesCreated: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error incrementing user websites:', error)
    return false
  }
}

export async function incrementUserAnalyses(userId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { analysesUsed: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error incrementing user analyses:', error)
    return false
  }
}
export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return { success: false, error: 'No token provided' }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Invalid token' }
  }
}


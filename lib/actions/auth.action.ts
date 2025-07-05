'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;
export async function signUp(params: SignUpParams): Promise<{ success: boolean; message: string }> {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.',
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: 'User created successfully.',
    };
  } catch (e: any) {
    console.log('Error creating user', e);

    if (e.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'Email already exists',
      };
    }

    return {
      success: false,
      message: 'This email is already in use',
    };
  }
}

export async function signIn(params: SignInParams){
    const { email, idToken } = params;
    try{
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create an account instead.',  
            }
        }
        await setSessionCookie(idToken)
    }
    catch(e){
        console.log(e)
        return {
            success: false,
            message: 'Error signing in. Please try again later.',
        };
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000 // 7 days
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        path: '/',
        sameSite: 'lax', // Lax is a good default for CSRF protection
    });  // 7 days)
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null; // No session cookie found
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

    if(!userRecord.exists) {
      return null; // User does not exist in the database
    }
    return {
        ...userRecord.data(),
        id: userRecord.id,
    } as User;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null; // Invalid session cookie
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user; // Returns true if user is authenticated, false otherwise
}


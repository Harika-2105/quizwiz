import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Firestore
} from 'firebase/firestore';
import { QuizProgress, UserProfile, LeaderboardEntry } from '../types/quiz';

// Helper to clean environment variable strings
function cleanEnv(val: string | undefined): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '');
}

// Extract environment variables with fallbacks
const envApiKey = cleanEnv(
  import.meta.env.VITE_FIREBASE_API_KEY ||
  (import.meta.env as any).FIREBASE_API_KEY ||
  (import.meta.env as any).REACT_APP_FIREBASE_API_KEY
);
const envProjectId = cleanEnv(
  import.meta.env.VITE_FIREBASE_PROJECT_ID ||
  (import.meta.env as any).FIREBASE_PROJECT_ID ||
  (import.meta.env as any).REACT_APP_FIREBASE_PROJECT_ID
);
const envAuthDomain = cleanEnv(
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
  (import.meta.env as any).FIREBASE_AUTH_DOMAIN ||
  (import.meta.env as any).REACT_APP_FIREBASE_AUTH_DOMAIN
) || (envProjectId ? `${envProjectId}.firebaseapp.com` : '');

const envStorageBucket = cleanEnv(
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
  (import.meta.env as any).FIREBASE_STORAGE_BUCKET ||
  (import.meta.env as any).REACT_APP_FIREBASE_STORAGE_BUCKET
) || (envProjectId ? `${envProjectId}.appspot.com` : '');

const envMessagingSenderId = cleanEnv(
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
  (import.meta.env as any).FIREBASE_MESSAGING_SENDER_ID ||
  (import.meta.env as any).REACT_APP_FIREBASE_MESSAGING_SENDER_ID
);

const envAppId = cleanEnv(
  import.meta.env.VITE_FIREBASE_APP_ID ||
  (import.meta.env as any).FIREBASE_APP_ID ||
  (import.meta.env as any).REACT_APP_FIREBASE_APP_ID
);

// Environmental Firebase configuration
const envConfig = {
  apiKey: envApiKey,
  authDomain: envAuthDomain,
  projectId: envProjectId,
  storageBucket: envStorageBucket,
  messagingSenderId: envMessagingSenderId,
  appId: envAppId
};

// Determine if real Firebase config is available and non-placeholder
export const isRealFirebaseConfigured = Boolean(
  envConfig.apiKey &&
  envConfig.projectId &&
  envConfig.apiKey !== 'YOUR_API_KEY' &&
  !envConfig.apiKey.includes('placeholder')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isRealFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(envConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully for project:', envConfig.projectId);
  } catch (err) {
    console.warn('Firebase initialization notice: Falling back to local state storage.', err);
  }
}

// Translate Firebase authentication errors into clear, actionable messages
export function parseFirebaseError(err: any): string {
  if (!err) return 'Authentication failed. Please check your credentials.';

  const code = err.code || (err.message ? String(err.message) : '');

  if (code.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in is NOT enabled in your Firebase Console. Go to Firebase Console -> Authentication -> Sign-in method -> Email/Password -> Click Enable and Save.';
  }
  if (
    code.includes('auth/invalid-credential') ||
    code.includes('auth/user-not-found') ||
    code.includes('auth/wrong-password')
  ) {
    return 'Invalid email or password. If you do not have an account yet, please click "Create Account".';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please switch to "Log In".';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password is too weak. Please enter a password with at least 6 characters.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('auth/user-disabled')) {
    return 'This user account has been disabled in the Firebase Console.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Access to this account has been temporarily disabled due to multiple failed login attempts. Please try again later.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Network connection error. Please check your internet connection.';
  }
  if (
    code.includes('auth/api-key-not-valid') ||
    code.includes('auth/invalid-api-key') ||
    code.includes('auth/configuration-not-found')
  ) {
    return 'Firebase API Key is invalid or missing. Please verify your VITE_FIREBASE_API_KEY in environment variables.';
  }
  if (code.includes('auth/unauthorized-domain')) {
    return 'This app domain is not authorized in Firebase. Please add this URL in Firebase Console -> Authentication -> Settings -> Authorized domains.';
  }

  if (err.message && typeof err.message === 'string' && !err.message.startsWith('Firebase:')) {
    return err.message;
  }

  return `Authentication error (${code || 'unknown'}): Please check your credentials and try again.`;
}

// Local Storage Fallback Engine Key Definitions
const LOCAL_USERS_KEY = 'quizwiz_local_users';
const LOCAL_PROGRESS_KEY = 'quizwiz_local_progress_';
const LOCAL_CURRENT_USER_KEY = 'quizwiz_local_session';
const LOCAL_LEADERBOARD_KEY = 'quizwiz_local_leaderboard';

// Helper for local storage parsing
function getLocalData<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to set localStorage key:', key, err);
  }
}

// Username Format & Rules Validator
export function validateUsernameRules(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();
  if (!trimmed) {
    return { valid: false, error: 'Username is required.' };
  }
  if (trimmed.length < 3 || trimmed.length > 15) {
    return { valid: false, error: 'Username must be 3 to 15 characters long.' };
  }
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  if (!usernameRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid username format. Only letters, numbers, and underscores are allowed.' };
  }
  return { valid: true };
}

// Check Username Availability across Database & Storage
export async function checkUsernameAvailability(username: string, excludeUid?: string): Promise<boolean> {
  const clean = username.trim().toLowerCase();
  if (!clean) return false;

  if (isRealFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'users'), where('usernameLower', '==', clean));
      const querySnap = await getDocs(q);
      let isTaken = false;
      querySnap.forEach((docSnap) => {
        if (docSnap.id !== excludeUid) {
          isTaken = true;
        }
      });
      return !isTaken;
    } catch (err) {
      console.error('Error checking username availability in Firestore:', err);
    }
  }

  // Local storage check
  const users = getLocalData<Record<string, { email: string; pass: string; profile: UserProfile }>>(LOCAL_USERS_KEY, {});
  for (const emailKey in users) {
    const userRecord = users[emailKey];
    if (userRecord.profile) {
      const existingUsername = (userRecord.profile.username || userRecord.profile.displayName || '').trim().toLowerCase();
      if (existingUsername === clean && userRecord.profile.uid !== excludeUid) {
        return false;
      }
    }
  }
  return true;
}

// Helper user formatter
export function formatUser(user: any, customUsername?: string): UserProfile {
  const username = customUsername || user.username || user.displayName || user.email?.split('@')[0] || '';
  return {
    uid: user.uid,
    email: user.email || 'guest@quizwiz.com',
    username: username,
    displayName: username,
    avatar: user.avatar || 'animal_cyber_cat',
    createdAt: new Date().toISOString(),
    totalQuizzesCompleted: 0,
    highScore: 0
  };
}

// Global Auth State Observer
export function listenToAuthState(callback: (user: UserProfile | null) => void) {
  if (isRealFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        callback(profile || formatUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  } else {
    // Local session simulation
    const currentLocalUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
    callback(currentLocalUser);

    // Custom storage listener
    const handleStorageChange = () => {
      const updatedUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
      callback(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }
}

// Local user authentication helpers
function loginLocalUserHelper(email: string, pass: string): UserProfile {
  const users = getLocalData<Record<string, { email: string; pass: string; profile: UserProfile }>>(LOCAL_USERS_KEY, {});
  const record = users[email.toLowerCase()];

  if (!record || record.pass !== pass) {
    if (email.toLowerCase() === 'demo.wiz@quizwiz.com' || !record) {
      const uid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      const uname = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 15) || 'quiz_wiz';
      const profile: UserProfile = {
        uid,
        email,
        username: uname,
        displayName: uname,
        avatar: 'animal_cyber_cat',
        createdAt: new Date().toISOString(),
        totalQuizzesCompleted: 0,
        highScore: 0
      };
      users[email.toLowerCase()] = { email, pass, profile };
      setLocalData(LOCAL_USERS_KEY, users);
      setLocalData(LOCAL_CURRENT_USER_KEY, profile);
      return profile;
    }
    throw new Error('Invalid email or password.');
  }

  setLocalData(LOCAL_CURRENT_USER_KEY, record.profile);
  return record.profile;
}

function signupLocalUserHelper(email: string, pass: string, username: string): UserProfile {
  const cleanUsername = username.trim();
  const users = getLocalData<Record<string, { email: string; pass: string; profile: UserProfile }>>(LOCAL_USERS_KEY, {});

  if (users[email.toLowerCase()]) {
    throw new Error('An account with this email address already exists.');
  }

  const uid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  const profile: UserProfile = {
    uid,
    email,
    username: cleanUsername,
    displayName: cleanUsername,
    avatar: 'animal_cyber_cat',
    createdAt: new Date().toISOString(),
    totalQuizzesCompleted: 0,
    highScore: 0
  };

  users[email.toLowerCase()] = { email, pass, profile };
  setLocalData(LOCAL_USERS_KEY, users);
  setLocalData(LOCAL_CURRENT_USER_KEY, profile);

  return profile;
}

// 1. Sign Up User with mandatory custom username
export async function signupUser(email: string, pass: string, username: string): Promise<UserProfile> {
  const validation = validateUsernameRules(username);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid username format.');
  }

  const cleanUsername = username.trim();

  if (isRealFirebaseConfigured && auth && db) {
    try {
      const isAvailable = await checkUsernameAvailability(cleanUsername);
      if (!isAvailable) {
        throw new Error('Username already taken');
      }

      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        username: cleanUsername,
        displayName: cleanUsername,
        avatar: 'animal_cyber_cat',
        createdAt: new Date().toISOString(),
        totalQuizzesCompleted: 0,
        highScore: 0
      };
      
      // Create user document in Firestore: collection('users'), doc(userId)
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: profile.email,
          username: cleanUsername,
          usernameLower: cleanUsername.toLowerCase(),
          displayName: cleanUsername,
          avatar: 'animal_cyber_cat',
          createdAt: profile.createdAt,
          totalQuizzesCompleted: 0,
          highScore: 0
        });
      } catch (fsErr) {
        console.error('Firestore user profile creation error:', fsErr);
      }

      return profile;
    } catch (err: any) {
      const errCode = err.code || String(err.message || '');
      if (
        errCode.includes('auth/api-key-not-valid') ||
        errCode.includes('auth/invalid-api-key') ||
        errCode.includes('auth/configuration-not-found')
      ) {
        console.warn('Firebase API key issue detected. Auto-falling back to local storage account registration.', err);
        return signupLocalUserHelper(email, pass, cleanUsername);
      }
      throw new Error(parseFirebaseError(err));
    }
  } else {
    const isAvailable = await checkUsernameAvailability(cleanUsername);
    if (!isAvailable) {
      throw new Error('Username already taken');
    }
    return signupLocalUserHelper(email, pass, cleanUsername);
  }
}

// 2. Log In User
export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  if (isRealFirebaseConfigured && auth && db) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      let profile = await getUserProfile(cred.user.uid);
      
      if (!profile) {
        profile = formatUser(cred.user);
        try {
          await setDoc(doc(db, 'users', cred.user.uid), {
            email: profile.email,
            username: profile.username,
            usernameLower: profile.username.toLowerCase(),
            displayName: profile.displayName,
            avatar: profile.avatar,
            createdAt: profile.createdAt,
            totalQuizzesCompleted: 0,
            highScore: 0
          }, { merge: true });
        } catch (err) {
          console.error('Error auto-creating Firestore user doc on login:', err);
        }
      }
      return profile;
    } catch (err: any) {
      const errCode = err.code || String(err.message || '');
      if (
        errCode.includes('auth/api-key-not-valid') ||
        errCode.includes('auth/invalid-api-key') ||
        errCode.includes('auth/configuration-not-found')
      ) {
        console.warn('Firebase API key issue detected. Auto-falling back to local storage login.', err);
        return loginLocalUserHelper(email, pass);
      }
      throw new Error(parseFirebaseError(err));
    }
  } else {
    return loginLocalUserHelper(email, pass);
  }
}

// 3. Log Out User
export async function logoutUser(): Promise<void> {
  if (isRealFirebaseConfigured && auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
    window.dispatchEvent(new Event('storage'));
  }
}

// 4. Get User Profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isRealFirebaseConfigured && db) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        const uname = data.username || data.displayName || '';
        return {
          uid: userId,
          email: data.email,
          username: uname,
          displayName: uname,
          avatar: data.avatar || 'animal_cyber_cat',
          createdAt: data.createdAt,
          totalQuizzesCompleted: data.totalQuizzesCompleted || 0,
          highScore: data.highScore || 0,
          preferredTheme: data.preferredTheme,
          soundEnabled: data.soundEnabled
        };
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    }
    return null;
  } else {
    const currentUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
    if (currentUser && currentUser.uid === userId) {
      return currentUser;
    }
    return null;
  }
}

// Update User Profile Avatar
export async function updateUserProfileAvatar(userId: string, newAvatarId: string): Promise<UserProfile> {
  if (isRealFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        avatar: newAvatarId
      });
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const uname = data.username || data.displayName || '';
        return {
          uid: userId,
          email: data.email,
          username: uname,
          displayName: uname,
          avatar: data.avatar || newAvatarId,
          createdAt: data.createdAt,
          totalQuizzesCompleted: data.totalQuizzesCompleted || 0,
          highScore: data.highScore || 0,
          preferredTheme: data.preferredTheme,
          soundEnabled: data.soundEnabled
        };
      }
    } catch (err) {
      console.error('Error updating avatar in Firestore:', err);
      throw err;
    }
  }

  // Local storage update
  const currentUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
  const updatedUser: UserProfile = currentUser && currentUser.uid === userId
    ? { ...currentUser, avatar: newAvatarId }
    : {
        uid: userId,
        email: currentUser?.email || 'guest@quizwiz.com',
        username: currentUser?.username || 'player',
        displayName: currentUser?.displayName || 'player',
        avatar: newAvatarId,
        createdAt: currentUser?.createdAt || new Date().toISOString(),
        totalQuizzesCompleted: currentUser?.totalQuizzesCompleted || 0,
        highScore: currentUser?.highScore || 0
      };

  setLocalData(LOCAL_CURRENT_USER_KEY, updatedUser);

  const users = getLocalData<Record<string, { email: string; pass: string; profile: UserProfile }>>(LOCAL_USERS_KEY, {});
  for (const em in users) {
    if (users[em].profile && users[em].profile.uid === userId) {
      users[em].profile = updatedUser;
    }
  }
  setLocalData(LOCAL_USERS_KEY, users);

  // Update existing leaderboard entries for this user in local storage
  const leaderboard = getLocalData<LeaderboardEntry[]>(LOCAL_LEADERBOARD_KEY, []);
  let updatedLb = false;
  leaderboard.forEach(entry => {
    if (entry.userId === userId) {
      entry.avatar = newAvatarId;
      updatedLb = true;
    }
  });
  if (updatedLb) {
    setLocalData(LOCAL_LEADERBOARD_KEY, leaderboard);
  }

  return updatedUser;
}

// Update User Profile Username
export async function updateUserProfileUsername(userId: string, newUsername: string): Promise<UserProfile> {
  const validation = validateUsernameRules(newUsername);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid username format.');
  }

  const isAvailable = await checkUsernameAvailability(newUsername, userId);
  if (!isAvailable) {
    throw new Error('Username already taken');
  }

  const cleanUsername = newUsername.trim();

  if (isRealFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        username: cleanUsername,
        usernameLower: cleanUsername.toLowerCase(),
        displayName: cleanUsername
      });
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          uid: userId,
          email: data.email,
          username: data.username || cleanUsername,
          displayName: data.username || cleanUsername,
          createdAt: data.createdAt,
          totalQuizzesCompleted: data.totalQuizzesCompleted || 0,
          highScore: data.highScore || 0,
          preferredTheme: data.preferredTheme,
          soundEnabled: data.soundEnabled
        };
      }
    } catch (err) {
      console.error('Error updating username in Firestore:', err);
      throw err;
    }
  }

  // Local storage update
  const currentUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
  const updatedUser: UserProfile = currentUser && currentUser.uid === userId
    ? { ...currentUser, username: cleanUsername, displayName: cleanUsername }
    : {
        uid: userId,
        email: currentUser?.email || 'guest@quizwiz.com',
        username: cleanUsername,
        displayName: cleanUsername,
        createdAt: currentUser?.createdAt || new Date().toISOString(),
        totalQuizzesCompleted: currentUser?.totalQuizzesCompleted || 0,
        highScore: currentUser?.highScore || 0
      };

  setLocalData(LOCAL_CURRENT_USER_KEY, updatedUser);

  const users = getLocalData<Record<string, { email: string; pass: string; profile: UserProfile }>>(LOCAL_USERS_KEY, {});
  for (const em in users) {
    if (users[em].profile && users[em].profile.uid === userId) {
      users[em].profile = updatedUser;
    }
  }
  setLocalData(LOCAL_USERS_KEY, users);

  // Update existing leaderboard entries for this user in local storage
  const leaderboard = getLocalData<LeaderboardEntry[]>(LOCAL_LEADERBOARD_KEY, []);
  let updatedLb = false;
  leaderboard.forEach(entry => {
    if (entry.userId === userId) {
      entry.displayName = cleanUsername;
      updatedLb = true;
    }
  });
  if (updatedLb) {
    setLocalData(LOCAL_LEADERBOARD_KEY, leaderboard);
  }

  return updatedUser;
}

// 5. Save Quiz Progress (Firestore Subcollection: users/{userId}/progress/quizSession)
export async function saveProgress(userId: string, progress: QuizProgress): Promise<void> {
  const updatedProgress = {
    ...progress,
    lastUpdated: new Date().toISOString()
  };

  if (isRealFirebaseConfigured && db) {
    try {
      // Document path: users/{userId}/progress/quizSession
      const progressRef = doc(db, 'users', userId, 'progress', 'quizSession');
      await setDoc(progressRef, updatedProgress, { merge: true });

      // Update user document high scores/totals
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentData = userSnap.data();
        const newHighScore = Math.max(currentData.highScore || 0, progress.score);
        const newTotal = progress.completed ? (currentData.totalQuizzesCompleted || 0) + 1 : (currentData.totalQuizzesCompleted || 0);
        await updateDoc(userRef, {
          highScore: newHighScore,
          totalQuizzesCompleted: newTotal
        });
      }
    } catch (err) {
      console.error('Error saving progress to Firestore:', err);
    }
  } else {
    setLocalData(LOCAL_PROGRESS_KEY + userId, updatedProgress);

    // Update local user stats
    const currentUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
    if (currentUser && currentUser.uid === userId) {
      currentUser.highScore = Math.max(currentUser.highScore || 0, progress.score);
      if (progress.completed) {
        currentUser.totalQuizzesCompleted = (currentUser.totalQuizzesCompleted || 0) + 1;
      }
      setLocalData(LOCAL_CURRENT_USER_KEY, currentUser);
    }
  }
}

// 6. Load Saved Progress
export async function loadProgress(userId: string): Promise<QuizProgress | null> {
  if (isRealFirebaseConfigured && db) {
    try {
      const progressRef = doc(db, 'users', userId, 'progress', 'quizSession');
      const snap = await getDoc(progressRef);
      if (snap.exists()) {
        return snap.data() as QuizProgress;
      }
    } catch (err) {
      console.error('Error loading progress from Firestore:', err);
    }
    return null;
  } else {
    return getLocalData<QuizProgress | null>(LOCAL_PROGRESS_KEY + userId, null);
  }
}

// 7. Clear Saved Progress
export async function clearProgress(userId: string): Promise<void> {
  if (isRealFirebaseConfigured && db) {
    try {
      const progressRef = doc(db, 'users', userId, 'progress', 'quizSession');
      await setDoc(progressRef, { completed: true, currentQuestionIndex: 0 }, { merge: true });
    } catch (err) {
      console.error('Error clearing progress in Firestore:', err);
    }
  } else {
    localStorage.removeItem(LOCAL_PROGRESS_KEY + userId);
  }
}

// 9. Update User Preferences (Theme & Sound)
export async function updateUserPreferences(userId: string, prefs: { preferredTheme?: 'artistic_flair' | 'playful_bright' | 'neon_cyber' | 'minimal_studio' | 'light' | 'dark'; soundEnabled?: boolean }): Promise<void> {
  if (isRealFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, prefs);
    } catch (err) {
      console.error('Error updating user preferences in Firestore:', err);
    }
  } else {
    const currentUser = getLocalData<UserProfile | null>(LOCAL_CURRENT_USER_KEY, null);
    if (currentUser && currentUser.uid === userId) {
      const updated = { ...currentUser, ...prefs };
      setLocalData(LOCAL_CURRENT_USER_KEY, updated);
      
      const users = getLocalData<Record<string, { email: string; pass: string; profile: UserProfile }>>(LOCAL_USERS_KEY, {});
      if (users[currentUser.email.toLowerCase()]) {
        users[currentUser.email.toLowerCase()].profile = updated;
        setLocalData(LOCAL_USERS_KEY, users);
      }
    }
  }
}

export async function saveScoreToLeaderboard(entry: LeaderboardEntry): Promise<void> {
  if (isRealFirebaseConfigured && db) {
    try {
      const leaderboardRef = doc(collection(db, 'leaderboards'));
      await setDoc(leaderboardRef, entry);
    } catch (err) {
      console.error('Error saving score to leaderboard:', err);
    }
  } else {
    const list = getLocalData<LeaderboardEntry[]>(LOCAL_LEADERBOARD_KEY, []);
    list.push(entry);
    list.sort((a, b) => b.score - a.score);
    setLocalData(LOCAL_LEADERBOARD_KEY, list.slice(0, 50));
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (isRealFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'leaderboards'), orderBy('score', 'desc'), limit(20));
      const querySnap = await getDocs(q);
      const list: LeaderboardEntry[] = [];
      querySnap.forEach((doc) => {
        list.push(doc.data() as LeaderboardEntry);
      });
      return list;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  }
  
  // Default mock leaderboard if none exists yet
  const defaults: LeaderboardEntry[] = [
    { userId: 'lb1', displayName: 'Alex Rivera', email: 'alex@quizwiz.com', categoryName: 'Science & Nature', score: 100, totalQuestions: 10, percentage: 100, date: '2026-07-28' },
    { userId: 'lb2', displayName: 'Samantha Tech', email: 'sam@quizwiz.com', categoryName: 'Computers & Tech', score: 90, totalQuestions: 10, percentage: 90, date: '2026-07-27' },
    { userId: 'lb3', displayName: 'Jordan Sparks', email: 'jordan@quizwiz.com', categoryName: 'General Knowledge', score: 80, totalQuestions: 10, percentage: 80, date: '2026-07-26' },
    { userId: 'lb4', displayName: 'Chris Geography', email: 'chris@quizwiz.com', categoryName: 'Geography', score: 70, totalQuestions: 10, percentage: 70, date: '2026-07-25' }
  ];

  const localList = getLocalData<LeaderboardEntry[]>(LOCAL_LEADERBOARD_KEY, defaults);
  return localList.sort((a, b) => b.score - a.score);
}

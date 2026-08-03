import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, QuizProgress } from '../types/quiz';
import {
  listenToAuthState,
  signupUser,
  loginUser,
  logoutUser,
  loadProgress,
  saveProgress,
  clearProgress,
  updateUserProfileUsername,
  updateUserProfileAvatar,
  isRealFirebaseConfigured
} from '../services/firebase';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isFirebase: boolean;
  activeProgress: QuizProgress | null;
  setActiveProgress: React.Dispatch<React.SetStateAction<QuizProgress | null>>;
  refreshProgress: () => Promise<QuizProgress | null>;
  saveCurrentProgress: (progress: QuizProgress) => Promise<void>;
  clearUserProgress: () => Promise<void>;
  signup: (email: string, pass: string, username: string) => Promise<UserProfile>;
  login: (email: string, pass: string) => Promise<UserProfile>;
  updateUsername: (newUsername: string) => Promise<UserProfile>;
  updateAvatar: (avatarId: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeProgress, setActiveProgress] = useState<QuizProgress | null>(null);

  useEffect(() => {
    const unsubscribe = listenToAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        const prog = await loadProgress(user.uid);
        setActiveProgress(prog);
      } else {
        setActiveProgress(null);
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const refreshProgress = async (): Promise<QuizProgress | null> => {
    if (!currentUser) return null;
    const prog = await loadProgress(currentUser.uid);
    setActiveProgress(prog);
    return prog;
  };

  const saveCurrentProgress = async (progress: QuizProgress): Promise<void> => {
    if (!currentUser) return;
    setActiveProgress(progress);
    await saveProgress(currentUser.uid, progress);
  };

  const clearUserProgress = async (): Promise<void> => {
    if (!currentUser) return;
    setActiveProgress(null);
    await clearProgress(currentUser.uid);
  };

  const signup = async (email: string, pass: string, username: string): Promise<UserProfile> => {
    const profile = await signupUser(email, pass, username);
    setCurrentUser(profile);
    const prog = await loadProgress(profile.uid);
    setActiveProgress(prog);
    return profile;
  };

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    const profile = await loginUser(email, pass);
    setCurrentUser(profile);
    const prog = await loadProgress(profile.uid);
    setActiveProgress(prog);
    return profile;
  };

  const updateUsername = async (newUsername: string): Promise<UserProfile> => {
    if (!currentUser) throw new Error('No active user logged in.');
    const updated = await updateUserProfileUsername(currentUser.uid, newUsername);
    setCurrentUser(updated);
    return updated;
  };

  const updateAvatar = async (avatarId: string): Promise<UserProfile> => {
    if (!currentUser) throw new Error('No active user logged in.');
    const updated = await updateUserProfileAvatar(currentUser.uid, avatarId);
    setCurrentUser(updated);
    return updated;
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setCurrentUser(null);
    setActiveProgress(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isFirebase: isRealFirebaseConfigured,
        activeProgress,
        setActiveProgress,
        refreshProgress,
        saveCurrentProgress,
        clearUserProgress,
        signup,
        login,
        updateUsername,
        updateAvatar,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

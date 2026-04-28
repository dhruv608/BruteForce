"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { studentProfileService } from '@/services/student/profile.service';
import { studentAuthService } from '@/services/student/auth.service';
import { Button } from '@/components/ui/button';
import { ProfileDataState, CurrentUserState, ApiError } from '@/types/student/index.types';
import { EditProfileModal } from '@/components/student/profile/EditProfileModal';
import { EditUsernameModal } from '@/components/student/profile/EditUsernameModal';
import { DeleteImageModal } from '@/components/student/profile/DeleteImageModal';
import { ProfilePageShimmer } from '@/components/student/profile/shimmers';
import { ProfileHeader } from '@/components/student/profile/ProfileHeader';
import { ProfileNotFound } from '@/components/student/profile/ProfileNotFound';
import { ProfileErrorState } from '@/components/student/profile/ProfileErrorState';
import { OverviewStats } from '@/components/student/profile/OverviewStats';
import { ProfileInfo } from '@/components/student/profile/ProfileInfo';
import { SocialLinks } from '@/components/student/profile/SocialLinks';
import { ProblemSolvingStats } from '@/components/student/profile/ProblemSolvingStats';
import ActivityHeatmap from '@/components/student/profile/ActivityHeatmap';
import { RecentActivity } from '@/components/student/profile/RecentActivity';
import TopicProgressModal from '@/components/student/topics/TopicProgressModal';
import { showSuccess } from '@/ui/toast';
import { getErrorMessage } from '@/errors';
import { useCanEditProfile } from '@/hooks/useCanEditProfile';

interface ProfileClientProps {
  username: string;
  initialData?: ProfileDataState;
}

export default function ProfileClient({ username, initialData }: ProfileClientProps) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileDataState>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsernameEditModal, setShowUsernameEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    github: '',
    linkedin: '',
    leetcode: '',
    gfg: ''
  });

  const [originalEditForm, setOriginalEditForm] = useState({
    name: '',
    github: '',
    linkedin: '',
    leetcode: '',
    gfg: ''
  });

  const [usernameForm, setUsernameForm] = useState({
    username: ''
  });
  const [currentUser, setCurrentUser] = useState<CurrentUserState | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const canEdit = useCanEditProfile({
    authChecked,
    currentUser,
    profileStudent: profileData?.student,
  });
  const [showTopicProgressModal, setShowTopicProgressModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFetching = useRef(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    const initializeProfile = async () => {
      // Skip profile fetch if initialData was provided (SSR pre-fetched)
      if (!initialData) {
        await fetchProfileByUsername();
      } else {
        // Still populate edit form from initialData
        if (initialData?.student) {
          const formValues = {
            name: initialData.student.name || '',
            github: initialData.student.github || '',
            linkedin: initialData.student.linkedin || '',
            leetcode: initialData.student.leetcode || '',
            gfg: initialData.student.gfg || ''
          };
          setEditForm(formValues);
          setOriginalEditForm(formValues);
        }
      }
      const { isStudentToken } = await import('@/lib/auth-utils');
      if (isStudentToken()) {
        await fetchCurrentUser().catch(() => {
          setCurrentUser(null);
          setAuthChecked(true);
        });
      } else {
        setCurrentUser(null);
        setAuthChecked(true);
      }
    };
    initializeProfile();
  }, [username]);

  const fetchCurrentUser = async () => {
    try {
      const user = await studentAuthService.getCurrentStudent().catch((e: unknown) => {
        console.error("Failed to fetch current user", e);
        const error = e as { response?: { data?: unknown; status?: number } };
        console.error("Error details:", error.response?.data, error.response?.status);
        return null;
      });
      setCurrentUser(user);
      if (user?.error === "Access denied. Students only.") {
        setCurrentUser(null);
        return;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Access denied. Students only.") {
          setCurrentUser(null);
          return;
        }
      }
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchProfileByUsername = async () => {
    if (!username) return;
    if (isFetching.current) return;
    setLoading(true);
    setProfileError(null);
    isFetching.current = true;
    try {
      const data = await studentProfileService.getProfileByUsername(username);
      setProfileData(data);
      const formValues = {
        name: data?.student?.name || '',
        github: data?.student?.github || '',
        linkedin: data?.student?.linkedin || '',
        leetcode: data?.student?.leetcode || '',
        gfg: data?.student?.gfg || ''
      };
      setEditForm(formValues);
      setOriginalEditForm(formValues);
      setUsernameForm({
        username: data?.student?.username || ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      setImageRemoved(false);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, { context: 'fetchProfileByUsername' });
      const apiError = err as ApiError;
      const isStudentNotFoundError =
        apiError?.response?.status === 404 ||
        (err as { code?: string })?.code === 'STUDENT_PROFILE_NOT_FOUND' ||
        errorMessage === "Student not found";
      setProfileError(errorMessage);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!canEdit) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      setImagePreview(previewUrl);
      setSelectedImage(file);
      setImageRemoved(false);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const needsImageUpload = selectedImage !== null;
      const needsImageDelete = imageRemoved;
      const needsProfileUpdate =
        editForm.github !== originalEditForm.github ||
        editForm.linkedin !== originalEditForm.linkedin;
      if (needsImageUpload) {
        await studentProfileService.updateProfileImage(selectedImage);
      }
      if (needsImageDelete) {
        await studentProfileService.deleteProfileImage();
      }
      if (needsProfileUpdate) {
        await studentProfileService.updateProfileDetails({
          github: editForm.github,
          linkedin: editForm.linkedin
        });
      }
      await fetchProfileByUsername();
      setShowEditModal(false);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      showSuccess('Profile updated successfully!');
    } catch (error) {
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveUsername = async () => {
    try {
      if (!usernameForm.username.trim()) {
        return;
      }
      const localStorageToken = localStorage.getItem('accessToken');
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const token = localStorageToken || cookieToken;
      if (!token) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }
      const newUsername = usernameForm.username.trim();
      await studentProfileService.updateUsername(newUsername);
      
      // Update local state immediately to prevent "username not found" flash
      setCurrentUser(prev => prev ? { ...prev, data: { ...prev.data, username: newUsername } } : null);
      setProfileData(prev => prev ? { ...prev, student: { ...prev.student, username: newUsername } } : null);
      setUsernameForm({ username: newUsername });
      
      setShowUsernameEditModal(false);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      if (newUsername !== username) {
        router.push(`/profile/${newUsername}`);
      }
      showSuccess('Username updated successfully!');
    } catch (error: unknown) {
    }
  };

  const handleDeleteImage = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteImage = () => {
    if (!canEdit) {
      setShowDeleteConfirm(false);
      return;
    }
    setImageRemoved(true);
    setImagePreview(null);
    setSelectedImage(null);
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return <ProfilePageShimmer />;
  }

  if (profileError && !profileError.includes("Student not found")) {
    return <ProfileErrorState error={profileError} />;
  }

  if (!profileData || !profileData.student) {
    return <ProfileNotFound username={username || undefined} error={profileError || undefined} />;
  }

  const { student, codingStats, streak, leaderboard, recentActivity, heatmap, heatmapStartMonth } = profileData || {
    student: {},
    codingStats: {},
    streak: {},
    leaderboard: {},
    recentActivity: [],
    heatmap: [],
    heatmapStartMonth: undefined
  };

  return (
    <div className="w-full max-w-325 xl:max-w-275 2xl:max-w-325  mx-auto pb-16 mt-3">

      {/* PROFILE HEADER */}


      <ProfileHeader
        student={student}
        canEdit={canEdit}
        onEditProfile={() => setShowEditModal(true)}
        onShowTopicProgress={() => setShowTopicProgressModal(true)}
        onEditUsername={() => setShowUsernameEditModal(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <OverviewStats
            leaderboard={leaderboard}
            streak={streak}
          />
          <ProfileInfo student={student} />
          <SocialLinks
            student={student}
            canEdit={canEdit}
            onEditSocialLinks={() => setShowEditModal(true)}
          />
        </div>
        <div className="lg:col-span-3 space-y-8">
          <ProblemSolvingStats codingStats={codingStats} />
          <ActivityHeatmap
            heatmap={heatmap || []}
            currentStreak={streak?.currentStreak}
            maxStreak={streak?.maxStreak}
          />
          <RecentActivity recentActivity={recentActivity} />
        </div>
      </div>
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
        editForm={editForm}
        setEditForm={setEditForm}
        uploading={uploading}
        savingProfile={savingProfile}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        handleDeleteImage={handleDeleteImage}
        handleSaveProfile={handleSaveProfile}
        imagePreview={imagePreview}
        imageRemoved={imageRemoved}
      />

      <EditUsernameModal
        isOpen={showUsernameEditModal}
        onClose={() => setShowUsernameEditModal(false)}
        usernameForm={usernameForm}
        setUsernameForm={setUsernameForm}
        handleSaveUsername={handleSaveUsername}
        currentUsername={currentUser?.data?.username}
      />

      <TopicProgressModal
        isOpen={showTopicProgressModal}
        onClose={() => setShowTopicProgressModal(false)}
        username={username}
      />

      {/* Delete Image Confirmation Dialog */}
      <DeleteImageModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteImage}
        uploading={uploading}
      />
    </div>
  );
}
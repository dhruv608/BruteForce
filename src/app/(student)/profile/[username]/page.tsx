import { getPublicStudentProfileService } from '@/lib/server/services/students/profile-public.service';
import ProfileClient from './ProfileClient';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  try {
    const data = await getPublicStudentProfileService(username);
    return {
      title: `${data.student.name} | BruteForce`,
      description: `DSA progress for ${data.student.name} on BruteForce`,
    };
  } catch {
    return {
      title: `${username} | BruteForce`,
    };
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  let initialData = null;
  try {
    initialData = await getPublicStudentProfileService(username);
  } catch {
    // Fall through — ProfileClient will handle loading/error state
  }

  return <ProfileClient username={username} initialData={initialData} />;
}

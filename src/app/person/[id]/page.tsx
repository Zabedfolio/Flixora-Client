import { notFound } from 'next/navigation';
import { getPersonFullData } from '@/data/person/personApi';
import PersonDetailsView from '@/components/person/PersonDetailsView';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getPersonFullData(resolvedParams.id);
  if (!data) return { title: 'Person Not Found - Flixora' };
  return {
    title: `${data.person.name} - Actor Profile & Filmography | Flixora`,
    description: data.person.biography?.slice(0, 160) || `Explore biography, photo gallery, and movies starring ${data.person.name} on Flixora.`,
  };
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getPersonFullData(resolvedParams.id);

  if (!data) {
    notFound();
  }

  return <PersonDetailsView data={data} />;
}

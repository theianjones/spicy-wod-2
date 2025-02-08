import type { MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import { getAllMovements } from '~/lib/movements';
import type { Route } from '../home/+types/route';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  return getAllMovements({ context });
}

export default function Index() {
  const { movements } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16 p-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to SpicyWOD
          </h1>
        </header>
        <div className="flex gap-4 flex-wrap">
          {movements.map(movement => (
            <div key={movement.id}>{movement.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

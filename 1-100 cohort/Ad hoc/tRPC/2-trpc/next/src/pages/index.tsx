import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const userQuery = trpc.user.me.useQuery();
  if (userQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (userQuery.error) {
    return <Signup />
  }
  return (
    <div>
      <p>HI {userQuery.data.email}</p>
    </div>
  );
}

function Signup() {
  return <div>
    Signup page
  </div>
}
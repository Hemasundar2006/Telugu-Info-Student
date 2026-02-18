import PostsFeed from './PostsFeed';

export default function Feed() {
  return (
    <PostsFeed
      initialTab="student"
      pageTitle="Feed"
      subtitle="Latest posts from students and companies in one place."
      showCreate={false}
    />
  );
}


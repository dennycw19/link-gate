import { HomeLinkList } from "~/components/shared/HomeLinkList";

export default async function Home() {
  // const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }

  return (
    <>
      <HomeLinkList />
    </>
  );
}

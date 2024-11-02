import YasumuLogo from '@/components/assets/YasumuLogo';

export default function Home() {
  return (
    <main className="w-full h-screen relative grid place-items-center">
      <div className="flex flex-col items-center justify-center opacity-10 -z-10 absolute">
        <YasumuLogo className="dark:invert-0 invert" height={256} width={256} />
        <h1 className="font-bold text-8xl">Yasumu</h1>
      </div>
    </main>
  );
}

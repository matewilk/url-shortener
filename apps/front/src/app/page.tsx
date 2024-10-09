import { Form } from "./components/Form";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="grid grid-rows-3 items-center justify-items-center min-h-screen pb-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-5xl font-bold">Shortify</h1>
        <Form />
      </main>
      <Footer />
    </div>
  );
}

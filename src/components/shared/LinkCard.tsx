import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export const LinkCard = () => {
  return (
    <div className="mx-4 flex flex-col justify-between gap-4 rounded-2xl border p-4 md:mx-8 md:flex-row md:gap-8">
      <div id="link-detail" className="flex- space-y-2">
        <h1 className="text-2xl font-bold">Judul</h1>
        <hr />
        <p className="text-muted-foreground text-justify text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          molestias omnis velit obcaecati pariatur amet dolorum accusamus iusto.
          Ipsum corrupti at reprehenderit, illo molestiae vitae itaque adipisci
          eligendi a, labore magni temporibus possimus. Ipsa, repellat culpa
          eveniet dolores ratione neque quos enim quasi dicta ab nihil
          voluptatum, officia sit distinctio.
        </p>
        <p>lorem10000</p>

        <div className="overflow-x-auto scroll-auto rounded-2xl border p-3">
          <Link
            href={
              "https://drive.google.com/drive/folders/1Ah1RjG6BXSQj2FH6VDi4bhRAXOzSItKx"
            }
            target="_blank"
            className="block break-all"
          >
            https://drive.google.com/drive/folders/1Ah1RjG6BXSQj2FH6VDi4bhRAXOzSItKxaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </Link>
        </div>
      </div>
      <div id="buttons" className="flex-1">
        <Button>Edit</Button>
      </div>
    </div>
  );
};

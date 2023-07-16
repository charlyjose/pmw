import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/registry/new-york/ui/button";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export async function Job() {
  const session = await getServerSession(authOptions);

  console.log(session);

  if (!session) {
    redirect("/signin?callbackUrl=/protected/server");
  }

  return (
    <>
      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle>Job Role</CardTitle>
          <CardDescription>Company Name</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="rounded-md h-screen max-h-screen">
            <div>
              <p className="p-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem mollis aliquam ut porttitor leo. Orci dapibus ultrices in
                iaculis nunc sed. Risus in hendrerit gravida rutrum quisque non
                tellus orci ac. Ac odio tempor orci dapibus ultrices in iaculis
                nunc sed. Cras ornare arcu dui vivamus arcu felis bibendum ut.
                Dui id ornare arcu odio ut sem nulla pharetra. Orci porta non
                pulvinar neque laoreet suspendisse interdum consectetur libero.
                Gravida dictum fusce ut placerat. Amet mauris commodo quis
                imperdiet massa. Diam quam nulla porttitor massa id. Ultricies
                integer quis auctor elit sed. Tortor pretium viverra suspendisse
                potenti. Eu consequat ac felis donec et odio pellentesque diam.
                Fermentum odio eu feugiat pretium nibh. Commodo viverra maecenas
                accumsan lacus vel facilisis. Vestibulum lectus mauris ultrices
                eros. Amet consectetur adipiscing elit pellentesque habitant
                morbi tristique senectus et. Scelerisque in dictum non
                consectetur a erat nam at lectus. Lacus vel facilisis volutpat
                est velit egestas dui id.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>
              <p className="p-5">
                Massa ultricies mi quis hendrerit dolor magna. Nunc sed blandit
                libero volutpat sed cras ornare arcu dui. Et malesuada fames ac
                turpis egestas maecenas pharetra. Blandit massa enim nec dui
                nunc mattis. Id donec ultrices tincidunt arcu non. Velit laoreet
                id donec ultrices tincidunt arcu non. Lacus suspendisse faucibus
                interdum posuere lorem ipsum. Purus viverra accumsan in nisl
                nisi scelerisque eu. Diam in arcu cursus euismod quis viverra.
                Pellentesque elit ullamcorper dignissim cras tincidunt lobortis
                feugiat. Aliquam ultrices sagittis orci a. Duis at consectetur
                lorem donec massa. Enim tortor at auctor urna. Consectetur a
                erat nam at lectus urna duis convallis convallis. Ipsum nunc
                aliquet bibendum enim. Lorem dolor sed viverra ipsum nunc.
                Blandit cursus risus at ultrices mi tempus. Aliquam faucibus
                purus in massa tempor nec feugiat nisl pretium. Eget nunc
                scelerisque viverra mauris in aliquam sem. Vel quam elementum
                pulvinar etiam non quam lacus suspendisse faucibus.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>

              <p className="p-5">
                Velit scelerisque in dictum non consectetur a. Viverra
                adipiscing at in tellus integer feugiat scelerisque. Commodo
                odio aenean sed adipiscing diam donec. Arcu cursus euismod quis
                viverra nibh. Duis at consectetur lorem donec. Gravida in
                fermentum et sollicitudin ac orci phasellus egestas tellus. Nunc
                pulvinar sapien et ligula ullamcorper malesuada proin. Erat
                imperdiet sed euismod nisi porta lorem. Amet commodo nulla
                facilisi nullam vehicula ipsum a arcu. Lacinia at quis risus sed
                vulputate odio ut enim blandit. Diam maecenas sed enim ut sem
                viverra aliquet eget sit. Viverra aliquet eget sit amet. Quam
                lacus suspendisse faucibus interdum posuere lorem ipsum dolor.
                Pellentesque massa placerat duis ultricies. In fermentum et
                sollicitudin ac orci phasellus egestas tellus. Suspendisse
                faucibus interdum posuere lorem ipsum dolor sit amet
                consectetur.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="grid gap-6 bg-slate-50 pt-6">
          <div className="text-left text-lg font-bold">
            <span className="px-1 bg-lime-300 mr-2"></span>
            More Details
            <Separator className="my-1" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                SALARY
              </div>
              <div className="text-sm font-normal">£30,000</div>
            </div>
            {/* <div></div> */}

            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                DEADLINE
              </div>
              <div className="text-sm font-normal">30 July 2023</div>
            </div>
            {/* <div></div> */}

            <div className="grid gap-1">
              <div className="text-xs font-light">
                <span className="px-1 bg-lime-300 mr-2"></span>
                LOCATIONS
              </div>
              <div className="text-sm font-normal">
                London, Manchester, Leeds
              </div>
            </div>
            {/* <div></div> */}

            <div className="grid gap-1">
              <div className="text-right text-xs font-medium hover:underline">
                <Button>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <Link href="">Apply</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
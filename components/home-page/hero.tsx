// React and Next.js imports
import Link from "next/link";
import Image from "next/image";

// Third-party library imports
import Balancer from "react-wrap-balancer";
import { Droplet, Leaf } from "lucide-react";

// Local component imports
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

// Asset imports
import Logo from "@/public/hero_dummy_image.svg";

const Hero = () => {
  return (
    <Section>
      <Container className="flex flex-col items-center text-center">
        <Image
          src={Logo}
          width={172}
          height={72}
          alt="Company Logo"
          className="not-prose mb-6 dark:invert md:mb-8"
        />
        <h1 className="!mb-0 text-green-700 dark:text-green-400">
          <Balancer>
            Optimisez la gestion de l'eau pour une agriculture durable.
          </Balancer>
        </h1>
        <h3 className="text-muted-foreground text-gray-600 dark:text-gray-300">
          <Balancer>
            Notre solution connectée vous aide à économiser l'eau tout en
            maximisant vos rendements agricoles.
          </Balancer>
        </h3>
        <div className="not-prose mt-6 flex gap-2 md:mt-12">
          <Button variant={"default"} asChild>
            <Link href="/">
              <Droplet className="mr-2" />
              Découvrir la Solution
            </Link>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href="/posts">
              En savoir plus <Leaf className="ml-1" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;

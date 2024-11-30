// React and Next.js
import React from "react";

// Layout Components
import { Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";

// Icons
import { Droplet, Leaf, Sun } from "lucide-react";

type FeatureText = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const featureText: FeatureText[] = [
  {
    icon: <Droplet className="h-6 w-6 text-blue-500" />,
    title: "Gestion Optimale de l'Eau",
    description:
      "Suivez et contrôlez l'irrigation en temps réel grâce à des capteurs intelligents pour réduire le gaspillage d'eau.",
  },
  {
    icon: <Leaf className="h-6 w-6 text-green-500" />,
    title: "Soutien à l'Agriculture Durable",
    description:
      "Nos outils permettent une gestion respectueuse de l'environnement, favorisant des pratiques agricoles écoresponsables.",
  },
  {
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    title: "Optimisation des Rendements",
    description:
      "Analysez les besoins de vos cultures et optimisez les ressources pour obtenir des rendements maximaux.",
  },
];

const Services = () => {
  return (
    <Section className="border-b">
      <Container className="not-prose">
        <div className="flex flex-col gap-6">
          <h3 className="text-4xl text-green-700 dark:text-green-400">
            <Balancer>
              Transformez votre gestion de l'eau avec nos solutions innovantes
            </Balancer>
          </h3>
          <h4 className="text-2xl font-light text-gray-600 dark:text-gray-300">
            <Balancer>
              Une approche durable et intelligente pour une agriculture
              performante
            </Balancer>
          </h4>

          <div className="mt-6 grid gap-6 md:mt-12 md:grid-cols-3">
            {featureText.map(({ icon, title, description }, index) => (
              <div
                className="flex flex-col gap-4 border p-4 rounded-lg shadow-md hover:shadow-lg"
                key={index}
              >
                {icon}
                <h4 className="text-xl text-blue-600 dark:text-blue-400">
                  {title}
                </h4>
                <p className="text-base text-gray-700 dark:text-gray-300 opacity-90">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Services;

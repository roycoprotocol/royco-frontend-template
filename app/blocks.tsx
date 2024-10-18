import { Fragment } from "react";
import {
  Benefits,
  Community,
  Footer,
  Funding,
  Header,
  Markets,
  Partners,
  Working,
} from "./_components/ui";

export const Blocks = () => {
  return (
    <Fragment>
      <Header />
      <Funding />
      <Working />
      <Benefits />
      <Markets />
      <Partners />
      <Community />
      <Footer />
    </Fragment>
  );
};

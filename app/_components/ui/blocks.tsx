"use client";

import { Footer } from "./footer";
import { Benefits } from "./benefits";
import { Community } from "./community";
import { Funding } from "./funding";
import { Header } from "./header";
import { Markets } from "./markets";
import { Partners } from "./partners";
import { AccessProtocol } from "./access-protocol";
import { Working } from "./working";

import { motion, useScroll, useTransform } from "framer-motion";
import useMeasure from "react-use-measure";
import { useRef } from "react";
import { FadeInMotionWrapper } from "./composables";

export const Blocks = () => {
  return (
    <div className="contents">
      <motion.div>
        <Header />
      </motion.div>

      <motion.div>
        {/* <Funding /> */}

        <FadeInMotionWrapper>
          <Working />
        </FadeInMotionWrapper>

        <FadeInMotionWrapper>
          <Benefits />
        </FadeInMotionWrapper>

        <FadeInMotionWrapper>
          <Markets />
        </FadeInMotionWrapper>

        <FadeInMotionWrapper>
          <AccessProtocol />
        </FadeInMotionWrapper>

        <FadeInMotionWrapper>
          <Partners />
        </FadeInMotionWrapper>

        <FadeInMotionWrapper>
          <Community />
        </FadeInMotionWrapper>

        <Footer />
      </motion.div>
    </div>
  );
};

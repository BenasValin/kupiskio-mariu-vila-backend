import { motion } from "framer-motion";
import { ReactElement } from "react";

const AnimatedContainer = ({
  delay = 0,
  children,
}: {
  delay?: number;
  children: ReactElement;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", delay: delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;

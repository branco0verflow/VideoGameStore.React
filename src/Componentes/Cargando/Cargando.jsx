import { motion } from "framer-motion";

const Cargando = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <motion.div
        className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default Cargando;
